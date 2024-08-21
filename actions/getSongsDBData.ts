"use server";
import { db } from "@/db";
import { songs, playlists } from "@/schema";
import { eq } from "drizzle-orm";
import type { SongDBStats } from "@/types";

export default async function getSongsDBData(playlistId: string) {
  console.log("IN GETSONGSDBDATA");
  const res = await db
    .select({
      id: songs.trackId,
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
    .where(eq(playlistId as any, songs.playlistId));

  const songsWithWR = res.map((obj) => ({
    ...obj,
    winRate:
      obj.gamesPlayed === 0
        ? 0
        : (((obj.gamesWon as number) / obj.gamesPlayed!) as number),
  }));

  return songsWithWR as SongDBStats[];
}
