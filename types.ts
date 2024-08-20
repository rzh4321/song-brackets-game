import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

export type currentRoundBracketType = {
  bracket: number;
  part1: participantsType;
  part2: participantsType;
};

export type resultBracketType = {
  round: number;
  bracket: number;
  part1: participantsType;
  part2: participantsType;
  nextRound: number | null;
  nextBracket: number | null;
  winner: string;
};

export type SongDBStats = {
  name: string;
  id: string;
  playlistId: string;
  gamesPlayed: number;
  gamesWon: number;
  totalBracketSize: number;
  totalRounds: number;
  totalScore: number;
  rating: number;
  winRate: number;
};

export type SongWithStatsType = Song & {
  rating: number;
  playlistId: string;
  gamesPlayed: number;
  totalScore: number;
  gamesWon: number;
  totalRounds: number;
  totalBracketSize: number;
};
export type ParticipantWithStatsType = participantsType & {
  rating: number;
  playlistId: string;
  gamesPlayed: number;
  totalScore: number;
  gamesWon: number;
  totalRounds: number;
  totalBracketSize: number;
};

// export type participantsType = SongWithStatsType & { cameFromBracket: number };
export type participantsType = Song & {
  cameFromBracket: number;
  playlistId: string;
  playlistName: string;
};

export type Song = {
  id: string;
  url: string;
  name: string;
  hide?: boolean;
  album: string;
  date_added: string;
  artists: string[];
  duration: number;
  image: string;
  popularity: number;
};

export type SimplifiedPlaylistObject = {
  name: string;
  playlistId: string;
  image: string | null;
};

export type ParticipantType = {
  id: string;
  resultText: string | null;
  isWinner: boolean;
  status: string | null;
  name: string;
  picture: string;
};

export type HeartStyle = {
  id: number;
  style: React.CSSProperties;
};

export type MatchType = {
  id: number;
  nextMatchId: number | null;
  tournamentRoundText: string;
  startTime: string;
  state: "PLAYED" | "SCHEDULED" | "RUNNING" | "SCORE_DONE";
  participants: ParticipantType[];
};

export type PlaylistInfo = {
  name: string;
  playlistId: string;
  image: string | null;
  description: string;
  count: number;
  owner: string;
};

export type ScoreEntry = {
  score: number;
  timestamp: Date;
  name: string;
  id: number;
};

export type HighestScoreAndPosition = {
  score: number;
  timestamp: Date;
  position: number;
} | null;

export type SimplifiedCategoryObject = {
  name: string;
  categoryId: string;
  image: string | null;
};

export type Track = {
  added_at: string;
  added_by: AddedBy;
  is_local: boolean;
  track: TrackClass;
};

export type usePlaylistReturnTypes = {
  data: any;
  isLoading: boolean;
  error: Error | null;
  refetch: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<any, Error>>;
};

export type AddedBy = {
  external_urls: ExternalUrls;
  followers?: Followers;
  href: string;
  id: string;
  type: string;
  uri: string;
  name?: string;
};

export type ExternalUrls = {
  spotify: string;
};

export type Followers = {
  href: string;
  total: number;
};

export type TrackClass = {
  album: Album;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIDS;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_playable: boolean;
  linked_from: LinkedFrom;
  restrictions: Restrictions;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
};

export type Album = {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions: Restrictions;
  type: string;
  uri: string;
  artists: AddedBy[];
};

export type Image = {
  url: string;
  height: number;
  width: number;
};

export type Restrictions = {
  reason: string;
};

export type Artist = {
  external_urls: ExternalUrls;
  followers: Followers;
  genres: string[];
  href: string;
  id: string;
  images: Image[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
};

export type ExternalIDS = {
  isrc: string;
  ean: string;
  upc: string;
};

export type LinkedFrom = {};

export type Playlist = {
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: Owner;
  public: boolean;
  snapshot_id: string;
  tracks: Tracks;
  type: string;
  uri: string;
};

export type Owner = {
  external_urls: ExternalUrls;
  followers: Tracks;
  href: string;
  id: string;
  type: string;
  uri: string;
  display_name: string;
};

export type Tracks = {
  href: string;
  total: number;
};

export type Category = {
  href: string;
  icons: Icon[];
  id: string;
  name: string;
};

export type Icon = {
  url: string;
  height: number;
  width: number;
};
