import "server-only";

import { cache } from "react";
import {
  communityPosts,
  getFallbackCommunityPostDetail,
  getFallbackCommunityRecommendations,
  type CommunityPost,
  type CommunityPostDetail,
} from "@/lib/community";
import { createServerSupabaseClient, hasSupabaseEnv } from "@/lib/supabase/server";
import {
  isRecord,
  logSupabaseFallback,
  parseRows,
  readNullableNumber,
  readNullableString,
  readNumber,
  readString,
} from "@/lib/supabase/row-helpers";

// ─── Row types ────────────────────────────────────────────────────────────────

type CommunityPostRow = {
  id: string;
  topic: string;
  title: string;
  excerpt: string;
  town: string;
  posted_at_label: string;
  views_label: string;
  comments_count: number;
  likes_count: number | null;
  image_url: string | null;
};

// ─── Row parsers ──────────────────────────────────────────────────────────────

function parseCommunityPostRow(value: unknown, scope: string): CommunityPostRow {
  if (!isRecord(value)) {
    throw new Error(`[${scope}] Expected community post row object`);
  }

  return {
    id: readString(value, "id", scope),
    topic: readString(value, "topic", scope),
    title: readString(value, "title", scope),
    excerpt: readString(value, "excerpt", scope),
    town: readString(value, "town", scope),
    posted_at_label: readString(value, "posted_at_label", scope),
    views_label: readString(value, "views_label", scope),
    comments_count: readNumber(value, "comments_count", scope),
    likes_count: readNullableNumber(value, "likes_count", scope),
    image_url: readNullableString(value, "image_url", scope),
  };
}

// ─── Domain mappers ───────────────────────────────────────────────────────────

function mapCommunityPost(row: CommunityPostRow): CommunityPost {
  return {
    id: row.id,
    topic: row.topic,
    title: row.title,
    excerpt: row.excerpt,
    town: row.town,
    postedAt: row.posted_at_label,
    views: row.views_label,
    comments: row.comments_count,
    likes: row.likes_count ?? undefined,
    image: row.image_url ?? undefined,
  };
}

// ─── Public exports ───────────────────────────────────────────────────────────

export const getCommunityPosts = cache(async (): Promise<CommunityPost[]> => {
  if (!hasSupabaseEnv()) {
    return communityPosts;
  }

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("community_posts")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data) {
      throw error ?? new Error("Missing community_posts data");
    }

    return parseRows(data, "community", parseCommunityPostRow).map(mapCommunityPost);
  } catch (error) {
    logSupabaseFallback("community", error);
    return communityPosts;
  }
});

export const getCommunityPostDetail = cache(async (postId: string): Promise<CommunityPostDetail | null> => {
  return getFallbackCommunityPostDetail(postId);
});

export const getCommunityRecommendations = cache(async (postId: string): Promise<CommunityPost[]> => {
  return getFallbackCommunityRecommendations(postId);
});
