"use server";

import { PrismaClient } from "@prisma/client";
import type { ScoreEntry } from "@/types";

const prisma = new PrismaClient();

export default async function getTopScoresByPlaylistIdAndTimer(
  spotifyPlaylistId: string | undefined,
  timer: number,
): Promise<{
  topScoresWithHints: ScoreEntry[];
  topScoresWithoutHints: ScoreEntry[];
} | null> {
  if (!spotifyPlaylistId) return null;
  // Find all playlists with the given spotifyPlaylistId
  const playlists = await prisma.playlist.findMany({
    where: {
      spotifyPlaylistId: spotifyPlaylistId,
      timer: timer,
    },
    include: {
      plays: {
        include: {
          user: true,
          playlist: true,
        },
      },
    },
  });

  // If there are no playlists, return null
  if (playlists.length === 0) {
    return null;
  }

  // Flatten all plays from all playlists
  const allPlays = playlists.flatMap((playlist: any) => playlist.plays);

  // Filter and sort the plays for showHints = false
  const topScoresWithoutHints = allPlays
    .filter((play) => !play.playlist.showHints)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((play) => ({
      score: play.score,
      timestamp: play.createdAt,
      name: play.user.name,
      id: play.user.userId,
    }));

  // Filter and sort the plays for showHints = true
  const topScoresWithHints = allPlays
    .filter((play) => play.playlist.showHints)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((play) => ({
      score: play.score,
      timestamp: play.createdAt,
      name: play.user.name,
      id: play.user.userId,
    }));

  return {
    topScoresWithHints,
    topScoresWithoutHints,
  };
}
