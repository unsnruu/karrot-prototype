import "server-only";

import { cache } from "react";
import {
  HOME_FEED_PAGE_SIZE,
  formatItemSlug,
  getSellerById,
  homeNativeAdsFallback,
  homeCategoriesFallback,
  type HomeFeedEntry,
  type HomeNativeAdFeature,
  type HomeFeedNativeAd,
  marketplaceItems,
  parseItemSlug,
  resolveHomeNativeAdHref,
  type HomeCategory,
  type HomeFeedItem,
  type MarketplaceItem,
  type SellerProfile,
} from "@/lib/marketplace";
import { createServerSupabaseClient, hasSupabaseEnv } from "@/lib/supabase/server";
import {
  isRecord,
  logSupabaseFallback,
  parseRows,
  readBoolean,
  readNullableFloat,
  readNullableNumber,
  readNullableString,
  readNumber,
  readStatus,
  readString,
  readStringArrayOrNull,
} from "@/lib/supabase/row-helpers";

// ─── Row types ────────────────────────────────────────────────────────────────

type SellerRow = {
  id: string;
  name: string;
  avatar_url: string | null;
  town: string;
  response_rate: number;
  manner_score: number;
  repeat_deals: number;
  badges: string[] | null;
};

type ItemRow = {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  price_value: number | null;
  status: "active" | "reserved" | "sold";
  category: string;
  price_negotiable: boolean;
  town: string;
  posted_at: string;
  refreshed_at: string | null;
  likes_count: number;
  chats_count: number;
  meetup_place_name: string | null;
  meetup_place_address: string | null;
  meetup_place_lat: number | null;
  meetup_place_lng: number | null;
  meetup_distance_meters: number | null;
  sort_order: number;
  created_at: string;
};

type ItemImageRow = {
  item_id: string;
  image_url: string;
  sort_order: number;
};

type SellerMetricsRow = {
  id: string;
  response_rate: number;
  repeat_deals: number;
};

type HomeFeedItemRow = Pick<
  ItemRow,
  "id" | "title" | "category" | "town" | "posted_at" | "refreshed_at" | "price_value" | "chats_count" | "likes_count"
  | "meetup_distance_meters" | "sort_order"
>;

type HomeCategoryRow = Pick<ItemRow, "category" | "sort_order">;

type HomeNativeAdRow = {
  id: string;
  title: string;
  feature: HomeNativeAdFeature;
  image_url: string;
  destination: HomeNativeAdFeature;
  likes_count: number;
  placement_key: string;
};

// ─── Row parsers ──────────────────────────────────────────────────────────────

function parseItemRow(value: unknown, scope: string): ItemRow {
  if (!isRecord(value)) {
    throw new Error(`[${scope}] Expected item row object`);
  }

  return {
    id: readString(value, "id", scope),
    seller_id: readString(value, "seller_id", scope),
    title: readString(value, "title", scope),
    description: readString(value, "description", scope),
    price_value: readNullableNumber(value, "price_value", scope),
    status: readStatus(value, "status", scope),
    category: readString(value, "category", scope),
    price_negotiable: readBoolean(value, "price_negotiable", scope),
    town: readString(value, "town", scope),
    posted_at: readString(value, "posted_at", scope),
    refreshed_at: readNullableString(value, "refreshed_at", scope),
    likes_count: readNumber(value, "likes_count", scope),
    chats_count: readNumber(value, "chats_count", scope),
    meetup_place_name: readNullableString(value, "meetup_place_name", scope),
    meetup_place_address: readNullableString(value, "meetup_place_address", scope),
    meetup_place_lat: readNullableFloat(value, "meetup_place_lat", scope),
    meetup_place_lng: readNullableFloat(value, "meetup_place_lng", scope),
    meetup_distance_meters: readNullableNumber(value, "meetup_distance_meters", scope),
    sort_order: readNumber(value, "sort_order", scope),
    created_at: readString(value, "created_at", scope),
  };
}

