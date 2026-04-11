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
  body: string;
  town: string;
  published_at: string | null;
  created_at: string;
  views_count: number;
  likes_count: number | null;
  image_path: string | null;
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
    body: readString(value, "body", scope),
    town: readString(value, "town", scope),
    published_at: readNullableString(value, "published_at", scope),
    created_at: readString(value, "created_at", scope),
    views_count: readNumber(value, "views_count", scope),
    likes_count: readNullableNumber(value, "likes_count", scope),
    image_path: readNullableString(value, "image_path", scope),
  };
}

// ─── Domain mappers ───────────────────────────────────────────────────────────

function formatRelativeTimeLabel(source: string | null) {
  if (!source) {
    return "방금";
  }

  const diff = Date.now() - new Date(source).getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < hour) {
    return `${Math.max(1, Math.floor(diff / minute))}분 전`;
  }

  if (diff < day) {
    return `${Math.floor(diff / hour)}시간 전`;
  }

  return `${Math.floor(diff / day)}일 전`;
}

function formatViewsLabel(viewsCount: number) {
  if (viewsCount >= 1000) {
    return `${(viewsCount / 1000).toFixed(1)}천`;
  }

  return `${viewsCount}`;
}

function buildCommunityImageSrc(imagePath: string | null) {
  if (!imagePath) {
    return undefined;
  }

  return encodeURI(`/api/community-post-images/${imagePath}`);
}

function buildExcerpt(body: string) {
  const normalized = body.replace(/\s+/g, " ").trim();
  if (normalized.length <= 88) {
    return normalized;
  }

  return `${normalized.slice(0, 88).trimEnd()}…`;
}

function mapCommunityPost(row: CommunityPostRow): CommunityPost {
  return {
    id: row.id,
    topic: row.topic,
    title: row.title,
    excerpt: buildExcerpt(row.body),
    town: row.town,
    postedAt: formatRelativeTimeLabel(row.published_at ?? row.created_at),
    views: formatViewsLabel(row.views_count),
    comments: 0,
    likes: row.likes_count ?? undefined,
    image: buildCommunityImageSrc(row.image_path),
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
      .order("published_at", { ascending: false, nullsFirst: false })
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
