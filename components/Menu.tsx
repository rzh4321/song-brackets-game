"use client";

import type { PlaylistInfo, Song } from "@/types";
import MenuOptions from "./MenuOptions";
import Leaderboard from "./Leaderboard";
import SongCard from "./SongCard";
import Image from "next/image";
import { useState } from "react";
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

  const showMoreItems = () => {
    setVisibleCount((prevVisibleCount) => prevVisibleCount + 10);
  };

  // Get the songs to display
  const itemsToDisplay = songs?.slice(0, visibleCount);
  return (
    <div className="w-full z-[1]">
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