function parseHomeFeedItemRow(value: unknown, scope: string): HomeFeedItemRow {
  if (!isRecord(value)) {
    throw new Error(`[${scope}] Expected home feed item row object`);
  }

  return {
    id: readString(value, "id", scope),
    title: readString(value, "title", scope),
    category: readString(value, "category", scope),
    town: readString(value, "town", scope),
    posted_at: readString(value, "posted_at", scope),
    refreshed_at: readNullableString(value, "refreshed_at", scope),
    price_value: readNullableNumber(value, "price_value", scope),
    chats_count: readNumber(value, "chats_count", scope),
    likes_count: readNumber(value, "likes_count", scope),
    meetup_distance_meters: readNullableNumber(value, "meetup_distance_meters", scope),
    sort_order: readNumber(value, "sort_order", scope),
  };
}

function parseHomeCategoryRow(value: unknown, scope: string): HomeCategoryRow {
  if (!isRecord(value)) {
    throw new Error(`[${scope}] Expected home category row object`);
  }

  return {
    category: readString(value, "category", scope),
    sort_order: readNumber(value, "sort_order", scope),
  };
}

function parseHomeNativeAdRow(value: unknown, scope: string): HomeNativeAdRow {
  if (!isRecord(value)) {
    throw new Error(`[${scope}] Expected home native ad row object`);
  }

  const feature = readString(value, "feature", scope);
  const destination = readString(value, "destination", scope);

  if (feature !== "동네지도" && feature !== "동네 생활" && feature !== "모임" && feature !== "카페") {
    throw new Error(`[${scope}] Unsupported feature: ${feature}`);
  }

  if (destination !== "동네지도" && destination !== "동네 생활" && destination !== "모임" && destination !== "카페") {
    throw new Error(`[${scope}] Unsupported destination: ${destination}`);
  }

  return {
    id: readString(value, "id", scope),
    title: readString(value, "title", scope),
    feature,
    image_url: readString(value, "image_url", scope),
    destination,
    likes_count: readNumber(value, "likes_count", scope),
    placement_key: readString(value, "placement_key", scope),
  };
}

function parseItemImageRow(value: unknown, scope: string): ItemImageRow {
  if (!isRecord(value)) {
    throw new Error(`[${scope}] Expected item image row object`);
  }

  return {
    item_id: readString(value, "item_id", scope),
    image_url: readString(value, "image_url", scope),
    sort_order: readNumber(value, "sort_order", scope),
  };
}

function parseSellerMetricsRow(value: unknown, scope: string): SellerMetricsRow {
  if (!isRecord(value)) {
    throw new Error(`[${scope}] Expected seller metrics row object`);
  }

  return {
    id: readString(value, "id", scope),
    response_rate: readNumber(value, "response_rate", scope),
    repeat_deals: readNumber(value, "repeat_deals", scope),
  };
}

function parseSellerRow(value: unknown, scope: string): SellerRow {
  if (!isRecord(value)) {
    throw new Error(`[${scope}] Expected seller row object`);
  }

  return {
    id: readString(value, "id", scope),
    name: readString(value, "name", scope),
    avatar_url: readNullableString(value, "avatar_url", scope),
    town: readString(value, "town", scope),
    response_rate: readNumber(value, "response_rate", scope),
    manner_score: readNumber(value, "manner_score", scope),
    repeat_deals: readNumber(value, "repeat_deals", scope),
    badges: readStringArrayOrNull(value, "badges", scope),
  };
}

// ─── Formatters ───────────────────────────────────────────────────────────────

function formatRelativeTimeLabel(source: string | null) {
  if (!source) {
    return "방금";
  }

  const diff = Date.now() - new Date(source).getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;

  if (diff < hour) {
    return `${Math.max(1, Math.floor(diff / minute))}분 전`;
  }

  if (diff < day) {
    return `${Math.floor(diff / hour)}시간 전`;
  }

  if (diff < week) {
    return `${Math.floor(diff / day)}일 전`;
  }

  if (diff < month) {
    return `${Math.floor(diff / week)}주 전`;
  }

  return `${Math.floor(diff / month)}개월 전`;
}

function formatDistanceLabel(distanceMeters: number | null) {
  if (distanceMeters == null) {
    return "거리 정보 없음";
  }

  if (distanceMeters < 1000) {
    return `${distanceMeters}m`;
  }

  return `${(distanceMeters / 1000).toFixed(1)}km`;
}

function formatPriceLabel(price: number | null) {
  if (price == null) {
    return undefined;
  }

  return `${price.toLocaleString("ko-KR")}원`;
}

