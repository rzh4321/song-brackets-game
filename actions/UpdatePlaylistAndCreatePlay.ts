"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function UpdatePlaylistAndCreatePlay(
  userId: number,
  spotifyPlaylistId: string,
  showHints: boolean,
  timer: number,
  score: number,
): Promise<void> {
  // Start a transaction to ensure data consistency
  const result = await prisma.$transaction(async (prisma : any) => {
    if (score === -1) score = 0;
    // Check if a corresponding playlist with this combination of showHints and timer exists
    let playlist = await prisma.playlist.findFirst({
      where: {
        userId,
        spotifyPlaylistId,
        showHints,
        timer,
      },
    });

    if (playlist) {
      // If the playlist exists, increment the playCount
      console.log(
        "THIS USER HAS PLAYED THIS PLAYLIST WITH THESE SETTINGS BEFORE, UPDATINGS ITS PLAYCOUNT",
      );
      playlist = await prisma.playlist.update({
        where: {
          playlistId: playlist.playlistId,
        },
        data: {
          playCount: {
            increment: 1,
          },
        },
      });
    } else {
      // If the playlist does not exist, create a new one with playCount initialized to 1
      console.log(
        "THIS USER NEVER PLAYED THIS PLAYLIST WITH THESE SETTINGS BEFORE, CREATING NEW ENTRY",
      );
      playlist = await prisma.playlist.create({
        data: {
          userId,
          spotifyPlaylistId,
          showHints,
          timer,
          playCount: 1,
        },
      });
    }

    // Create a new play with the provided information
    const newPlay = await prisma.play.create({
      data: {
        userId,
        playlistId: playlist.playlistId,
        score,
      },
    });
    console.log("CREATED NEW PLAY ENTRY. IT IS ", newPlay);
  });
}
