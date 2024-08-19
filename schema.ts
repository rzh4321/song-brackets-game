import {
  pgTable,
  primaryKey,
  serial,
  integer,
  real,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const playlists = pgTable("playlists", {
  playlistId: varchar("playlist_id").primaryKey(),
  name: varchar("name").notNull(),
});

export const songs = pgTable("songs", {
  id: serial("id").primaryKey(),
  trackId: varchar("track_id"),
  rating: integer("rating"),
  url: varchar("url"),
  gamesPlayed: integer("games_played"),
  totalScore: real("total_score"),
  gamesWon: integer("games_won"),
  playlistId: varchar("playlist_id"),
  totalRounds: integer("total_rounds"),
  totalBracketSize: integer("total_bracket_size"),
  name: varchar("name"),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username"),
  spotifyId: varchar("spotify_id"),
  password: varchar("password"),
  name: varchar("name"),
});

export const songRelations = relations(songs, ({ one }) => ({
  author: one(playlists, {
    fields: [songs.playlistId],
    references: [playlists.playlistId],
  }),
}));