function normalizeImageSrc(src: string | undefined) {
  if (!src) {
    return "";
  }

  if (src.startsWith("/")) {
    return encodeURI(src);
  }

  return src;
}

// ─── Domain mappers ───────────────────────────────────────────────────────────

function deriveTrustLabel(item: ItemRow, seller?: SellerMetricsRow) {
  if (seller && seller.response_rate >= 95) {
    return "응답이 정말 빨라요";
  }

  if (seller && seller.repeat_deals >= 10) {
    return "재거래가 많은 판매자예요";
  }

  if (item.status === "reserved") {
    return "예약이 진행 중인 상품이에요";
  }

  if (item.status === "sold") {
    return "거래가 완료된 상품이에요";
  }

  return "동네에서 신뢰를 쌓고 있는 판매자예요";
}

function deriveTrustNote(item: ItemRow, seller?: SellerMetricsRow) {
  if (seller && seller.response_rate >= 95) {
    return "최근 문의에도 빠르게 답하는 편이라 채팅 연결이 수월해요.";
  }

  if (seller && seller.repeat_deals >= 10) {
    return "같은 동네에서 여러 번 거래한 이력이 있어 안심하고 문의하기 좋아요.";
  }

  if (item.price_negotiable) {
    return "가격 제안을 받을 수 있어 부담 없이 문의해볼 수 있어요.";
  }

  return "상품 설명과 거래 장소 정보가 비교적 또렷하게 정리된 편이에요.";
}

function mapSeller(row: SellerRow): SellerProfile {
  return {
    id: row.id,
    name: row.name,
    avatar: normalizeImageSrc(row.avatar_url ?? ""),
    town: row.town,
    responseRate: row.response_rate,
    mannerScore: row.manner_score,
    repeatDeals: row.repeat_deals,
    badges: row.badges ?? [],
  };
}

function mapItemRowToMarketplaceItem(
  row: ItemRow,
  imageUrl: string | undefined,
  seller?: SellerMetricsRow,
): MarketplaceItem {
  return {
    id: row.id,
    slug: formatItemSlug(row.sort_order),
    title: row.title,
    description: row.description,
    image: normalizeImageSrc(imageUrl),
    town: row.town,
    distance: formatDistanceLabel(row.meetup_distance_meters),
    postedAt: formatRelativeTimeLabel(row.refreshed_at ?? row.posted_at),
    priceLabel: formatPriceLabel(row.price_value),
    priceValue: row.price_value ?? undefined,
    chats: row.chats_count,
    likes: row.likes_count,
    sellerId: row.seller_id,
    trustLabel: deriveTrustLabel(row, seller),
    trustNote: deriveTrustNote(row, seller),
    sellingPoints: [
      row.category,
      ...(row.price_negotiable ? ["가격 제안 가능"] : []),
      ...(row.meetup_place_name ? [`거래 희망 장소: ${row.meetup_place_name}`] : []),
    ],
    condition:
      row.status === "reserved" ? "예약중" : row.status === "sold" ? "판매완료" : "판매중",
    meetupHint: row.meetup_place_name ?? `${row.town} 인근`,
    meetupAddress: row.meetup_place_address ?? undefined,
    meetupLat: row.meetup_place_lat ?? undefined,
    meetupLng: row.meetup_place_lng ?? undefined,
    promoted: false,
  };
}

function mapItemRowToHomeFeedItem(
  row: HomeFeedItemRow,
  imageUrl: string | undefined,
): HomeFeedItem {
  return {
    type: "marketplace-item",
    id: row.id,
    slug: formatItemSlug(row.sort_order),
    title: row.title,
    subtitle: row.category,
    image: normalizeImageSrc(imageUrl),
    town: row.town,
    distance: formatDistanceLabel(row.meetup_distance_meters),
    postedAt: formatRelativeTimeLabel(row.refreshed_at ?? row.posted_at),
    priceLabel: formatPriceLabel(row.price_value),
    chats: row.chats_count,
    likes: row.likes_count,
    promoted: false,
  };
}

