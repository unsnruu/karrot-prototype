import "server-only";

import { cache } from "react";
import { createServerSupabaseClient, hasSupabaseEnv } from "@/lib/supabase/server";
import { isRecord, logSupabaseFallback, parseRows, readNullableString, readString } from "@/lib/supabase/row-helpers";
import { townMapBusinessNewsFallbackRows, type TownMapBusinessNewsFallbackRow, type TownMapBusinessNewsPost } from "@/lib/town-map-business-news";

type BusinessNewsRow = {
  id: string;
  business_id: string;
  title: string;
  body: string;
  image_path: string | null;
  created_at: string;
};

function parseBusinessNewsRow(value: unknown, scope: string): BusinessNewsRow {
  if (!isRecord(value)) {
    throw new Error(`[${scope}] Expected business news row object`);
  }

  return {
    id: readString(value, "id", scope),
    business_id: readString(value, "business_id", scope),
    title: readString(value, "title", scope),
    body: readString(value, "body", scope),
    image_path: readNullableString(value, "image_path", scope),
    created_at: readString(value, "created_at", scope),
  };
}

function formatRelativeTimeLabel(source: string) {
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

function buildBusinessNewsImageSrc(imagePath: string | null) {
  if (!imagePath) {
    return undefined;
  }

  if (/^https?:\/\//.test(imagePath)) {
    return imagePath;
  }

  return encodeURI(`/api/business-news-images/${imagePath}`);
}

function mapBusinessNewsRow(row: Pick<BusinessNewsRow, "id" | "title" | "body" | "created_at" | "image_path">): TownMapBusinessNewsPost {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    createdAt: row.created_at,
    postedAtLabel: formatRelativeTimeLabel(row.created_at),
    imageSrc: buildBusinessNewsImageSrc(row.image_path),
  };
}

function getFallbackBusinessNewsPosts(businessId: string) {
  return townMapBusinessNewsFallbackRows
    .filter((row) => row.business_id === businessId)
    .sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime())
    .map((row: TownMapBusinessNewsFallbackRow) => mapBusinessNewsRow(row));
}

export const getTownMapBusinessNewsPosts = cache(async (businessId: string): Promise<TownMapBusinessNewsPost[]> => {
  const fallback = getFallbackBusinessNewsPosts(businessId);

  if (!hasSupabaseEnv()) {
    return fallback;
  }

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("business_news_posts")
      .select("id, business_id, title, body, image_path, created_at")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    if (!Array.isArray(data) || data.length === 0) {
      return fallback;
    }

    return parseRows(data, "business-news", parseBusinessNewsRow).map(mapBusinessNewsRow);
  } catch (error) {
    logSupabaseFallback("business-news", error);
    return fallback;
  }
});
