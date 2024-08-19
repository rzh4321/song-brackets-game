"use server";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users } from "@/schema";
import { eq } from "drizzle-orm";

export default async function createUser(
  username: string,
  name: string,
  spotifyUserId?: string, // Optional parameter
  password?: string, // Optional parameter
) {
  try {
    // Check if the user already exists
    const res = await db
      .select({
        username: users.username,
        password: users.password,
      })
      .from(users)
      .where(eq(username as any, users.username));

    if (res.length > 0) {
      console.log("this username or spotify id already exists");
      return JSON.stringify(res[0]);
    }

    // Hash the password if it is provided
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    // Create a new user since one doesn't exist with the given username
    const newUser = await db.insert(users).values({
      username: username,
      name: name,
      password: hashedPassword,
      spotifyId: spotifyUserId,
    });

    console.log("New user created:", newUser);
    return JSON.stringify({ ...newUser, password }); // return unhashed pw since we're gonna log in with it
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}
