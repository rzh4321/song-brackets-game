"use client";
import useUserPlaylists from "@/hooks/useUserPlaylists";
import useFeaturedPlaylists from "@/hooks/useFeaturedPlaylists";
import useCategoryPlaylists from "@/hooks/useCategoryPlaylists";
import PlaylistSection from "@/components/PlaylistSection";
import { usePathname } from "next/navigation";
import ErrorMessage from "./ErrorMessage";

export default function Playlists({
  userId,
  categoryId,
  categoryName,
}: {
  userId?: string | null;
  categoryId?: string;
  categoryName?: string;
}) {
  const pathname = usePathname();
  if (pathname === "/home") {
    return (
      <div className="w-full flex flex-col gap-3">
        {!userId && (
          <ErrorMessage
            message="Connect your Spotify ID to see your playlists!"
            type="link"
            link="Spotify ID"
          />
        )}
        <PlaylistSection
          usePlaylistHook={useUserPlaylists}
          hookParams={[userId]}
          label="Your Playlists"
        />
        {/* <PlaylistSection
          usePlaylistHook={useFeaturedPlaylists}
          hookParams={[]}
          label="Featured Playlists"
        /> */}
      </div>
    );
  } else if (pathname.includes("/categories")) {
    const label = categoryName as string;
    return (
      <div className="w-full">
        <PlaylistSection
          usePlaylistHook={useCategoryPlaylists}
          hookParams={[categoryId]}
          label={label}
        />
      </div>
    );
  }
}
