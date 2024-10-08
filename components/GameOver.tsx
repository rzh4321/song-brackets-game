import Bracket from "@/components/Bracket";
import Image from "next/image";
import type {
  resultBracketType,
  participantsType,
  ParticipantWithStatsType,
} from "@/types";
import "@/app/background.scss";
import { useEffect, useState } from "react";
import updateSongData from "@/actions/updateSongData";
import { ArrowRight, Loader } from "lucide-react";
import { useRef } from "react";
import { Button } from "./ui/button";
import GameOverBackground from "./GameOverBackground";
import updateSongs from "@/actions/updateSongs";

type GameOverProps = {
  playAgain: () => void;
  fullBracketResults: resultBracketType[];
  winner: participantsType;
  numRounds: number;
  ranked: boolean;
};

type RatingsProp = {
  oldSongRating: number;
  newSongRating: number;
};

export default function GameOver({
  playAgain,
  fullBracketResults,
  winner,
  numRounds,
  ranked,
}: GameOverProps) {
  const [ratings, setRatings] = useState<RatingsProp>();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // play the winning song on mount
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Audio playback failed:", error);
        // Handle the error (e.g., show a play button to the user)
      });
    }
  }, [winner]);

  useEffect(() => {
    const updateDb = async () => {
      const { oldSongRating, newSongRating }: any = await updateSongs(
        fullBracketResults,
        numRounds,
      );
      setRatings({ oldSongRating, newSongRating });
    };
    if (ranked) {
      console.log("THE MODE WAS RANKED, UPDATING DB NOW...");
      updateDb();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-3 items-center">
      <GameOverBackground src={winner.image} />
      <audio ref={audioRef} src={winner.url} autoPlay loop></audio>
      <div className="flex flex-col gap-2 font-bold items-center">
        <span className="text-xl tracking-widest">THE WINNER IS...</span>
        <span
          className={`text-4xl font-extrabold animate-bounce text-center text-pink-500 shadow-xl bg-yellow-400 rounded p-1`}
        >
          {ranked && !ratings ? (
            <Loader className="animate-spin" />
          ) : (
            winner.name
          )}
        </span>
        {ranked && ratings && (
          <div className="flex flex-col gap-1">
            <span className="text-yellow-300">
              Song Rating: {Math.round(ratings.oldSongRating * 10) / 10}
              <ArrowRight className="inline mx-1" />
              {Math.round(ratings!.newSongRating * 10) / 10}
            </span>
          </div>
        )}
      </div>
      <div className="w-[100vw]">
        <div className=" relative flex justify-center items-center h-full w-full">
          <Image
            alt="img"
            className="cursor-pointer w-full min-w-[300px] h-full max-w-[30vw] max-h-[85vh] object-contain"
            priority
            src={winner.image}
            height={2000}
            width={2000}
          />
        </div>
      </div>
      <div className="flex gap-3 z-[1]">
        <Button onClick={() => location.reload()} variant={"blue"}>
          Back to Playlist
        </Button>
        <Button onClick={playAgain} variant={"spotify"}>
          Play again
        </Button>
      </div>
      <Bracket fullBracketResults={fullBracketResults} audioRef={audioRef} />
    </div>
  );
}
