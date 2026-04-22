import "server-only";

import { cache } from "react";
import { createServerSupabaseClient, hasSupabaseEnv } from "@/lib/supabase/server";
import { isRecord, logSupabaseFallback, parseRows, readNullableString, readString } from "@/lib/supabase/row-helpers";
import { getTownMapBusinessDetailFallback } from "@/lib/town-map-business";
import { type TownMapBusinessNewsFeedPost, type TownMapBusinessNewsPost } from "@/lib/town-map-business-news";

const BUSINESS_NEWS_TABLES = ["business_news", "business_news_posts"] as const;

type BusinessNewsRow = {
  id: string;
  business_id: string;
  title: string;
  body: string;
  image_path: string | null;
  created_at: string;
};

type BusinessSummaryRow = {
  id: string;
  name: string;
  category: string;
  image_url: string | null;
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

function parseBusinessSummaryRow(value: unknown, scope: string): BusinessSummaryRow {
  if (!isRecord(value)) {
    throw new Error(`[${scope}] Expected business summary row object`);
  }

  return {
    id: readString(value, "id", scope),
    name: readString(value, "name", scope),
    category: readString(value, "category", scope),
    image_url: readNullableString(value, "image_url", scope),
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

  return /^https?:\/\//.test(imagePath) ? imagePath : undefined;
}

function isMissingBusinessNewsTableError(error: unknown) {
  if (!isRecord(error) || typeof error.message !== "string") {
    return false;
  }

  return (
    error.message.includes("Could not find the table") ||
    error.message.includes("relation") && error.message.includes("does not exist")
  );
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

async function fetchBusinessNewsRows({
  businessId,
  limit,
}: {
  businessId?: string;
  limit?: number;
}) {
  const supabase = createServerSupabaseClient();

  for (const table of BUSINESS_NEWS_TABLES) {
    let query = supabase.from(table).select("id, business_id, title, body, image_path, created_at").order("created_at", { ascending: false });

    if (businessId) {
      query = query.eq("business_id", businessId);
    }

    if (limit != null) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      if (isMissingBusinessNewsTableError(error)) {
        continue;
      }

      throw error;
    }

    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    return parseRows(data, "business-news", parseBusinessNewsRow);
  }

  return [];
}

async function fetchBusinessSummaries(businessIds: string[]) {
  if (businessIds.length === 0) {
    return new Map<string, BusinessSummaryRow>();
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("businesses")
    .select("id, name, category, image_url")
    .in("id", businessIds);

  if (error) {
    throw error;
  }

  const rows = Array.isArray(data) ? parseRows(data, "business-summary", parseBusinessSummaryRow) : [];
  return new Map(rows.map((row) => [row.id, row]));
}

function normalizeBusinessImageSrc(imageUrl: string | null) {
  if (!imageUrl) {
    return undefined;
  }

  if (imageUrl.startsWith("/")) {
    return encodeURI(imageUrl);
  }

  return imageUrl;
}

export const getTownMapBusinessNewsPosts = cache(async (businessId: string): Promise<TownMapBusinessNewsPost[]> => {
  if (!hasSupabaseEnv()) {
    return [];
  }

  try {
    const rows = await fetchBusinessNewsRows({ businessId });

    if (rows.length === 0) {
      return [];
    }

    return rows.map(mapBusinessNewsRow);
  } catch (error) {
    logSupabaseFallback("business-news", error);
    return [];
  }
});

export const getTownMapBusinessNewsFeedPosts = cache(async (limit = 10): Promise<TownMapBusinessNewsFeedPost[]> => {
  if (!hasSupabaseEnv() || limit <= 0) {
    return [];
  }

  try {
    const rows = await fetchBusinessNewsRows({ limit });

    if (rows.length === 0) {
      return [];
    }

    const businessIds = Array.from(new Set(rows.map((row) => row.business_id)));
    const businessSummaryMap = await fetchBusinessSummaries(businessIds);

    return rows.flatMap((row) => {
      const businessSummary = businessSummaryMap.get(row.business_id);
      const fallbackBusiness = getTownMapBusinessDetailFallback(row.business_id);
      const businessName = businessSummary?.name ?? fallbackBusiness?.name;
      const businessCategory = businessSummary?.category ?? fallbackBusiness?.category;

      if (!businessName || !businessCategory) {
        return [];
      }

      return {
        ...mapBusinessNewsRow(row),
        businessId: row.business_id,
        businessName,
        businessCategory,
        businessImageSrc: normalizeBusinessImageSrc(businessSummary?.image_url ?? fallbackBusiness?.imageGallery[0] ?? null),
      };
    });
  } catch (error) {
    logSupabaseFallback("town-map-business-news-feed", error);
    return [];
  }
});
