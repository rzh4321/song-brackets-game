import { useState, useEffect } from "react";
import type {
  participantsType,
  currentRoundBracketType,
  resultBracketType,
  Song,
  SongWithStatsType,
} from "@/types";

function shuffleArray(array: any[], count: number): any[] {
  console.log("COUNT IS ", count);
  // Make a copy of the array to avoid modifying the original
  const shuffled = [...array];

  // Shuffle the array
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const temp = shuffled.slice(0, count);
  console.log("temp is ", temp);
  // Return only the first 'count' elements
  return temp;
}

export default function useTournament(
  numRounds: number,
  ranked: boolean,
  songsArr: SongWithStatsType[],
) {
  const [participants, setParticipants] = useState<participantsType[]>([]);
  const [currentRoundBrackets, setCurrentRoundBrackets] = useState<
    currentRoundBracketType[]
  >([]);
  const [fullBracketResults, setFullBracketResults] = useState<
    resultBracketType[]
  >([]);
  const [currentRoundInd, setCurrentRoundInd] = useState(0); // index to currentRoundBrackets
  const [round, setRound] = useState(1); // current overall round of the tournament
  const [photosRemaining, setPhotosRemaining] = useState(2 ** numRounds);

  console.log(
    "IN USETOURNAMENT> NUM ROUNDS IS ",
    numRounds,
    " RANKED IS ",
    ranked,
    " SONGS ARR IS ",
    songsArr,
  );
  // get all initial participants on initial mount
  useEffect(() => {
    const getParticipants = async () => {
      const count = 2 ** numRounds;

      console.log("SHUFFLING AND TRIMMING PARTS");
      const songs = shuffleArray(songsArr, count);

      const participants = songs.map((song, ind) => ({
        ...song,
        cameFromBracket: ind,
      }));
      setParticipants(participants);
      console.log(
        "FINISHED SHUFFLING AND TRIMMING. PARTICIAPNTS IS NOW ",
        participants,
      );
    };

    if (
      round === 1 &&
      currentRoundInd === 0 &&
      currentRoundBrackets.length === 0 &&
      participants.length === 0
    ) {
      getParticipants();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // pair all the participants on initial mount and whenever round changes
  useEffect(() => {
    console.log(
      `PARTICIPANS LENGTH IS ${participants.length} PHOTOSREMAINING IS ${photosRemaining} ROUND IS ${round} NUMROUNDS IS ${numRounds} CURRENTROUNDBRACKETS LENGTH IS ${currentRoundBrackets.length}`,
    );
    // this condition should be true whenever round changes, including at game start
    if (
      participants.length === photosRemaining &&
      round <= numRounds &&
      photosRemaining > 0 &&
      currentRoundBrackets.length === 0
    ) {
      const pairParticipants = () => {
        console.log(
          "GAME STARTED OR ROUND CHANGED SINCE PHOTOSREMAINING IS ",
          photosRemaining,
          ". pairint parts...",
        );
        // Sort participants by cameFromBracket (should already be sorted, but just in case)
        const sortedParticipants = [...participants].sort(
          (a, b) => a.cameFromBracket - b.cameFromBracket,
        );
        console.log("sortedparts is ", sortedParticipants);
        // Create pairs and update currentRoundBrackets
        const newBrackets: currentRoundBracketType[] = [];
        for (let i = 0; i < sortedParticipants.length; i += 2) {
          if (i + 1 < sortedParticipants.length) {
            const part1 = sortedParticipants[i];
            const part2 = sortedParticipants[i + 1];
            const bracket = i / 2 + 1; // Bracket number is the nth pair

            newBrackets.push({ bracket, part1, part2 });
          }
        }
        setCurrentRoundBrackets(newBrackets);
        console.log(
          "ALL PARTS HAVE BEEN PAIRED. SETTING PARTICIPANTS TO EMPTY ARR AND CURRENTROUNDBRACKETS ABOUT TO BE ",
          newBrackets,
        );
        // empty the participants list after every pairing is done
        setParticipants([]);
        // half of the photos remain after this round
        setPhotosRemaining((prev) => prev / 2);
      };
      pairParticipants();
    }
  }, [round, numRounds, photosRemaining, participants, currentRoundBrackets]);

  return {
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
  };
}
