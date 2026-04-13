import "server-only";

import { cache } from "react";
import { getTownMapBusinessDetailFallback, type TownMapBusinessDetail } from "@/lib/town-map-business";
import { townMapMarkerIcon, townMapPins, type TownMapPin } from "@/lib/town-map";
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

function createDefaultBusinessDetail(id: string): TownMapBusinessDetail {
  return {
    id,
    name: "업체 정보",
    category: "업체",
    townLabel: "합정동",
    rating: 0,
    reviewCount: 0,
    photoCount: 0,
    informantName: "당근 이웃",
    imageGallery: [],
    businessHoursText: "영업시간 정보가 아직 없어요.",
    phoneNumber: "전화번호 정보가 아직 없어요.",
    websiteLabel: null,
    websiteUrl: null,
    amenities: [],
    roadAddress: "주소 정보가 아직 없어요.",
    introText: ["등록된 소개 정보가 아직 없어요."],
    lat: 37.54991,
    lng: 126.9144,
    mapPreviewImage: "",
    menuItems: [],
    reviews: [],
    updatedAtLabel: "최근 수정 정보 없음",
  };
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

function mapBusinessRowToPin(row: Record<string, unknown>): TownMapPin {
  const id = readString(row, "id", "town-map-pin");
  const name = readString(row, "name", "town-map-pin");
  const lat = readNullableFloat(row, "lat", "town-map-pin");
  const lng = readNullableFloat(row, "lng", "town-map-pin");

  if (lat == null || lng == null) {
    throw new Error("[town-map-pin] Missing lat/lng");
  }

  const townLabel = readNullableString(row, "town_label", "town-map-pin");

  return {
    id,
    label: townLabel ? `${name}\n${townLabel}` : name,
    lat,
    lng,
    icon: townMapMarkerIcon,
    href: `/town-map/businesses/${id}`,
  };
}

export const getTownMapPins = cache(async (): Promise<TownMapPin[]> => {
  if (!hasSupabaseEnv()) {
    return townMapPins;
  }

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.from("businesses").select("id, name, town_label, lat, lng").order("id");

    if (error) {
      throw error;
    }

    if (!Array.isArray(data) || data.length === 0) {
      return townMapPins;
    }

    return data.filter(isRecord).map((row) => mapBusinessRowToPin(row));
  } catch (error) {
    logSupabaseFallback("town-map-pins", error);
    return townMapPins;
  }
});

export const getTownMapBusinessDetail = cache(async (id: string): Promise<TownMapBusinessDetail | null> => {
  const fallback = getTownMapBusinessDetailFallback(id) ?? createDefaultBusinessDetail(id);

  if (!hasSupabaseEnv()) {
    return getTownMapBusinessDetailFallback(id);
  }

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.from("businesses").select("*").eq("id", id).maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return getTownMapBusinessDetailFallback(id);
    }

    if (!isRecord(data)) {
      throw new Error("Invalid business row");
    }

    return mapBusinessRowToDetail(data, fallback);
  } catch (error) {
    logSupabaseFallback("town-map-business-detail", error);
    return getTownMapBusinessDetailFallback(id);
  }
});
