"use client";
import usePlaylist from "@/hooks/usePlaylist";
import { Loader } from "lucide-react";
import ErrorMessage from "./ErrorMessage";
import Game from "./Game";

export default function GameWrapper({
  playlistId,
  userId,
}: {
  playlistId: string;
  userId: number;
}) {
  const { data, isLoading, error, refetch } = usePlaylist(playlistId);
  console.log("isloading is ", isLoading);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center mt-[25%]">
        <div className="text-3xl font-sans tracking-wide text-center">
          Loading Playlist
          <span className="dots overflow-hidden align-baseline"></span>
          <br></br>
          <span className="text-xs">
            (may take some time if playlist is large)
          </span>
        </div>
      </div>
    );
  } else if (error) {
    return (
      <div className="flex gap-1 items-center">
        <ErrorMessage
          message={`Failed to fetch playlist: ${error.message}`}
          type="regular"
        />
      </div>
    );
  }

  return <Game data={data!} userId={userId} refetch={refetch} />;
}
