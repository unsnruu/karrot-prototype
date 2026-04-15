"use client";

import { type HomeFeedItem, type MarketplaceItem } from "@/lib/marketplace";

const PUBLISHED_SELL_ITEM_STORAGE_KEY = "karrot.prototype.published-sell-item.v1";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function savePublishedSellItem(item: MarketplaceItem) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(PUBLISHED_SELL_ITEM_STORAGE_KEY, JSON.stringify(item));
}

export function readPublishedSellItem(): MarketplaceItem | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(PUBLISHED_SELL_ITEM_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!isRecord(parsed)) {
      return null;
    }

    return {
      id: typeof parsed.id === "string" ? parsed.id : "prototype-sell-preview",
      slug: typeof parsed.slug === "string" ? parsed.slug : "sell-preview",
      title: typeof parsed.title === "string" ? parsed.title : "새 판매글",
      subtitle: typeof parsed.subtitle === "string" ? parsed.subtitle : undefined,
      description: typeof parsed.description === "string" ? parsed.description : "",
      image: typeof parsed.image === "string" ? parsed.image : "",
      town: typeof parsed.town === "string" ? parsed.town : "",
      distance: typeof parsed.distance === "string" ? parsed.distance : "",
      postedAt: typeof parsed.postedAt === "string" ? parsed.postedAt : "방금",
      priceLabel: typeof parsed.priceLabel === "string" ? parsed.priceLabel : undefined,
      priceValue: typeof parsed.priceValue === "number" ? parsed.priceValue : undefined,
      chats: typeof parsed.chats === "number" ? parsed.chats : 0,
      likes: typeof parsed.likes === "number" ? parsed.likes : 0,
      sellerId: typeof parsed.sellerId === "string" ? parsed.sellerId : "",
      trustLabel: typeof parsed.trustLabel === "string" ? parsed.trustLabel : "",
      trustNote: typeof parsed.trustNote === "string" ? parsed.trustNote : "",
      sellingPoints: Array.isArray(parsed.sellingPoints) ? parsed.sellingPoints.filter((v): v is string => typeof v === "string") : [],
      condition: typeof parsed.condition === "string" ? parsed.condition : "",
      meetupHint: typeof parsed.meetupHint === "string" ? parsed.meetupHint : "",
      meetupAddress: typeof parsed.meetupAddress === "string" ? parsed.meetupAddress : undefined,
      meetupLat: typeof parsed.meetupLat === "number" ? parsed.meetupLat : undefined,
      meetupLng: typeof parsed.meetupLng === "number" ? parsed.meetupLng : undefined,
      promoted: parsed.promoted === true,
    };
  } catch {
    return null;
  }
}

export function buildPublishedSellFeedItem(item: MarketplaceItem): HomeFeedItem {
  return {
    type: "marketplace-item",
    id: item.id,
    slug: item.slug ?? item.id,
    title: item.title,
    image: item.image,
    town: item.town,
    distance: item.distance,
    postedAt: "방금",
    priceLabel: item.priceLabel,
    chats: 0,
    likes: item.likes,
    href: "/home/sell/preview",
  };
}
