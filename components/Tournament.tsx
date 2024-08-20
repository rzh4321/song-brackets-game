"use client";
import useTournament from "@/hooks/useTournament";

import type {
  MatchType,
  participantsType,
  currentRoundBracketType,
  resultBracketType,
  Song,
  SongWithStatsType,
  PlaylistInfo,
} from "@/types";
import Image from "next/image";
import BracketRound from "./BracketRound";
import GameOver from "./GameOver";
import Background from "./background";

type TournamentProps = {
  playAgain: () => void;
  numRounds: number;
  showProgress: boolean;
  ranked: boolean;
  songsArr: Song[];
  playlistInfo: PlaylistInfo;
};

export default function Tournament({
  playAgain,
  numRounds,
  showProgress,
  ranked,
  songsArr,
  playlistInfo,
}: TournamentProps) {
  const {
    currentRoundBrackets,
    setCurrentRoundBrackets,
    currentRoundInd,
    setCurrentRoundInd,
    participants,
    setParticipants,
    fullBracketResults,
    setFullBracketResults,
    round,
    setRound,
  } = useTournament(numRounds, ranked, songsArr, playlistInfo);

  const handlePhotoChosen = async (name: string) => {
    // pause for 1.5 seconds for the animation
    console.log("IN HANDLEPHOTOCHOSEN");
    const currentBracketObj = currentRoundBrackets[currentRoundInd];
    console.log(
      "THE BRACKET U JUST PLAYED IS ",
      currentBracketObj,
      " AND THE WINNER WAS ",
      name,
    );
    const newParticipants: participantsType[] = [...participants];
    if (currentBracketObj.part1.name === name) {
      console.log("PART1 WON");
      // part1 won this bracket, advance to next round
      newParticipants.push(currentBracketObj.part1);
    } else {
      console.log("PART2 WON");
      // part2 won this bracket, advance to next round
      newParticipants.push(currentBracketObj.part2);
    }
    console.log("ABOUT TO UPDATE PARTICIAPTNS TO ", newParticipants);
    setParticipants(newParticipants);
    // construct the bracket result object
    const bracketResultObj: resultBracketType = {
      round: round,
      bracket: currentBracketObj.bracket,
      part1: currentBracketObj.part1,
      part2: currentBracketObj.part2,
      nextRound: round + 1,
      nextBracket: Math.ceil(currentBracketObj.bracket / 2),
      winner: name,
    };
    const updatedFullBracketResults = [...fullBracketResults, bracketResultObj];
    setFullBracketResults(updatedFullBracketResults);

    if (currentRoundInd === currentRoundBrackets.length - 1) {
      console.log(
        "that was the last bracket for this orund. increment round...",
      );
      // this was the last bracket for this round. Go to next round
      setRound((prev) => prev + 1);
      // reset the bracket index and currentBrackets array
      setCurrentRoundInd(0);
      setCurrentRoundBrackets([]);
    } else {
      // move to next bracket for this round
      setCurrentRoundInd((prev) => prev + 1);
    }
  };

  console.log(
    "\n\n(ROUND ",
    round,
    " BRACKET ",
    currentRoundInd + 1,
    " OF ",
    currentRoundBrackets.length,
    "). particpants is ",
    participants,
    " BRACKETS IS ",
    currentRoundBrackets,
    " FINALBRACKET IS ",
    fullBracketResults,
    " \n\n",
  );

  if (round > numRounds) {
    return (
      <GameOver
        playAgain={playAgain}
        fullBracketResults={fullBracketResults}
        winner={participants[0]}
        numRounds={numRounds}
        ranked={ranked}
      />
    );
  }

  if (currentRoundBrackets.length === 0) {
    return (
      <div className="text-3xl font-sans tracking-wide text-center">
        <Background />
        Loading Round
        <span className="dots overflow-hidden align-baseline"></span>
      </div>
    );
  }

  return (
    <>
      <Background />
      <BracketRound
        bracket={currentRoundBrackets[currentRoundInd]}
        showProgress={showProgress}
        currentBracketNum={currentRoundInd + 1}
        totalBrackets={currentRoundBrackets.length}
        handlePhotoChosen={handlePhotoChosen}
      />
    </>
  );
}
