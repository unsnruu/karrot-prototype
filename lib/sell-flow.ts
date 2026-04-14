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

export const SELL_FLOW_MAX_PHOTOS = 10;

export const SELL_FLOW_DEFAULT_LOCATION: SellLocation = {
  label: "합정역 8번 출구",
  address: "서울 마포구 양화로 55 합정역 인근",
  lat: 37.54957,
  lng: 126.91383,
  distanceLabel: "120m",
};

export const SELL_FLOW_SAMPLE_PHOTOS = [
  "/images/figma-migrated/df87f611-f817-4b48-9b0a-4fdade26ba01.png",
  "/images/figma-migrated/50bddbb3-e095-4d27-9e98-33e09871d5d2.png",
  "/images/figma-migrated/a28496ca-d52f-4547-b551-b1ebe3460458.png",
  "/images/figma-migrated/8937d748-074e-4574-a051-2dcc1ed0e0f2.png",
  "/images/figma-migrated/71af11dd-3bed-4da8-8f38-129045fe18c9.png",
  "/images/figma-migrated/95090c18-19ef-45f5-8848-11bd9938d9c1.png",
  "/images/figma-migrated/a56f8fe4-4116-4f18-9310-f37c2d97fbac.png",
  "/images/figma-migrated/4772163f-171c-4ee6-a1ab-63ed1855d1e5.png",
];

export const emptySellFlowDraft = (): SellFlowDraft => ({
  photos: [],
  title: "",
  description: "",
  tradeType: null,
  priceText: "",
  acceptPriceSuggestion: false,
  location: null,
});

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
