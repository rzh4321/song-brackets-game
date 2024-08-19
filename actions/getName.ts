"use server";
import { db } from "@/db";
import { users } from "@/schema";
import { eq } from "drizzle-orm";

export default async function getName(
  username: string,
): Promise<string | null> {
  const res = await db
    .select({
      name: users.name,
    })
    .from(users)
    .where(eq(username as any, users.username));

  return res.length > 0 ? res[0].name : null;
}
