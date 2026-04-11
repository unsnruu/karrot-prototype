import "server-only";

import { cache } from "react";
import {
  communityPosts,
  getFallbackCommunityPostDetail,
  getFallbackCommunityRecommendations,
  type CommunityPost,
  type CommunityPostDetail,
} from "@/lib/community";
import {
  HOME_FEED_PAGE_SIZE,
  formatItemSlug,
  getChatByItemId,
  getItemById,
  getSellerById,
  homeCategoriesFallback,
  marketplaceItems,
  parseItemSlug,
  type HomeCategory,
  type HomeFeedItem,
  type ChatPreview,
  type MarketplaceItem,
  type SellerProfile,
} from "@/lib/marketplace";
import { createServerSupabaseClient, hasSupabaseEnv } from "@/lib/supabase/server";

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

type ChatThreadRow = {
  id: string;
  item_id: string;
  buyer_name: string;
  last_seen_label: string;
};

type ChatMessageRow = {
  id: string;
  thread_id: string;
  sender_role: "buyer" | "seller";
  body: string;
  sent_at_label: string;
};

type HomeFeedItemRow = Pick<
  ItemRow,
  "id" | "title" | "category" | "town" | "posted_at" | "refreshed_at" | "price_value" | "chats_count" | "likes_count"
  | "meetup_distance_meters" | "sort_order"
>;

type HomeCategoryRow = Pick<ItemRow, "category" | "sort_order">;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(row: Record<string, unknown>, key: string, scope: string) {
  const value = row[key];

  if (typeof value !== "string") {
    throw new Error(`[${scope}] Expected "${key}" to be a string`);
  }

  return value;
}

function readNullableString(row: Record<string, unknown>, key: string, scope: string) {
  const value = row[key];

  if (value == null) {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error(`[${scope}] Expected "${key}" to be a string or null`);
  }

  return value;
}

function readNumber(row: Record<string, unknown>, key: string, scope: string) {
  const value = row[key];

  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`[${scope}] Expected "${key}" to be a number`);
  }

  return value;
}

function readNullableNumber(row: Record<string, unknown>, key: string, scope: string) {
  const value = row[key];

  if (value == null) {
    return null;
  }

  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`[${scope}] Expected "${key}" to be a number or null`);
  }

  return value;
}

function readNullableFloat(row: Record<string, unknown>, key: string, scope: string) {
  const value = row[key];

  if (value == null) {
    return null;
  }

  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);

    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  throw new Error(`[${scope}] Expected "${key}" to be a numeric value or null`);
}

function readBoolean(row: Record<string, unknown>, key: string, scope: string) {
  const value = row[key];

  if (typeof value !== "boolean") {
    throw new Error(`[${scope}] Expected "${key}" to be a boolean`);
  }

  return value;
}

function readStringArrayOrNull(row: Record<string, unknown>, key: string, scope: string) {
  const value = row[key];

  if (value == null) {
    return null;
  }

  if (!Array.isArray(value) || value.some((entry) => typeof entry !== "string")) {
    throw new Error(`[${scope}] Expected "${key}" to be a string array or null`);
  }

  return value;
}

function readStatus(row: Record<string, unknown>, key: string, scope: string): ItemRow["status"] {
  const value = row[key];

  if (value === "active" || value === "reserved" || value === "sold") {
    return value;
  }

  throw new Error(`[${scope}] Expected "${key}" to be a valid item status`);
}

function readSenderRole(row: Record<string, unknown>, key: string, scope: string): ChatMessageRow["sender_role"] {
  const value = row[key];

  if (value === "buyer" || value === "seller") {
    return value;
  }

  throw new Error(`[${scope}] Expected "${key}" to be a valid sender role`);
}

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

function parseChatThreadRow(value: unknown, scope: string): ChatThreadRow {
  if (!isRecord(value)) {
    throw new Error(`[${scope}] Expected chat thread row object`);
  }

  return {
    id: readString(value, "id", scope),
    item_id: readString(value, "item_id", scope),
    buyer_name: readString(value, "buyer_name", scope),
    last_seen_label: readString(value, "last_seen_label", scope),
  };
}

function parseChatMessageRow(value: unknown, scope: string): ChatMessageRow {
  if (!isRecord(value)) {
    throw new Error(`[${scope}] Expected chat message row object`);
  }

  return {
    id: readString(value, "id", scope),
    thread_id: readString(value, "thread_id", scope),
    sender_role: readSenderRole(value, "sender_role", scope),
    body: readString(value, "body", scope),
    sent_at_label: readString(value, "sent_at_label", scope),
  };
}