function mapFallbackItemToHomeFeedItem(item: MarketplaceItem): HomeFeedItem {
  const fallbackIndex = marketplaceItems.findIndex((entry) => entry.id === item.id);
  const slug = formatItemSlug((fallbackIndex >= 0 ? fallbackIndex : 0) + 1);

  return {
    type: "marketplace-item",
    id: item.id,
    slug,
    title: item.title,
    subtitle: item.subtitle,
    image: item.image,
    town: item.town,
    distance: item.distance,
    postedAt: item.postedAt,
    priceLabel: item.priceLabel,
    chats: item.chats,
    likes: item.likes,
    promoted: item.promoted,
  };
}

function mapHomeNativeAdRow(row: HomeNativeAdRow): HomeFeedNativeAd {
  return {
    type: "native-ad",
    id: row.id,
    title: row.title,
    feature: row.feature,
    image: normalizeImageSrc(row.image_url),
    destination: row.destination,
    likes: row.likes_count,
    placementKey: row.placement_key,
    href: resolveHomeNativeAdHref(row.destination),
  };
}

// ─── Fallback helpers ─────────────────────────────────────────────────────────

function withFallbackItemSlug(item: MarketplaceItem, index: number): MarketplaceItem {
  return {
    ...item,
    slug: formatItemSlug(index + 1),
  };
}

function getFallbackItemBySlug(itemSlug: string) {
  const slugOrder = parseItemSlug(itemSlug);
  const fallbackIndex = slugOrder ? slugOrder - 1 : -1;
  const fallbackItem = fallbackIndex >= 0 ? marketplaceItems[fallbackIndex] : undefined;

  return fallbackItem ? withFallbackItemSlug(fallbackItem, fallbackIndex) : null;
}

export function getFallbackItemById(itemId: string) {
  const fallbackIndex = marketplaceItems.findIndex((item) => item.id === itemId);

  return fallbackIndex >= 0 ? withFallbackItemSlug(marketplaceItems[fallbackIndex], fallbackIndex) : null;
}

function interleaveItemsByGroup<T>(items: T[], getGroupKey: (item: T) => string): T[] {
  const groupOrder: string[] = [];
  const groupedItems = new Map<string, T[]>();

  items.forEach((item) => {
    const groupKey = getGroupKey(item);
    const existingGroup = groupedItems.get(groupKey);

    if (existingGroup) {
      existingGroup.push(item);
      return;
    }

    groupOrder.push(groupKey);
    groupedItems.set(groupKey, [item]);
  });

  const hasAlternativeGroup = (excludedGroup: string) =>
    groupOrder.some((groupKey) => groupKey !== excludedGroup && (groupedItems.get(groupKey)?.length ?? 0) > 0);

  const mixedItems: T[] = [];
  let nextGroupIndex = 0;
  let lastGroupKey: string | null = null;

  while (mixedItems.length < items.length) {
    let selectedGroupIndex = -1;

    for (let attempt = 0; attempt < groupOrder.length; attempt += 1) {
      const candidateIndex = (nextGroupIndex + attempt) % groupOrder.length;
      const candidateGroupKey = groupOrder[candidateIndex];
      const candidateItems = groupedItems.get(candidateGroupKey);

      if (!candidateItems?.length) {
        continue;
      }

      if (candidateGroupKey === lastGroupKey && hasAlternativeGroup(candidateGroupKey)) {
        continue;
      }

      selectedGroupIndex = candidateIndex;
      break;
    }

    if (selectedGroupIndex < 0) {
      selectedGroupIndex = groupOrder.findIndex((groupKey) => (groupedItems.get(groupKey)?.length ?? 0) > 0);
    }

    if (selectedGroupIndex < 0) {
      break;
    }

    const selectedGroupKey = groupOrder[selectedGroupIndex];
    const selectedItems = groupedItems.get(selectedGroupKey);
    const nextItem = selectedItems?.shift();

    if (!nextItem) {
      break;
    }

    mixedItems.push(nextItem);
    lastGroupKey = selectedGroupKey;
    nextGroupIndex = (selectedGroupIndex + 1) % groupOrder.length;
  }

  return mixedItems;
}

