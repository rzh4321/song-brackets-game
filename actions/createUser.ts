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
  const loggedInWithSpotify = password === undefined;
  console.log('loggined with spoti: ', loggedInWithSpotify)
  try {
    // Check if the user already exists
    const res = await db
      .select({
        username: users.username,
        userId: users.id,
        password: users.password,
      })
      .from(users)
      .where(eq(username as any, users.username));

    if (!loggedInWithSpotify && res.length > 0) {
      console.log("this username or spotify id already exists");
      throw new Error("This username already exists");
    }
    if (loggedInWithSpotify && res.length > 0) {
      console.log('returning user logging in with spotify');
      return res[0].userId;
    }
 
    // Hash the password if it is provided
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    // Create a new user since one doesn't exist with the given username
    await db.insert(users).values({
      username: username,
      name: name,
      password: hashedPassword,
      spotifyId: spotifyUserId,
    });

    const newUser = {
      username,
    };

    console.log("New user created:", newUser);
    return JSON.stringify({ ...newUser, password }); // return unhashed pw since we're gonna log in with it
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}
