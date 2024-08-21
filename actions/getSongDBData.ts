"use server";
import { db } from "@/db";
import { songs, playlists } from "@/schema";
import { eq } from "drizzle-orm";
import type { SongDBStats } from "@/types";

export default async function getSongDBData(
  trackId: string,
  playlistId: string,
  songName: string,
  playlistName: string,
) {
  // console.log("IN GETSONGDBDATA. SONG NAME IS ", songName);
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
      playlistId: songs.playlistId,
      gamesPlayed: songs.gamesPlayed,
      gamesWon: songs.gamesWon,
      totalScore: songs.totalScore,
      totalRounds: songs.totalRounds,
      totalBracketSize: songs.totalBracketSize,
      rating: songs.rating,
      name: songs.name,
    })
    .from(songs)
    .where(eq(trackId as any, songs.trackId));

  // console.log("RES IS ", res);

  if (res.length == 0) {
    // console.log("RES IS EMPTY, INSERTING THIS SONG TO DB");
    await db.insert(songs).values({
      trackId: trackId,
      playlistId: playlistId,
      gamesPlayed: 0,
      gamesWon: 0,
      totalBracketSize: 0,
      totalRounds: 0,
      totalScore: 0,
      name: songName,
      rating: 65,
    });
    return {
      id: trackId,
      playlistId: playlistId,
      gamesPlayed: 0,
      gamesWon: 0,
      totalBracketSize: 0,
      totalRounds: 0,
      totalScore: 0,
      rating: 65,
      name: songName,
      winRate: 0,
    };
  }

  const resWithWR = {
    ...res[0],
    winRate:
      res[0].gamesPlayed === 0
        ? 0
        : (((res[0].gamesWon as number) / res[0].gamesPlayed!) as number),
  };
  return resWithWR as SongDBStats;
}
