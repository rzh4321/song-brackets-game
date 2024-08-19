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
  const { data, isLoading, error } = usePlaylist(playlistId);
  if (isLoading) {
    return (
      <div className="flex gap-1 items-center">
        <Loader className="animate-spin" />
        <span className="text-sm">
          Fetching Songs (may take a while if playlist is large)
        </span>
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

  return <Game data={data!} userId={userId} />;
}
