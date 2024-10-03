"use server";
import { db } from "@/db";
import { sql, eq, and } from "drizzle-orm";
import { songs, playlists } from "@/schema";
import getSongDBData from "./getSongsDBData";
import redis from "@/redis";

export default async function updateSongData(
  trackId: string,
  playlistId: string,
  playlistName: string,
  roundReached: number,
  numRounds: number,
  name: string,
  isWinner: boolean,
) {
  // make sure this song and playlist even exists in the DB
  let playlistRes = await db
    .select({
      playlistId: playlists.playlistId,
    })
    .from(playlists)
    .where(eq(playlistId as any, playlists.playlistId));

  if (playlistRes.length == 0) {
    // console.log("THIS PLAYLIST DOESNT EXIST YET. CREAETING ONE NOW...");
    await db.insert(playlists).values({
      playlistId: playlistId,
      name: playlistName,
    });
  }
  let res = await db
    .select({
      id: songs.trackId,
      // playlistId: songs.playlistId,
      // gamesPlayed: songs.gamesPlayed,
      // gamesWon: songs.gamesWon,
      // totalScore: songs.totalScore,
      // totalRounds: songs.totalRounds,
      // totalBracketSize: songs.totalBracketSize,
      // rating: songs.rating,
      // name: songs.name,
    })
    .from(songs)
    .where(
      and(
        eq(trackId as any, songs.trackId),
        eq(playlistId as any, songs.playlistId),
      ),
    );

  // console.log("RES IS ", res);

  if (res.length == 0) {
    // console.log(
    //   "THIS SONG IN THIS PLAYLIST DOESNT EXIST YET, INSERTING THIS SONG TO DB",
    // );
    await db.insert(songs).values({
      trackId: trackId,
      playlistId: playlistId,
      gamesPlayed: 0,
      gamesWon: 0,
      totalBracketSize: 0,
      totalRounds: 0,
      totalScore: 0,
      name: name,
      rating: 65,
    });
  }

  // once we reach here, the song will exist in DB. We can update it now

  const bracketSize = 2 ** numRounds;
  // console.log(
  //   "IN UPDATEPHOTODATA FOR ",
  //   name,
  //   " ROUND REACHED IS ",
  //   roundReached,
  //   " ISWINNER IS ",
  //   isWinner,
  // );
  const calculatedScore = (roundReached / (numRounds + 1)) * (bracketSize / 2);
  // console.log(
  //   "(roundReached / numRounds+1) IS ",
  //   roundReached / (numRounds + 1),
  //   " AND (bracketSize / 2) IS ",
  //   bracketSize / 2,
  // );
  // console.log("CALCULATED SCORE IS ", calculatedScore);

  await db.execute(
    sql`UPDATE songs SET total_rounds = total_rounds + ${roundReached}, total_bracket_size = total_bracket_size + ${bracketSize}, total_score = total_score + ${calculatedScore}, games_played = games_played + 1 WHERE track_id = ${trackId} AND playlist_id = ${playlistId}`,
  );

  if (isWinner) {
    await db.execute(
      sql`UPDATE songs SET games_won = games_won + 1 WHERE track_id = ${trackId} AND playlist_id = ${playlistId}`,
    );
  }
  const oldSongRatingQuery = await db
    .select({
      rating: songs.rating,
    })
    .from(songs)
    .where(
      and(
        eq(trackId as any, songs.trackId),
        eq(playlistId as any, songs.playlistId),
      ),
    );

  const oldSongRating = oldSongRatingQuery[0].rating as number;
  // console.log('OLD SONG RATING IS ', oldSongRating);

  // update rating
  await db.execute(
    sql`UPDATE songs
    SET rating = 65 + (35 * (total_score / (total_bracket_size / 2))) * LEAST(1, LOG(games_played + 1) / LOG(2) / (LOG(100) / LOG(2)))
    WHERE games_played > 0 AND track_id = ${trackId} AND playlist_id = ${playlistId};`,
  );

  
  // Fetch updated song data
  const updatedSongQuery = await db
  .select({
    rating: songs.rating,
    gamesPlayed: songs.gamesPlayed,
    gamesWon: songs.gamesWon,
  })
  .from(songs)
  .where(and(
    eq(trackId as any, songs.trackId),
    eq(playlistId as any, songs.playlistId),
  ),);
  // console.log('UPDATEDSONGOBJ IS ', updatedSongQuery)
  
  const updatedSong = updatedSongQuery[0];
  const newSongRating = updatedSong.rating as number;
  const gamesPlayed = updatedSong.gamesPlayed as number;
  const gamesWon = updatedSong.gamesWon as number;
  
  // console.log('NEW SONG RATING IS ', newSongRating);
  
  // Calculate win rate
  const winRate = gamesPlayed > 0 ? gamesWon / gamesPlayed : 0;
  
  // code below is to update redis
  // Update Redis cache
  const redisKey = `playlist-stats:${playlistId}`;
  const cachedData = await redis.get(redisKey);

  if (cachedData) {
    // console.log("UPDATING EXISTING CACHE...");
    const parsedData = JSON.parse(cachedData);
    const songIndex = parsedData.findIndex((song: any) => song.id === trackId);

    if (songIndex !== -1) {
      // console.log(name, ' CACHE DATA IS ', parsedData[songIndex]);

      // Update existing song data
      parsedData[songIndex] = {
        ...parsedData[songIndex],
        rating: newSongRating,
        winRate,
        gamesPlayed,
        gamesWon,
      };
      // console.log(name, ' NEW UPDATED CACHE DATA IS ', parsedData[songIndex]);

    } else {
      // Add new song data. This happens if this song has never been played before
      // console.log("ADDING NEW SONG", name, "  TO CACHE...");
      parsedData.push({
        id: trackId,
        name,
        rating: newSongRating,
        winRate,
        gamesPlayed,
        gamesWon,
      });
      // console.log(name, ' NEW UPDATED CACHE DATA IS ', parsedData[parsedData.length-1]);

    }


    await redis.set(redisKey, JSON.stringify(parsedData));

  }

  // console.log("UPDATED DB FOR ", name);
  return { oldSongRating, newSongRating };
}
