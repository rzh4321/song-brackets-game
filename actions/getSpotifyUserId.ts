"use server";
import { db } from "@/db";
import { users } from "@/schema";
import { eq } from "drizzle-orm";

export default async function getSpotifyUserId(
  username: string,
): Promise<string | null> {
  if (!username) return null;
  // Retrieve the user with the given username
  const res = await db
    .select({
      spotifyUserId: users.spotifyId,
    })
    .from(users)
    .where(eq(username as any, users.username));

  // If the user exists, return the spotifyUserId, else return null
  return res.length > 0 ? res[0].spotifyUserId : null;
}
