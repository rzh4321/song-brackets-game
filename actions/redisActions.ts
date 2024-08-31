"use server";
import redis from "@/redis";
import type { Song, PlaylistInfo, SongDBStats } from "@/types";

export async function getCachedPlaylistData(playlistId: string) {
  const cachedData = await redis.get(`playlist:${playlistId}`);
  return cachedData ? JSON.parse(cachedData) : null;
}

export async function cachePlaylistData(
  playlistId: string,
  data: { songsArr: Song[]; playlistInfo: PlaylistInfo },
) {
  await redis.set(`playlist:${playlistId}`, JSON.stringify(data), "EX", 86400); // Cache for 1 hour
}

export async function cachePlaylistSongStats(
  playlistId: string,
  data: SongDBStats[],
) {
  await redis.set(
    `playlist-stats:${playlistId}`,
    JSON.stringify(data),
    "EX",
    3600,
  ); // Cache for 1 hour
}

export async function getCachedPlaylistSongStats(playlistId: string) {
  const cachedData = await redis.get(`playlist-stats:${playlistId}`);
  return cachedData ? JSON.parse(cachedData) : null;
}
