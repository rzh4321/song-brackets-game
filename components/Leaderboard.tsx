import TopScoresTable from "./TopScoresTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PlaylistInfo, Song } from "@/types";

type LeaderboardProps = {
  name: string | undefined;
  playlistInfo: PlaylistInfo;
  songs: Song[];
};

export default function Leaderboard({
  name,
  playlistInfo,
  songs,
}: LeaderboardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"blue"} className="text-xs sm:text-base">
          <BarChart2 />
          <span className="hidden sm:block">Leaderboards</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-old-bg flex flex-col items-center justify-center overflow-auto max-h-screen max-w-[500px] lg:max-w-[1000px] mt-2">
        <div className="max-h-screen pt-5">
          <DialogHeader>
            <DialogTitle className="text-center">
              Top Scores for {name ?? ""}
            </DialogTitle>
          </DialogHeader>
          <TopScoresTable songs={songs} playlistInfo={playlistInfo} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
