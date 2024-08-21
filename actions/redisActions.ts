"use server";
import redis from "@/redis";
import type { Song, PlaylistInfo } from "@/types";

export async function getCachedPlaylistData(playlistId: string) {
  const cachedData = await redis.get(`playlist:${playlistId}`);
  return cachedData ? JSON.parse(cachedData) : null;
}

export async function cachePlaylistData(
  playlistId: string,
  data: { songsArr: Song[]; playlistInfo: PlaylistInfo },
) {
  await redis.set(`playlist:${playlistId}`, JSON.stringify(data), "EX", 3600); // Cache for 1 hour
}
