"use client";
import {
  SingleEliminationBracket,
  DoubleEliminationBracket,
  Match,
  SVGViewer,
} from "@g-loot/react-tournament-brackets";
import { useWindowSize } from "@uidotdev/usehooks";
import type { resultBracketType, MatchType, participantsType } from "@/types";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

function transformBrackets(brackets: resultBracketType[]): MatchType[] {
  let matches: MatchType[] = [];
  const roundBracketIdMap: Record<string, number> = {};

  // First pass to generate matches and store mapping for nextMatchId
  brackets.forEach((bracket: any, index) => {
    const matchId = 1000 + index; // Any unique ID logic
    roundBracketIdMap[`${bracket.round}-${bracket.bracket}`] = matchId;

    const match: MatchType = {
      id: matchId,
      nextMatchId: null, // To be updated
      tournamentRoundText: bracket.round.toString(),
      startTime: "2021-05-30", // Static or dynamic based on requirements
      state: "PLAYED", // Assuming all matches are played
      participants: [
        {
          id: bracket.part1.id,
          resultText: null,
          isWinner: bracket.winner === bracket.part1.name,
          status: null,
          name: bracket.part1.name,
          picture: bracket.part1.url,
        },
        {
          id: bracket.part2.id,
          resultText: null,
          isWinner: bracket.winner === bracket.part2.name,
          status: null,
          name: bracket.part2.name,
          picture: bracket.part2.url,
        },
      ],
    };
    matches.push(match);
  });

  // Second pass to update nextMatchId
  matches.forEach((match) => {
    // find the corresponding resultBracket object to see what the next round and brackets are
    const bracketInfo = brackets.find(
      (bracket) =>
        roundBracketIdMap[`${bracket.round}-${bracket.bracket}`] === match.id,
    );
    if (
      bracketInfo &&
      bracketInfo.nextRound !== null &&
      bracketInfo.nextBracket !== null
    ) {
      const nextMatchKey = `${bracketInfo.nextRound}-${bracketInfo.nextBracket}`;
      // point this match to the next match given next round and next bracket
      match.nextMatchId = roundBracketIdMap[nextMatchKey] || null;
    }
  });

  return matches;
}

type BracketProps = {
  fullBracketResults: resultBracketType[];
};

export default function Bracket({ fullBracketResults }: BracketProps) {
  const { width, height } = useWindowSize();
  const matchArr = transformBrackets(fullBracketResults);

  const attachListeners = (participant: participantsType) => {
    const allDivs = document.querySelectorAll("foreignObject div");
    allDivs.forEach((div) => {
      if (div.textContent === participant.name) {
        div.classList.add("pointer");
        // fix error message regarding preventDefault on mobile view
        div.addEventListener(
          "touchstart",
          function (event) {
            event.preventDefault();

            handleParticipantClick(participant);
          },
          { passive: false },
        );
        // need this for desktop view
        div.addEventListener("click", () =>
          handleParticipantClick(participant),
        );
      }
    });
  };
  // Attach onClick event handlers after the component mounts
  useEffect(() => {
    fullBracketResults.forEach((bracket) => {
      attachListeners(bracket.part1);
      attachListeners(bracket.part2);
    });

    // Clean up event listeners when the component unmounts
    return () => {
      const removeListeners = (participant: participantsType) => {
        const allDivs = document.querySelectorAll(".bOrPFB");
        allDivs.forEach((div) => {
          if (div.textContent === participant.name) {
            div.removeEventListener("click", () =>
              handleParticipantClick(participant),
            );
          }
        });
      };

      fullBracketResults.forEach((bracket) => {
        removeListeners(bracket.part1);
        removeListeners(bracket.part2);
      });
    };
  }),
    []; // Depend on fullBracketResults to re-attach handlers if it changes

  const handleParticipantClick = (participant: participantsType) => {
    console.log(participant.name);
  };

  return (
    <div className="relative z-[1] flex justify-center">
      <div className="relative z-[1] flex justify-center">
        <SingleEliminationBracket
          matches={matchArr}
          matchComponent={Match}
          svgWrapper={({ children, ...props }: any) => (
            <SVGViewer width={width} height={height} {...props}>
              {children}
            </SVGViewer>
          )}
        />
      </div>
    </div>
  );
}
