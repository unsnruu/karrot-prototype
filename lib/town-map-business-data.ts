import "server-only";

import { cache } from "react";
import { LOCAL_FALLBACK_IMAGE_SRC } from "@/lib/fallback-images";
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

  return {
    id,
    label: name,
    lat,
    lng,
    icon: townMapMarkerIcon,
    href: `/town-map/businesses/${id}`,
  };
}

type NearbyBusinessCardRow = {
  id: string;
  name: string;
  category: string;
  town_label: string | null;
  rating: number | null;
  review_count: number | null;
  lat: number | null;
  lng: number | null;
};

function parseNearbyBusinessCardRow(value: unknown, fallback?: TownMapBusinessDetail): NearbyTownMapBusinessCard {
  if (!isRecord(value)) {
    throw new Error("[nearby-business-card] Expected business row object");
  }

  return {
    id: readString(value, "id", "nearby-business-card"),
    name: readString(value, "name", "nearby-business-card"),
    category: readString(value, "category", "nearby-business-card"),
    image: LOCAL_FALLBACK_IMAGE_SRC,
    townLabel: readNullableString(value, "town_label", "nearby-business-card") ?? fallback?.townLabel ?? "우리 동네",
    regularCount:
      readNullableNumber(value, "review_count", "nearby-business-card") ?? fallback?.reviewCount ?? 0,
    rating: readNullableNumber(value, "rating", "nearby-business-card") ?? fallback?.rating ?? 0,
  };
}

export type NearbyTownMapBusinessCard = {
  id: string;
  name: string;
  category: string;
  image: string;
  townLabel: string;
  regularCount: number;
  rating: number;
};

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function calculateDistanceInKilometers(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
) {
  const earthRadiusKm = 6371;
  const deltaLat = toRadians(to.lat - from.lat);
  const deltaLng = toRadians(to.lng - from.lng);
  const fromLat = toRadians(from.lat);
  const toLat = toRadians(to.lat);

  const haversine =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function mapBusinessDetailToNearbyCard(detail: TownMapBusinessDetail): NearbyTownMapBusinessCard {
  return {
    id: detail.id,
    name: detail.name,
    category: detail.category,
    image: detail.imageGallery[0] ?? detail.mapPreviewImage ?? LOCAL_FALLBACK_IMAGE_SRC,
    townLabel: detail.townLabel,
    regularCount: detail.reviewCount,
    rating: detail.rating,
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

export const getNearbyTownMapBusinessCards = cache(
  async ({
    lat,
    lng,
    limit = 3,
  }: {
    lat?: number;
    lng?: number;
    limit?: number;
  }): Promise<NearbyTownMapBusinessCard[]> => {
    if (limit <= 0) {
      return [];
    }

    if (hasSupabaseEnv()) {
      try {
        const supabase = createServerSupabaseClient();
        const { data, error } = await supabase
          .from("businesses")
          .select("id, name, category, town_label, rating, review_count, lat, lng")
          .order("id")
          .limit(Math.max(limit * 3, limit));

        if (error) {
          throw error;
        }

        if (Array.isArray(data) && data.length > 0) {
          const rows = data.filter(isRecord);

          const sortedRows =
            lat != null && lng != null
              ? rows.slice().sort((left, right) => {
                  const leftLat = readNullableFloat(left, "lat", "nearby-business-card");
                  const leftLng = readNullableFloat(left, "lng", "nearby-business-card");
                  const rightLat = readNullableFloat(right, "lat", "nearby-business-card");
                  const rightLng = readNullableFloat(right, "lng", "nearby-business-card");

                  const leftDistance =
                    leftLat != null && leftLng != null
                      ? calculateDistanceInKilometers({ lat, lng }, { lat: leftLat, lng: leftLng })
                      : Number.POSITIVE_INFINITY;
                  const rightDistance =
                    rightLat != null && rightLng != null
                      ? calculateDistanceInKilometers({ lat, lng }, { lat: rightLat, lng: rightLng })
                      : Number.POSITIVE_INFINITY;

                  return leftDistance - rightDistance;
                })
              : rows;

          return sortedRows.slice(0, limit).map((row) => parseNearbyBusinessCardRow(row));
        }
      } catch (error) {
        logSupabaseFallback("nearby-business-cards", error);
      }
    }

    if (lat == null || lng == null) {
      return townMapPins
        .slice(0, limit)
        .map((pin) => getTownMapBusinessDetailFallback(pin.id))
        .filter((detail): detail is TownMapBusinessDetail => detail != null)
        .map(mapBusinessDetailToNearbyCard);
    }

    const pins = await getTownMapPins();

    const nearestPins = pins
      .slice()
      .sort(
        (left, right) =>
          calculateDistanceInKilometers({ lat, lng }, { lat: left.lat, lng: left.lng }) -
          calculateDistanceInKilometers({ lat, lng }, { lat: right.lat, lng: right.lng }),
      )
      .slice(0, limit);

    const details = await Promise.all(nearestPins.map((pin) => getTownMapBusinessDetail(pin.id)));

    return details.filter((detail): detail is TownMapBusinessDetail => detail != null).map(mapBusinessDetailToNearbyCard);
  },
);
