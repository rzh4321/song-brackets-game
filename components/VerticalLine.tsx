import { Heart } from "lucide-react";
import { Separator } from "./ui/separator";
import Image from "next/image";

type VerticalLineProps = {
  imageClicked: boolean;
  currentBracketNum: number;
  totalBrackets: number;
  showProgress: boolean;
};

export default function VerticalLine({
  imageClicked,
  currentBracketNum,
  totalBrackets,
  showProgress,
}: VerticalLineProps) {
  return (
    <>
      <div
        className={`relative z-[1] flex items-center ${imageClicked ? "opacity-0" : ""} transition-all ease-out duration-1000`}
      >
        <div className="h-[1px] w-[80vw] sm:h-[35vh] md:h-[50vh] lg:h-[70vh] sm:w-[1px] bg-white relative z-0"></div>
        <div className="sm:w-10 sm:h-10 w-6 h-6 absolute left-1/2 transform -translate-x-1/2 animate-pulse">
          <Image alt="separator" src="/icon.ico" height={500} width={500} />
        </div>
        {/* <Heart
          stroke="pink"
          fill="red"
          className="sm:w-10 sm:h-10 absolute left-1/2 transform -translate-x-1/2 animate-pulse"
        /> */}
        {showProgress && (
          <span className="text-2xl sm:text-4xl md:text-5xl font-bold text-pink-900 absolute left-1/4 sm:left-1/2 sm:top-1/4 transform -translate-x-1/2">
            {currentBracketNum}
          </span>
        )}
        {showProgress && (
          <span className="text-2xl sm:text-4xl md:text-5xl tracking-tighter font-bold text-pink-900 absolute left-3/4 sm:left-1/2 sm:top-[65%] transform -translate-x-1/2">
            {totalBrackets}
          </span>
        )}
      </div>
    </>
  );
}
