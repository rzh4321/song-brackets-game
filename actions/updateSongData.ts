"use server";
import { db } from "@/db";
import { sql, eq } from "drizzle-orm";
import { songs } from "@/schema";

export default async function updateSongData(
  trackId: string,
  roundReached: number,
  numRounds: number,
  name: string,
  isWinner: boolean,
) {
  const bracketSize = 2 ** numRounds;
  console.log(
    "IN UPDATEPHOTODATA FOR ",
    name,
    " ROUND REACHED IS ",
    roundReached,
    " NUMROUNDS IS ",
    numRounds,
    " BRACKET SIZE IS ",
    bracketSize,
    " TRACK ID IS ",
    trackId,
    " ISWINNER IS ",
    isWinner,
  );
  const calculatedScore = (roundReached / (numRounds + 1)) * (bracketSize / 2);
  console.log(
    "(roundReached / numRounds+1) IS ",
    roundReached / (numRounds + 1),
    " AND (bracketSize / 2) IS ",
    bracketSize / 2,
  );
  console.log("CALCULATED SCORE IS ", calculatedScore);

  await db.execute(
    sql`UPDATE songs SET total_rounds = total_rounds + ${roundReached}, total_bracket_size = total_bracket_size + ${bracketSize}, total_score = total_score + ${calculatedScore}, games_played = games_played + 1 WHERE track_id = ${trackId}`,
  );
  if (isWinner) {
    await db.execute(
      sql`UPDATE songs SET games_won = games_won + 1 WHERE track_id = ${trackId}`,
    );
  }
  const oldSongRatingQuery = await db
    .select({
      rating: songs.rating,
    })
    .from(songs)
    .where(eq(songs.trackId, trackId));

  const oldSongRating = oldSongRatingQuery[0].rating as number;

  await db.execute(
    sql`UPDATE songs
    SET rating = 65 + (35 * (total_score / (total_bracket_size / 2))) * LEAST(1, LOG(games_played + 1) / LOG(2) / (LOG(100) / LOG(2)))
    WHERE games_played > 0;`,
  );

  const newSongRatingQuery = await db
    .select({
      rating: songs.rating,
    })
    .from(songs)
    .where(eq(songs.trackId, trackId));

  const newSongRating = newSongRatingQuery[0].rating as number;

  console.log("UPDATED DB FOR ", name);
  return { oldSongRating, newSongRating };
}
