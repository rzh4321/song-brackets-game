import { getServerSession } from "next-auth";
import authOptions from "@/authOptions";
import GameWrapper from "@/components/GameWrapper";

export default async function Page({
  params,
}: {
  params: { playlistId: string };
}) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { userId: number }).userId;
  const playlistId = params.playlistId;

  return <GameWrapper playlistId={playlistId} userId={userId} />;
}
