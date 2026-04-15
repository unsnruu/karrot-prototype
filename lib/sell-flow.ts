import { prototypeViewerUser } from "@/lib/prototype-user";
import {
  formatItemSlug,
  marketplaceItems,
  type HomeFeedItem,
  type MarketplaceItem,
  type SellerProfile,
} from "@/lib/marketplace";

export type SellTradeType = "sell" | "share";

export type SellLocation = {
  label: string;
  address: string;
  lat: number;
  lng: number;
  distanceLabel: string;
};

export type SellFlowDraft = {
  photos: string[];
  title: string;
  description: string;
  tradeType: SellTradeType | null;
  priceText: string;
  acceptPriceSuggestion: boolean;
  location: SellLocation | null;
};

export const SELL_FLOW_STORAGE_KEY = "karrot.prototype.sell-flow.v1";

export const SELL_FLOW_MAX_PHOTOS = 4;

export const SELL_FLOW_DEFAULT_LOCATION: SellLocation = {
  label: "합정역 2번 출구",
  address: "서울 마포구 양화로 55 합정역 2번 출구 인근",
  lat: 37.54957,
  lng: 126.91383,
  distanceLabel: "120m",
};

export const SELL_FLOW_SAMPLE_PHOTOS = [
  "https://udazzhluazlmcsbdbhzo.supabase.co/storage/v1/object/public/items/perfume-selection/image-01.jpg",
  "https://udazzhluazlmcsbdbhzo.supabase.co/storage/v1/object/public/items/perfume-selection/image-02.jpg",
  "https://udazzhluazlmcsbdbhzo.supabase.co/storage/v1/object/public/items/perfume-selection/image-03.jpg",
  "https://udazzhluazlmcsbdbhzo.supabase.co/storage/v1/object/public/items/perfume-selection/image-04.jpg",
  "https://udazzhluazlmcsbdbhzo.supabase.co/storage/v1/object/public/items/perfume-selection/image-05.jpg",
  "https://udazzhluazlmcsbdbhzo.supabase.co/storage/v1/object/public/items/perfume-selection/image-06.jpg",
  "https://udazzhluazlmcsbdbhzo.supabase.co/storage/v1/object/public/items/perfume-selection/image-07.jpg",
  "https://udazzhluazlmcsbdbhzo.supabase.co/storage/v1/object/public/items/perfume-selection/image-08.jpg",
  "https://udazzhluazlmcsbdbhzo.supabase.co/storage/v1/object/public/items/perfume-selection/image-09.jpg",
];

export const emptySellFlowDraft = (): SellFlowDraft => ({
  photos: [],
  title: "",
  description: "",
  tradeType: "sell",
  priceText: "",
  acceptPriceSuggestion: false,
  location: null,
});

export function clearSellFlowDraftStorage() {
  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem(SELL_FLOW_STORAGE_KEY);
  }
}

export function normalizeSellPriceInput(value: string) {
  const digitsOnly = value.replace(/\D/g, "");

  if (!digitsOnly) {
    return "";
  }

  const normalized = String(Number(digitsOnly));
  return normalized === "0" ? "0" : normalized;
}

export function formatSellPriceText(priceText: string) {
  if (!priceText) {
    return "";
  }

  return Number(priceText).toLocaleString("ko-KR");
}

export function isSellFlowReady(draft: SellFlowDraft) {
  return Boolean(
    draft.title.trim()
      && draft.description.trim()
      && draft.tradeType
      && draft.priceText,
  );
}

export function buildSellPreviewSeller(): SellerProfile {
  return {
    id: prototypeViewerUser.id,
    name: prototypeViewerUser.name,
    avatar: prototypeViewerUser.avatarUrl,
    town: prototypeViewerUser.town,
    responseRate: 98,
    mannerScore: prototypeViewerUser.mannerScore,
    repeatDeals: 14,
    badges: ["응답이 빨라요", "동네인증"],
  };
}

export function buildSellPreviewItem(draft: SellFlowDraft): MarketplaceItem {
  const location = draft.location;
  const normalizedTitle = draft.title.trim() || "새 판매글";
  const normalizedDescription = draft.description.trim();
  const normalizedPrice = normalizeSellPriceInput(draft.priceText);
  const priceValue = normalizedPrice ? Number(normalizedPrice) : 0;

  return {
    id: "prototype-sell-preview",
    slug: "sell-preview",
    title: normalizedTitle,
    subtitle: draft.tradeType === "share" ? "나눔" : undefined,
    description: normalizedDescription,
    image: draft.photos[0] ?? SELL_FLOW_SAMPLE_PHOTOS[0],
    town: prototypeViewerUser.town,
    distance: location?.distanceLabel ?? "거리 정보 없음",
    postedAt: "방금",
    priceLabel: draft.tradeType === "share" ? "나눔" : `${priceValue.toLocaleString("ko-KR")}원`,
    priceValue,
    chats: 0,
    likes: 0,
    sellerId: prototypeViewerUser.id,
    trustLabel: "방금 등록된 새 판매글",
    trustNote: "작성한 내용을 바탕으로 미리보기된 게시글입니다.",
    sellingPoints: [draft.tradeType === "share" ? "나눔" : "판매"],
    condition: draft.tradeType === "share" ? "나눔" : "판매",
    meetupHint: location?.label ?? "거래 희망 장소를 아직 정하지 않았어요",
    meetupAddress: location?.address,
    meetupLat: location?.lat,
    meetupLng: location?.lng,
  };
}

export function buildSellPreviewRecommendations(): HomeFeedItem[] {
  return marketplaceItems.slice(0, 6).map((item, index) => ({
    type: "marketplace-item",
    id: item.id,
    slug: item.slug ?? formatItemSlug(index + 1),
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
  }));
}
