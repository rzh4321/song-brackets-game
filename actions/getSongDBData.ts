"use server";
import { db } from "@/db";
import { songs, playlists } from "@/schema";
import { eq } from "drizzle-orm";
import type { SongWithStatsType } from "@/types";

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
    });
    return {
      id: trackId,
      playlistId: playlistId,
      gamesPlayed: 0,
      gamesWon: 0,
      totalBracketSize: 0,
      totalRounds: 0,
      totalScore: 0,
    };
  }
  return res[0];
}