function parseRows<T>(values: unknown[], scope: string, parser: (value: unknown, rowScope: string) => T) {
  return values.map((value, index) => parser(value, `${scope}[${index}]`));
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

function mapChatPreview(thread: ChatThreadRow, messages: ChatMessageRow[]): ChatPreview {
  return {
    id: thread.id,
    itemId: thread.item_id,
    buyerName: thread.buyer_name,
    lastSeen: thread.last_seen_label,
    messages: messages.map((message) => ({
      id: message.id,
      from: message.sender_role,
      text: message.body,
      time: message.sent_at_label,
    })),
  };
}

function logSupabaseFallback(scope: string, error: unknown) {
  console.warn(`[supabase-fallback:${scope}]`, error);
}

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

function getFallbackItemById(itemId: string) {
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

export async function getHomeFeedPage({
  offset = 0,
  limit = HOME_FEED_PAGE_SIZE,
  category,
}: {
  offset?: number;
  limit?: number;
  category?: string;
} = {}): Promise<{ items: HomeFeedItem[]; hasMore: boolean }> {
  const safeOffset = Math.max(0, offset);
  const safeLimit = Math.max(1, Math.min(limit, HOME_FEED_PAGE_SIZE));
  const normalizedCategory = category && category !== "전체" ? category : undefined;

  if (!hasSupabaseEnv()) {
    const filteredItems = normalizedCategory
      ? marketplaceItems.filter((item) => item.sellingPoints[0] === normalizedCategory)
      : interleaveItemsByGroup(marketplaceItems, (item) => item.sellingPoints[0] ?? "기타");
    const pageItems = filteredItems.slice(safeOffset, safeOffset + safeLimit + 1).map(mapFallbackItemToHomeFeedItem);

    return {
      items: pageItems.slice(0, safeLimit),
      hasMore: pageItems.length > safeLimit,
    };
  }

  try {
    const supabase = createServerSupabaseClient();
    let query = supabase
      .from("items")
      .select("id, title, category, town, posted_at, refreshed_at, price_value, chats_count, likes_count, meetup_distance_meters, sort_order")
      .neq("status", "sold")
      .order("sort_order", { ascending: true })
      .order("posted_at", { ascending: false })
      .order("created_at", { ascending: false });

    if (normalizedCategory) {
      query = query.eq("category", normalizedCategory).range(safeOffset, safeOffset + safeLimit);
    }

    const { data: itemsData, error: itemsError } = await query;

    if (itemsError || !itemsData) {
      throw itemsError ?? new Error("Missing items data");
    }

    const homeFeedItems = parseRows(itemsData, "home-feed.items", parseHomeFeedItemRow);
    const orderedItems = normalizedCategory ? homeFeedItems : interleaveItemsByGroup(homeFeedItems, (item) => item.category);
    const pagedItems = orderedItems.slice(safeOffset, safeOffset + safeLimit);
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

    return {
      items: pagedItems.map((item) => mapItemRowToHomeFeedItem(item, firstImageByItemId.get(item.id))),
      hasMore: orderedItems.length > safeOffset + safeLimit,
    };
  } catch (error) {
    logSupabaseFallback("home-feed", error);
    const filteredItems = normalizedCategory
      ? marketplaceItems.filter((item) => item.sellingPoints[0] === normalizedCategory)
      : interleaveItemsByGroup(marketplaceItems, (item) => item.sellingPoints[0] ?? "기타");
    const pageItems = filteredItems.slice(safeOffset, safeOffset + safeLimit + 1).map(mapFallbackItemToHomeFeedItem);

    return {
      items: pageItems.slice(0, safeLimit),
      hasMore: pageItems.length > safeLimit,
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

const getMarketplaceItemDetailById = cache(
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

export const getChatScreenData = cache(
  async (itemId: string): Promise<{ item: MarketplaceItem; seller: SellerProfile; chat: ChatPreview } | null> => {
    if (!hasSupabaseEnv()) {
      const item = getItemById(itemId);
      const seller = item ? getSellerById(item.sellerId) : undefined;

      if (!item || !seller) {
        return null;
      }

      return {
        item,
        seller,
        chat: getChatByItemId(itemId),
      };
    }

    try {
      const supabase = createServerSupabaseClient();
      const detail = await getMarketplaceItemDetailById(itemId);

      if (!detail) {
        return null;
      }

      const { data: threadData, error: threadError } = await supabase
        .from("chat_threads")
        .select("*")
        .eq("item_id", itemId)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (threadError || !threadData) {
        throw threadError ?? new Error(`Missing chat thread for item ${itemId}`);
      }

      const thread = parseChatThreadRow(threadData, "chat.thread");

      const { data: messageData, error: messageError } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("thread_id", thread.id)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (messageError || !messageData) {
        throw messageError ?? new Error(`Missing chat messages for item ${itemId}`);
      }

      return {
        ...detail,
        chat: mapChatPreview(thread, parseRows(messageData, "chat.messages", parseChatMessageRow)),
      };
    } catch (error) {
      logSupabaseFallback("chat", error);
      const item = getItemById(itemId);
      const seller = item ? getSellerById(item.sellerId) : undefined;

      if (!item || !seller) {
        return null;
      }

      return {
        item,
        seller,
        chat: getChatByItemId(itemId),
      };
    }
  },
);
