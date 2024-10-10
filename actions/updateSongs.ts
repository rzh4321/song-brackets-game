"use server";
import type { resultBracketType } from "@/types";
import updateSongData from "./updateSongData";

export default async function updateSongs(
  fullBracketResults: resultBracketType[],
  numRounds: number,
) {
  const updatePromises = fullBracketResults.map(
    async (bracketResultObj, index) => {
      const winnerName = bracketResultObj.winner;
      const isLastBracket = index === fullBracketResults.length - 1;

      if (bracketResultObj.part1.name === winnerName) {
        await updateSongData(
          bracketResultObj.part2.id,
          bracketResultObj.part2.playlistId,
          bracketResultObj.part2.playlistName,
          bracketResultObj.round,
          numRounds,
          bracketResultObj.part2.name,
          false,
        );

        if (isLastBracket) {
          return updateSongData(
            bracketResultObj.part1.id,
            bracketResultObj.part1.playlistId,
            bracketResultObj.part1.playlistName,
            bracketResultObj.round + 1,
            numRounds,
            bracketResultObj.winner,
            true,
          );
        }
      } else {
        await updateSongData(
          bracketResultObj.part1.id,
          bracketResultObj.part1.playlistId,
          bracketResultObj.part1.playlistName,
          bracketResultObj.round,
          numRounds,
          bracketResultObj.part1.name,
          false,
        );

        if (isLastBracket) {
          return updateSongData(
            bracketResultObj.part2.id,
            bracketResultObj.part2.playlistId,
            bracketResultObj.part2.playlistName,
            bracketResultObj.round + 1,
            numRounds,
            bracketResultObj.winner,
            true,
          );
        }
      }
    },
  );

  const promises = await Promise.all(updatePromises);
  console.log("PROMISES ARE ", promises);
  return promises[promises.length - 1];
}