function buildHomeCategories(items: Array<Pick<ItemRow, "category">>): HomeCategory[] {
  const categoryOrder = new Map<string, number>();

  items.forEach((item, index) => {
    if (!categoryOrder.has(item.category)) {
      categoryOrder.set(item.category, index);
    }
  });

  return [
    { label: "전체" },
    ...Array.from(categoryOrder.entries())
      .sort((a, b) => a[1] - b[1])
      .map(([label]) => ({
        label,
        hasChevron: label === "부동산",
      })),
  ];
}

// ─── Public exports ───────────────────────────────────────────────────────────

export const getHomeCategories = cache(async (): Promise<HomeCategory[]> => {
  if (!hasSupabaseEnv()) {
    return homeCategoriesFallback;
  }

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("items")
      .select("category, sort_order")
      .neq("status", "sold")
      .order("sort_order", { ascending: true })
      .order("posted_at", { ascending: false })
      .order("created_at", { ascending: false });

    if (error || !data) {
      throw error ?? new Error("Missing item categories");
    }

    return buildHomeCategories(parseRows(data, "home-categories", parseHomeCategoryRow));
  } catch (error) {
    logSupabaseFallback("home-categories", error);
    return homeCategoriesFallback;
  }
});

export const getHomeNativeAds = cache(async ({
  placementKey = "home_feed_inline",
}: {
  placementKey?: string;
} = {}): Promise<HomeFeedNativeAd[]> => {
  if (!hasSupabaseEnv()) {
    return homeNativeAdsFallback.filter((ad) => ad.placementKey === placementKey);
  }

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("home_native_ads")
      .select("id, title, feature, image_url, destination, likes_count, placement_key")
      .eq("placement_key", placementKey)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error || !data) {
      throw error ?? new Error("Missing home native ads data");
    }

    return parseRows(data, "home-native-ads", parseHomeNativeAdRow).map(mapHomeNativeAdRow);
  } catch (error) {
    logSupabaseFallback("home-native-ads", error);
    return homeNativeAdsFallback.filter((ad) => ad.placementKey === placementKey);
  }
});

function insertNativeAdsIntoHomeFeed(items: HomeFeedItem[], ads: HomeFeedNativeAd[], itemOffset: number) {
  const entries: HomeFeedEntry[] = [];

  items.forEach((item, index) => {
    const globalItemIndex = itemOffset + index + 1;
    entries.push(item);

    if (globalItemIndex % 3 !== 0) {
      return;
    }

    const adIndex = Math.floor(globalItemIndex / 3) - 1;
    const ad = ads[adIndex];
    if (ad) {
      entries.push(ad);
    }
  });

  return entries;
}

