"use client";
import Image from "next/image";

export default function GameOverBackground({ src }: { src: string }) {
  return (
    <>
      <div className="wrap fixed h-full w-screen -m-5">
        {[...Array(8)].map((_, index) => (
          <Image
            key={`img-${index}`}
            width={300}
            height={300}
            src={src}
            alt="Falling image"
            className="svg1 svg"
          />
        ))}
      </div>
    </>
  );
}
