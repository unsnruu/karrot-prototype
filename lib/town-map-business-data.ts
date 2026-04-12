import "server-only";

import { cache } from "react";
import { getTownMapBusinessDetailFallback, type TownMapBusinessDetail } from "@/lib/town-map-business";
import { createServerSupabaseClient, hasSupabaseEnv } from "@/lib/supabase/server";
import { isRecord, logSupabaseFallback, readNullableFloat, readNullableNumber, readNullableString, readString } from "@/lib/supabase/row-helpers";

function readStringArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value.filter((entry): entry is string => typeof entry === "string");
}

function readReviewCount(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function mapBusinessRowToDetail(row: Record<string, unknown>, fallback: TownMapBusinessDetail) {
  return {
    ...fallback,
    id: readString(row, "id", "town-map-business"),
    name: readString(row, "name", "town-map-business"),
    category: readString(row, "category", "town-map-business"),
    townLabel: readNullableString(row, "town_label", "town-map-business") ?? fallback.townLabel,
    phoneNumber: readNullableString(row, "phone_number", "town-map-business") ?? fallback.phoneNumber,
    businessHoursText: readNullableString(row, "business_hours_text", "town-map-business") ?? fallback.businessHoursText,
    roadAddress:
      readNullableString(row, "road_address", "town-map-business") ??
      readNullableString(row, "address", "town-map-business") ??
      fallback.roadAddress,
    introText: readStringArray(row.intro_text, fallback.introText),
    amenities: readStringArray(row.amenities, fallback.amenities),
    reviewCount: readReviewCount(row.review_count, fallback.reviewCount),
    rating: readNullableNumber(row, "rating", "town-map-business") ?? fallback.rating,
    lat: readNullableFloat(row, "lat", "town-map-business") ?? fallback.lat,
    lng: readNullableFloat(row, "lng", "town-map-business") ?? fallback.lng,
    websiteUrl: readNullableString(row, "website_url", "town-map-business") ?? fallback.websiteUrl,
    websiteLabel: readNullableString(row, "website_label", "town-map-business") ?? fallback.websiteLabel,
  };
}

export const getTownMapBusinessDetail = cache(async (id: string): Promise<TownMapBusinessDetail | null> => {
  const fallback = getTownMapBusinessDetailFallback(id);

  if (!hasSupabaseEnv()) {
    return fallback;
  }

  if (!fallback) {
    return null;
  }

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.from("businesses").select("*").eq("id", id).maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return fallback;
    }

    if (!isRecord(data)) {
      throw new Error("Invalid business row");
    }

    return mapBusinessRowToDetail(data, fallback);
  } catch (error) {
    logSupabaseFallback("town-map-business-detail", error);
    return fallback;
  }
});