export async function getHomeFeedPage({
  offset = 0,
  limit = HOME_FEED_PAGE_SIZE,
  category,
}: {
  offset?: number;
  limit?: number;
  category?: string;
} = {}): Promise<{ items: HomeFeedEntry[]; hasMore: boolean; nextOffset: number }> {
  const safeOffset = Math.max(0, offset);
  const safeLimit = Math.max(1, Math.min(limit, HOME_FEED_PAGE_SIZE));
  const normalizedCategory = category && category !== "전체" ? category : undefined;

  if (!hasSupabaseEnv()) {
    const filteredItems = normalizedCategory
      ? marketplaceItems.filter((item) => item.sellingPoints[0] === normalizedCategory)
      : interleaveItemsByGroup(marketplaceItems, (item) => item.sellingPoints[0] ?? "기타");
    const pageItems = filteredItems.slice(safeOffset, safeOffset + safeLimit + 1).map(mapFallbackItemToHomeFeedItem);
    const pagedItems = pageItems.slice(0, safeLimit);
    const ads = await getHomeNativeAds();

    return {
      items: insertNativeAdsIntoHomeFeed(pagedItems, ads, safeOffset),
      hasMore: pageItems.length > safeLimit,
      nextOffset: safeOffset + pagedItems.length,
    };
  }

  try {
    const supabase = createServerSupabaseClient();
    const fetchLimit = safeLimit + 1;
    let query = supabase
      .from("items")
      .select("id, title, category, town, posted_at, refreshed_at, price_value, chats_count, likes_count, meetup_distance_meters, sort_order")
      .neq("status", "sold")
      .order("sort_order", { ascending: true })
      .order("posted_at", { ascending: false })
      .order("created_at", { ascending: false })
      .range(safeOffset, safeOffset + fetchLimit - 1);

    if (normalizedCategory) {
      query = query.eq("category", normalizedCategory);
    }

    const { data: itemsData, error: itemsError } = await query;

    if (itemsError || !itemsData) {
      throw itemsError ?? new Error("Missing items data");
    }

    const homeFeedItems = parseRows(itemsData, "home-feed.items", parseHomeFeedItemRow);
    const pagedItems = homeFeedItems.slice(0, safeLimit);
    const itemIds = pagedItems.map((item) => item.id);

    let imageRows: ItemImageRow[] = [];
    if (itemIds.length > 0) {
      const { data: imagesData, error: imagesError } = await supabase
        .from("item_images")
        .select("item_id, image_url, sort_order")
        .in("item_id", itemIds)
        .order("sort_order", { ascending: true });

      if (imagesError) {
        throw imagesError;
      }

      imageRows = parseRows(imagesData ?? [], "home-feed.images", parseItemImageRow);
    }

    const firstImageByItemId = new Map<string, string>();
    for (const image of imageRows) {
      if (!firstImageByItemId.has(image.item_id)) {
        firstImageByItemId.set(image.item_id, image.image_url);
      }
    }

    const mappedItems = pagedItems.map((item) => mapItemRowToHomeFeedItem(item, firstImageByItemId.get(item.id)));
    const ads = await getHomeNativeAds();

    return {
      items: insertNativeAdsIntoHomeFeed(mappedItems, ads, safeOffset),
      hasMore: homeFeedItems.length > safeLimit,
      nextOffset: safeOffset + mappedItems.length,
    };
  } catch (error) {
    logSupabaseFallback("home-feed", error);
    const filteredItems = normalizedCategory
      ? marketplaceItems.filter((item) => item.sellingPoints[0] === normalizedCategory)
      : interleaveItemsByGroup(marketplaceItems, (item) => item.sellingPoints[0] ?? "기타");
    const pageItems = filteredItems.slice(safeOffset, safeOffset + safeLimit + 1).map(mapFallbackItemToHomeFeedItem);
    const pagedItems = pageItems.slice(0, safeLimit);
    const ads = await getHomeNativeAds();

    return {
      items: insertNativeAdsIntoHomeFeed(pagedItems, ads, safeOffset),
      hasMore: pageItems.length > safeLimit,
      nextOffset: safeOffset + pagedItems.length,
    };
  }
}

