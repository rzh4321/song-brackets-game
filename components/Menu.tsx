"use client";

import type { PlaylistInfo, Song } from "@/types";
import MenuOptions from "./MenuOptions";
import Leaderboard from "./Leaderboard";
import SongCard from "./SongCard";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { RefreshCcw } from "lucide-react";

type MenuProps = {
  playlistInfo: PlaylistInfo;
  songs: Song[];
  setShowTournament: React.Dispatch<React.SetStateAction<boolean>>;
  form: any;
  refetch: () => Promise<void>;
};

export default function Menu({
  playlistInfo,
  songs,
  setShowTournament,
  form,
  refetch,
}: MenuProps) {
  const [visibleCount, setVisibleCount] = useState(10);
  const [playedSongs, setPlayedSongs] = useState<Set<string>>(new Set());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const showMoreItems = () => {
    setVisibleCount((prevVisibleCount) => prevVisibleCount + 10);
  };

  // Function to get a random unplayed song
  const getRandomUnplayedSong = () => {
    const unplayedSongs = songs.filter((song) => !playedSongs.has(song.id));
    // console.log('PLAYED SONGS IS ', playedSongs);
    // console.log('LENGTH OF UNPLAYED SONGS IS ', unplayedSongs.length);
    // console.log('UNPLAYED SONGS IS ', unplayedSongs);
    if (unplayedSongs.length === 0) {
      console.log("HI");
      // If all songs have been played, reset the played songs
      setPlayedSongs(new Set());
      return songs[Math.floor(Math.random() * songs.length)];
    }
    return unplayedSongs[Math.floor(Math.random() * unplayedSongs.length)];
  };

  // Function to play the next song
  const playNextSong = () => {
    const playSong = async () => {
      const nextSong = getRandomUnplayedSong();
      console.log("NEXT RANDOM SONG IS ", nextSong.name);
      if (audioRef.current) {
        // console.log('ATTACHING URL TO AUDIOREF AND PLAYING IT NOW...')
        audioRef.current.src = nextSong.url;
        // await audioRef.current.play();
        // console.log('SHOULD BE PLAYING NOW')
        setPlayedSongs((prev) => new Set(prev).add(nextSong.id));
        console.log(playedSongs);
      }
    };
    playSong();
  };

  useEffect(() => {
    document.body.addEventListener("mousemove", function () {
      audioRef.current?.play();
    });
    if (songs.length > 0 && audioRef.current) {
      // console.log('THIS SHOULD ONLY RUN ONCE, ON MOUNT')
      audioRef.current.addEventListener("ended", playNextSong);
      // console.log('PLAYING FIRST SONG NOW...')
      playNextSong(); // Start playing when component mounts
      const prevAudioRef = audioRef;
      return () => {
        if (prevAudioRef.current) {
          prevAudioRef.current.removeEventListener("ended", playNextSong);
          prevAudioRef.current.pause();
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get the songs to display
  const itemsToDisplay = songs?.slice(0, visibleCount);
  return (
    <div className="w-full z-[1]">
      <audio ref={audioRef} playsInline autoPlay className="hidden" />
      <div className="flex flex-col gap-5">
        <div className="flex justify-between">
          <div className="flex gap-2 items-center mr-4">
            <div className="hidden sm:block">
              <Image
                alt="playlist-image"
                src={playlistInfo?.image as string}
                width={200}
                height={200}
              />
            </div>
            <div className="space-y-3">
              <div className="tracking-tighter">PLAYLIST</div>
              <div className="sm:text-3xl text-xl font-bold">
                {playlistInfo?.name}
              </div>
              <div className="text-xs">{playlistInfo?.description}</div>
              <div className="text-xs">
                {playlistInfo?.owner} - {playlistInfo?.count} Songs
              </div>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Leaderboard
              name={playlistInfo?.name}
              songs={songs}
              playlistInfo={playlistInfo}
            />
            <MenuOptions
              playlistInfo={playlistInfo}
              setShowTournament={setShowTournament}
              form={form}
            />
          </div>
        </div>
        <Button
          className="flex gap-1 w-fit"
          variant={"spotify"}
          onClick={refetch}
        >
          <RefreshCcw className="w-[20px]" />
          <span className="text-xs">Refresh</span>
        </Button>
        {itemsToDisplay?.map((song: Song, ind) => (
          <SongCard key={song.id} songObj={song} num={ind + 1} />
        ))}
        {songs && visibleCount < songs.length && (
          <Button
            onClick={showMoreItems}
            className="self-center"
            variant={"blue"}
          >
            Show More
          </Button>
        )}
      </div>
    </div>
  );
}
