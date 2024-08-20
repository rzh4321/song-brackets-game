import getSongDBData from "@/actions/getSongDBData";
import { useState, useEffect } from "react";
import type { Song, SongDBStats } from "@/types";

export default function useSongDBStats(
  playlistName: string,
  playlistId: string,
  songs: Song[],
) {
  const [songsWithStats, setSongsWithStats] = useState<SongDBStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
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
      setSongsWithStats(res);
    };
    fetchStats();
  }, [playlistName, playlistId, songs]);

  useEffect(() => {
    if (songsWithStats?.length > 0) {
      setLoading(false);
    }
  }, [songsWithStats]);

  return { songsWithStats, loading };
}
