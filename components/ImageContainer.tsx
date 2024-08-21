import Image from "next/image";
import { Heart } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { HeartStyle } from "@/types";
import { Button } from "./ui/button";

type ImageContainerProps = {
  name: string;
  audio: string;
  src: string;
  pos: "left" | "right";
  imageClicked: boolean;
  setImageClicked: React.Dispatch<React.SetStateAction<boolean>>;
  handlePhotoChosen: (name: string) => void;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function ImageContainer({
  src,
  audio,
  pos,
  imageClicked,
  setImageClicked,
  name,
  handlePhotoChosen,
}: ImageContainerProps) {
  const [hearts, setHearts] = useState<HeartStyle[]>([]);
  const imageRef = useRef<HTMLImageElement>(null);
  const [transitionAmount, setTransitionAmount] = useState(0);
  console.log(audio);

  useEffect(() => {
    if (imageRef.current) {
      const img = imageRef.current;
      // console.log("windowinner with is ", window.innerWidth);
      const { left, top, right } = img.getBoundingClientRect();
      let res;
      if (pos === "left") {
        if (window.innerWidth > 639) {
          res = (window.innerWidth / 2 - left) / 2;
        } else {
          res = (window.innerHeight / 2 - top) / 2 / 1.5;
        }
        // console.log('(pos is left) left is ', left, ' right is ', right, ' res is ', res);
      } else {
        if (window.innerWidth > 639) {
          res =
            ((window.innerWidth / 2 - (window.innerWidth - right)) / 2) * -1;
        } else {
          res = ((window.innerHeight / 2 - top) * -1) / 1.5;
        }
      }
      setTransitionAmount(res);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = async (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
  ) => {
    if (imageRef.current) {
      setImageClicked(true);
      imageRef.current.style.transform = `${window.innerWidth > 639 ? "translateX" : "translateY"}(${transitionAmount}px)`;
      imageRef.current.style.zIndex = "20";
      imageRef.current.style.opacity = "100";
      if (window.innerWidth <= 639) {
        imageRef.current.style.scale = "1.5";
      }
      imageRef.current.style.transition = "all 1s ease";
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const clusterSize = 20; // Number of hearts in the cluster
    const newHearts: HeartStyle[] = [];

    for (let i = 0; i < clusterSize; i++) {
      const x = e.clientX - rect.left - 12; // Center of the heart
      const y = e.clientY - rect.top - 12;
      const animationDelay = Math.random() * 0.5; // Random delay up to 0.5 seconds

      newHearts.push({
        id: Math.random(), // Unique key for React elements
        style: {
          position: "absolute",
          left: `${x + (Math.random() - 0.5) * 80}px`, // Random position within 40px radius
          top: `${y + (Math.random() - 0.5) * 80}px`,
          transform: "scale(3)", // Adjust scale as needed
          animation: `pulse 1s ${animationDelay}s ease-in-out forwards`,
          pointerEvents: "none", // Ensures hover effects on image are not blocked
        },
      });
    }
    setTimeout(() => setHearts([]), 1000); // Clear hearts after 1 second

    setHearts(newHearts);
    if (imageRef.current) {
      await sleep(1000);
      handlePhotoChosen(name);
      // reset everything for next bracket
      setImageClicked(false);
      imageRef.current.style.transform = "";
      imageRef.current.style.zIndex = "";
      imageRef.current.style.opacity = "";
      if (window.innerWidth <= 639) {
        imageRef.current.style.scale = "";
      }
      imageRef.current.style.transition = "";
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      <div>
        <audio key={audio} controls>
          <source src={audio} type="audio/mpeg" />
        </audio>
      </div>

      <div
        className={`${hearts.length === 0 ? "flex justify-center" : ""} relative min-w-[150px] w-[250px] cursor-pointer sm:flex-1`}
      >
        <Image
          ref={imageRef}
          alt={"img"}
          src={src}
          className={`${imageClicked ? "opacity-0 transition-all ease-out duration-1000 w-full h-full pointer-events-none object-contain max-w-full max-h-[35vh] sm:max-h-[85vh]" : "max-w-full max-h-[35vh] sm:max-h-[85vh] h-full object-contain transition-all duration-500 ease-out transform hover:scale-105 hover:ring-2 hover:ring-offset-2 hover:ring-offset-pink-800 hover:ring-pink-500"}`}
          width={2000}
          height={2000}
          onClick={handleClick}
          priority
        />

        {hearts.map((heart) => (
          <Heart
            fill="red"
            stroke="pink"
            key={heart.id.toString()}
            style={heart.style}
            className="text-pink-500 opacity-75 z-20"
          />
        ))}
      </div>
    </div>
  );
}

export default ImageContainer;
