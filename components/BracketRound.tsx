import Image from "next/image";
import type { currentRoundBracketType } from "@/types";
import VerticalLine from "./VerticalLine";
import ImageContainer from "./ImageContainer";
import { useState } from "react";

type BracketRoundProps = {
  bracket: currentRoundBracketType;
  handlePhotoChosen: (name: string) => void;
  currentBracketNum: number;
  totalBrackets: number;
  showProgress: boolean;
};

export default function BracketRound({
  bracket,
  handlePhotoChosen,
  showProgress,
  currentBracketNum,
  totalBrackets,
}: BracketRoundProps) {
  const [imageClicked, setImageClicked] = useState(false);

  return (
    <>
      <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:gap-10 max-w-full sm:h-[85vh] items-center">
        <ImageContainer
          name={bracket.part1.name}
          audio={bracket.part1.url}
          src={bracket.part1.image}
          pos="left"
          imageClicked={imageClicked}
          setImageClicked={setImageClicked}
          handlePhotoChosen={handlePhotoChosen}
        />
        <VerticalLine
          imageClicked={imageClicked}
          showProgress={showProgress}
          currentBracketNum={currentBracketNum}
          totalBrackets={totalBrackets}
        />

        <ImageContainer
          name={bracket.part2.name}
          audio={bracket.part2.url}
          src={bracket.part2.image}
          pos="right"
          imageClicked={imageClicked}
          setImageClicked={setImageClicked}
          handlePhotoChosen={handlePhotoChosen}
        />
      </div>
    </>
  );
}
