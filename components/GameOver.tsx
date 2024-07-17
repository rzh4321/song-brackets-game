import { Button } from "./ui/button";
import Link from "next/link";
import { useEffect } from "react";
import useStore from "@/gameStore";

type GameOverProps = {
  updateDatabase: () => Promise<void>;
  correct: string;
  selected: string;
  beatHighScore: boolean;
};

export default function GameOver({
  updateDatabase,
  correct,
  selected,
  beatHighScore,
}: GameOverProps) {
  const score = useStore((state) => state.score);
  const setShowMenu = useStore((state) => state.setShowMenu);
  console.log('sore is ', score);

  useEffect(() => {
    async function update() {
      await updateDatabase();
    }
    update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // make sure its only run once to avoid updating db multiple times
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col items-center justify-center gap-5">
        <span>
          The song was <span className="text-green-400">{correct}</span>{" "}
          {selected &&
            `and you
          chose `}
          {selected && <span className="text-red-400">{selected}</span>}
        </span>
        <div>
          <div className="text-center text-3xl">{Math.max(score as number, 0)}</div>
          {beatHighScore && (
            <span className="text-xs bg-green-600 rounded text-black p-1">
              NEW BEST
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-3 justify-center">
        <Button className="bg-green-400" onClick={() => setShowMenu(true)}>
          Play again
        </Button>
        <Link href="/home">
          <Button className="bg-red-400">Back to playlists</Button>
        </Link>
      </div>
    </div>
  );
}
