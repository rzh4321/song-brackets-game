import Bracket from "@/components/Bracket";
import Image from "next/image";
import type { resultBracketType, participantsType } from "@/types";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import updateSongData from "@/actions/updateSongData";
import { ArrowRight, Loader } from "lucide-react";
import { useRef } from "react";
import { Button } from "./ui/button";

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
      for (let i = 0; i < fullBracketResults.length; ++i) {
        const bracketResultObj: any = fullBracketResults[i];
        const winnerName = bracketResultObj.winner;
        // update the loser of each bracket
        if (bracketResultObj.part1.name === winnerName) {
          await updateSongData(
            bracketResultObj.part2.id,
            bracketResultObj.round,
            numRounds,
            bracketResultObj.part2.name,
            false,
          );
          if (i === fullBracketResults.length - 1) {
            // special case for winner of entire bracket
            const { oldSongRating, newSongRating } = await updateSongData(
              bracketResultObj.part1.id,
              bracketResultObj.round + 1,
              numRounds,
              bracketResultObj.winner,
              true,
            );
            setRatings({
              oldSongRating,
              newSongRating,
            });
          }
        } else {
          await updateSongData(
            bracketResultObj.part1.id,
            bracketResultObj.round,
            numRounds,
            bracketResultObj.part1.name,
            false,
          );
          if (i === fullBracketResults.length - 1) {
            // special case for winner of entire bracket
            const { oldSongRating, newSongRating } = await updateSongData(
              bracketResultObj.part2.id,
              bracketResultObj.round + 1,
              numRounds,
              bracketResultObj.winner,
              true,
            );
            setRatings({
              oldSongRating,
              newSongRating,
            });
          }
        }
      }
    };
    if (ranked) {
      console.log("THE MODE WAS RANKED, UPDATING DB NOW...");
      updateDb();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-3 items-center">
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
          <Heart
            fill="red"
            stroke="pink"
            className="z-[-1] animate-heartPulse lg:w-[40rem] lg:h-[40rem] md:w-[30rem] md:h-[30rem] sm:w-[25rem] sm:h-[25rem] h-[15rem] w-[15rem] absolute transform -translate-x-1/2"
            height={200}
            width={200}
          />

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
      <Button onClick={playAgain}>Play again</Button>
      <Bracket fullBracketResults={fullBracketResults} />
    </div>
  );
}
