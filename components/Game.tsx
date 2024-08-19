"use client";
import { useState } from "react";
import Tournament from "@/components/Tournament";
import ErrorMessage from "./ErrorMessage";
import Menu from "./Menu";
import { biggestPowerOfTwo } from "./MenuOptions";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SongWithStatsType, PlaylistInfo } from "@/types";

export const FormSchema = z.object({
  bracketSize: z.string(),
  showProgress: z.boolean().default(true).optional(),
  ranked: z.boolean().default(true).optional(),
});

export default function Game({
  data,
  userId,
}: {
  data: { songsArr: SongWithStatsType[]; playlistInfo: PlaylistInfo };
  userId: number;
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
      />
    );
  }
  return (
    <>
      <div className="flex flex-col gap-10 justify-center items-center">
        <Menu
          userId={userId}
          playlistInfo={data?.playlistInfo}
          songs={data?.songsArr}
          setShowTournament={setShowTournament}
          form={form}
        />
      </div>
    </>
  );
}
