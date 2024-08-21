"use server";
import { db } from "@/db";
import { sql, eq } from "drizzle-orm";
import { songs } from "@/schema";
import getSongDBData from "./getSongDBData";
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
  // make sure this song and playlist even exists in the DB (this function creates them if not)
  await getSongDBData(trackId, playlistId, name, playlistName);
  const bracketSize = 2 ** numRounds;
  console.log(
    "IN UPDATEPHOTODATA FOR ",
    name,
    " ROUND REACHED IS ",
    roundReached,
    " NUMROUNDS IS ",
    numRounds,
    " BRACKET SIZE IS ",
    bracketSize,
    " TRACK ID IS ",
    trackId,
    " ISWINNER IS ",
    isWinner,
  );
  const calculatedScore = (roundReached / (numRounds + 1)) * (bracketSize / 2);
  console.log(
    "(roundReached / numRounds+1) IS ",
    roundReached / (numRounds + 1),
    " AND (bracketSize / 2) IS ",
    bracketSize / 2,
  );
  console.log("CALCULATED SCORE IS ", calculatedScore);

  await db.execute(
    sql`UPDATE songs SET total_rounds = total_rounds + ${roundReached}, total_bracket_size = total_bracket_size + ${bracketSize}, total_score = total_score + ${calculatedScore}, games_played = games_played + 1 WHERE track_id = ${trackId}`,
  );

  if (isWinner) {
    await db.execute(
      sql`UPDATE songs SET games_won = games_won + 1 WHERE track_id = ${trackId}`,
    );
  }
  const oldSongRatingQuery = await db
    .select({
      rating: songs.rating,
    })
    .from(songs)
    .where(eq(songs.trackId, trackId));

  const oldSongRating = oldSongRatingQuery[0].rating as number;

  await db.execute(
    sql`UPDATE songs
    SET rating = 65 + (35 * (total_score / (total_bracket_size / 2))) * LEAST(1, LOG(games_played + 1) / LOG(2) / (LOG(100) / LOG(2)))
    WHERE games_played > 0;`,
  );

  // code below is to update redis

  // Fetch updated song data
  const updatedSongQuery = await db
    .select({
      rating: songs.rating,
      gamesPlayed: songs.gamesPlayed,
      gamesWon: songs.gamesWon,
    })
    .from(songs)
    .where(eq(songs.trackId, trackId));

  const updatedSong = updatedSongQuery[0];
  const newSongRating = updatedSong.rating as number;
  const gamesPlayed = updatedSong.gamesPlayed as number;
  const gamesWon = updatedSong.gamesWon as number;

  // Calculate win rate
  const winRate = gamesPlayed > 0 ? gamesWon / gamesPlayed : 0;

  // Update Redis cache
  const redisKey = `playlist-stats:${playlistId}`;
  const cachedData = await redis.get(redisKey);

  if (cachedData) {
    console.log("UPDATING EXISTING CACHE...");
    const parsedData = JSON.parse(cachedData);
    const songIndex = parsedData.findIndex((song: any) => song.id === trackId);

    if (songIndex !== -1) {
      parsedData[songIndex] = {
        ...parsedData[songIndex],
        rating: newSongRating,
        winRate,
        gamesPlayed,
        gamesWon,
      };

      await redis.set(redisKey, JSON.stringify(parsedData));
    }
  }

  console.log("UPDATED DB FOR ", name);
  return { oldSongRating, newSongRating };
}
