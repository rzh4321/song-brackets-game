"use client";
import { useState } from "react";
import Tournament from "@/components/Tournament";
import Menu from "./Menu";
import { biggestPowerOfTwo } from "./MenuOptions";
import Background from "./background";
import { QueryObserverResult } from "@tanstack/react-query";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { PlaylistInfo, Song } from "@/types";

export const FormSchema = z.object({
  bracketSize: z.string(),
  showProgress: z.boolean().default(true).optional(),
  ranked: z.boolean().default(true).optional(),
});

export default function Game({
  data,
  userId,
  refetch,
}: {
  data: { songsArr: Song[]; playlistInfo: PlaylistInfo };
  userId: number;
  refetch: () => Promise<void>;
}) {
  const [showTournanment, setShowTournament] = useState(false);
  const [key, setKey] = useState(0);

  const playAgain = () => {
    setKey((prev) => prev + 1);
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      bracketSize: Math.min(
        32,
        biggestPowerOfTwo(data.playlistInfo.count!),
      ).toString(),
      showProgress: false,
      ranked: true,
    },
  });

  if (showTournanment) {
    return (
      <Tournament
        key={key}
        playAgain={playAgain}
        numRounds={Math.log2(+form.getValues("bracketSize"))}
        showProgress={form.getValues("showProgress") as boolean}
        ranked={form.getValues("ranked") as boolean}
        songsArr={data!.songsArr}
        playlistInfo={data!.playlistInfo}
      />
    );
  }
  return (
    <>
      <div className="flex flex-col gap-10 justify-center items-center">
        <Background />
        <Menu
          refetch={refetch}
          playlistInfo={data.playlistInfo}
          songs={data.songsArr}
          setShowTournament={setShowTournament}
          form={form}
        />
      </div>
    </>
  );
}