export const getSingleHomeItem = cache(async (): Promise<{ item: MarketplaceItem; categories: HomeCategory[] } | null> => {
  if (!hasSupabaseEnv()) {
    const fallbackItem = marketplaceItems[0];

    return fallbackItem
      ? {
          item: withFallbackItemSlug(fallbackItem, 0),
          categories: homeCategoriesFallback,
        }
      : null;
  }

  try {
    const supabase = createServerSupabaseClient();
    const { data: itemData, error: itemError } = await supabase
      .from("items")
      .select("*")
      .neq("status", "sold")
      .order("sort_order", { ascending: true })
      .order("posted_at", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (itemError || !itemData) {
      throw itemError ?? new Error("Missing item data");
    }

    const itemRow = parseItemRow(itemData, "home-single.item");

    const [{ data: imageData, error: imageError }, { data: sellerData, error: sellerError }] = await Promise.all([
      supabase
        .from("item_images")
        .select("item_id, image_url, sort_order")
        .eq("item_id", itemRow.id)
        .order("sort_order", { ascending: true })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("users")
        .select("id, response_rate, repeat_deals")
        .eq("id", itemRow.seller_id)
        .maybeSingle(),
    ]);

    if (imageError) {
      throw imageError;
    }

    if (sellerError) {
      throw sellerError;
    }

    return {
      item: mapItemRowToMarketplaceItem(
        itemRow,
        imageData ? parseItemImageRow(imageData, "home-single.image").image_url : undefined,
        sellerData ? parseSellerMetricsRow(sellerData, "home-single.seller") : undefined,
      ),
      categories: buildHomeCategories([itemRow]),
    };
  } catch (error) {
    logSupabaseFallback("home-single", error);
    const fallbackItem = marketplaceItems[0];

    return fallbackItem
      ? {
          item: withFallbackItemSlug(fallbackItem, 0),
          categories: homeCategoriesFallback,
        }
      : null;
  }
});

export const getMarketplaceItemDetail = cache(
  async (itemSlug: string): Promise<{ item: MarketplaceItem; seller: SellerProfile } | null> => {
    if (!hasSupabaseEnv()) {
      const item = getFallbackItemBySlug(itemSlug) ?? getFallbackItemById(itemSlug);
      const seller = item ? getSellerById(item.sellerId) : undefined;

      return item && seller ? { item, seller } : null;
    }

    try {
      const sortOrder = parseItemSlug(itemSlug);
      const supabase = createServerSupabaseClient();
      const itemQuery = sortOrder
        ? supabase.from("items").select("*").eq("sort_order", sortOrder)
        : supabase.from("items").select("*").eq("id", itemSlug);
      const { data: itemData, error: itemError } = await itemQuery.maybeSingle();

      if (itemError || !itemData) {
        if (itemError) {
          throw itemError;
        }

        return null;
      }

      const itemRow = parseItemRow(itemData, "item-detail.item");
      const { data: imageData, error: imageError } = await supabase
        .from("item_images")
        .select("item_id, image_url, sort_order")
        .eq("item_id", itemRow.id)
        .order("sort_order", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (imageError) {
        throw imageError;
      }

      const { data: sellerData, error: sellerError } = await supabase
        .from("users")
        .select("*")
        .eq("id", itemRow.seller_id)
        .maybeSingle();

      if (sellerError || !sellerData) {
        throw sellerError ?? new Error(`Missing seller for item ${itemSlug}`);
      }

      const seller = mapSeller(parseSellerRow(sellerData, "item-detail.seller"));
      const item = mapItemRowToMarketplaceItem(
        itemRow,
        imageData ? parseItemImageRow(imageData, "item-detail.image").image_url : undefined,
        {
          id: seller.id,
          response_rate: seller.responseRate,
          repeat_deals: seller.repeatDeals,
        },
      );

      return {
        item,
        seller,
      };
    } catch (error) {
      logSupabaseFallback("item-detail", error);
      const item = getFallbackItemBySlug(itemSlug) ?? getFallbackItemById(itemSlug);
      const seller = item ? getSellerById(item.sellerId) : undefined;

      return item && seller ? { item, seller } : null;
    }
  },
);

export const getMarketplaceItemDetailById = cache(
  async (itemId: string): Promise<{ item: MarketplaceItem; seller: SellerProfile } | null> => {
    if (!hasSupabaseEnv()) {
      const item = getFallbackItemById(itemId);
      const seller = item ? getSellerById(item.sellerId) : undefined;

      return item && seller ? { item, seller } : null;
    }

    try {
      const supabase = createServerSupabaseClient();
      const { data: itemData, error: itemError } = await supabase
        .from("items")
        .select("*")
        .eq("id", itemId)
        .maybeSingle();

      if (itemError || !itemData) {
        if (itemError) {
          throw itemError;
        }

        return null;
      }

      const itemRow = parseItemRow(itemData, "item-detail-by-id.item");
      const { data: imageData, error: imageError } = await supabase
        .from("item_images")
        .select("item_id, image_url, sort_order")
        .eq("item_id", itemRow.id)
        .order("sort_order", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (imageError) {
        throw imageError;
      }

      const { data: sellerData, error: sellerError } = await supabase
        .from("users")
        .select("*")
        .eq("id", itemRow.seller_id)
        .maybeSingle();

      if (sellerError || !sellerData) {
        throw sellerError ?? new Error(`Missing seller for item ${itemId}`);
      }

      const seller = mapSeller(parseSellerRow(sellerData, "item-detail-by-id.seller"));
      const item = mapItemRowToMarketplaceItem(
        itemRow,
        imageData ? parseItemImageRow(imageData, "item-detail-by-id.image").image_url : undefined,
        {
          id: seller.id,
          response_rate: seller.responseRate,
          repeat_deals: seller.repeatDeals,
        },
      );

      return {
        item,
        seller,
      };
    } catch (error) {
      logSupabaseFallback("item-detail-by-id", error);
      const item = getFallbackItemById(itemId);
      const seller = item ? getSellerById(item.sellerId) : undefined;

      return item && seller ? { item, seller } : null;
    }
  },
);
