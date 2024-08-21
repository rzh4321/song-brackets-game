import getSongDBData from "@/actions/getSongDBData";
import { useState, useEffect, useCallback } from "react";
import type { Song, SongDBStats } from "@/types";
import {
  cachePlaylistSongStats,
  getCachedPlaylistSongStats,
} from "@/actions/redisActions";

export default function useSongDBStats(
  playlistName: string,
  playlistId: string,
  songs: Song[],
) {
  const [songsWithStats, setSongsWithStats] = useState<SongDBStats[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStatsFromDB = useCallback(async () => {
    setLoading(true);
    const res: SongDBStats[] = [];
    for (let i = 0; i < songs.length; ++i) {
      const song = songs[i];
      const songWithStats = await getSongDBData(
        song.id,
        playlistId,
        song.name,
        playlistName,
      );
      res.push(songWithStats);
    }
    // cache leaderboard
    cachePlaylistSongStats(playlistId, res);
    setSongsWithStats(res);
    setLoading(false);
  }, [playlistName, playlistId, songs]);

  const fetchStats = useCallback(
    async (bypassCache: boolean = false) => {
      if (!bypassCache) {
        console.log("CHECKING CACHE FOR LEADERBOARD....");
        const cachedData = await getCachedPlaylistSongStats(playlistId);
        if (cachedData) {
          console.log("CACHE HIT FOR LEADERBOARD");
          setSongsWithStats(cachedData);
          console.log(cachedData[0]);
          setLoading(false);
          return;
        }
      }
      await fetchStatsFromDB();
    },
    [playlistId, fetchStatsFromDB],
  );

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const refreshStats = useCallback(() => {
    fetchStats(true);
  }, [fetchStats]);

  return { songsWithStats, loading, refreshStats };
}
