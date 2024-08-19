"use server";
import { db } from "@/db";
import { users } from "@/schema";
import { eq } from "drizzle-orm";

export default async function updateNameAndSpotifyId(
  username: string,
  name: string,
  spotifyId: string | undefined,
): Promise<void> {
  if (!name) {
    throw new Error("Name is required");
  }
  const res = await db
    .select({
      username: users.username,
      password: users.password,
    })
    .from(users)
    .where(eq(username as any, users.username));

  if (res.length > 0) {
    const updatedUser = await db
      .update(users)
      .set({ name: name, spotifyId: spotifyId ? spotifyId : null })
      .where(eq(users.username, username));

    console.log("update success. the updated user is now ", updatedUser);
  } else {
    console.log("cant find user ", username);
    throw new Error("Unable to find user");
  }
}
