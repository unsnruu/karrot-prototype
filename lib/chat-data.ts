import "server-only";

import { cache } from "react";
import { getFallbackChatThreadPreviews, type ChatThreadPreview } from "@/lib/chat";
import {
  buildGenericChatPreview,
  formatItemSlug,
  getChatByItemId,
  getItemById,
  getSellerById,
  type ChatPreview,
} from "@/lib/marketplace";
import { createServerSupabaseClient, hasSupabaseEnv } from "@/lib/supabase/server";
import { appendTabQuery } from "@/lib/tab-navigation";
import {
  isRecord,
  logSupabaseFallback,
  parseRows,
  readNumber,
  readNullableString,
  readString,
} from "@/lib/supabase/row-helpers";
import { getMarketplaceItemDetail } from "@/lib/marketplace-data";
import type { MarketplaceItem, SellerProfile } from "@/lib/marketplace";

// ─── Row types ────────────────────────────────────────────────────────────────

type ChatThreadRow = {
  id: string;
  item_id: string;
  buyer_name: string;
  last_seen_label: string;
  response_label: string;
  updated_at_label: string;
  last_message_preview: string;
};

type ChatMessageRow = {
  id: string;
  thread_id: string;
  message_type: "buyer" | "seller" | "system-date" | "system-notice";
  body: string;
  sent_at_label: string | null;
};

type ChatLandingItemRow = {
  id: string;
  seller_id: string;
  town: string;
  sort_order: number;
};

type ChatLandingImageRow = {
  item_id: string;
  image_url: string;
  sort_order: number;
};

type ChatLandingSellerRow = {
  id: string;
  name: string;
};

// ─── Row parsers ──────────────────────────────────────────────────────────────

function parseChatThreadRow(value: unknown, scope: string): ChatThreadRow {
  if (!isRecord(value)) {
    throw new Error(`[${scope}] Expected chat thread row object`);
  }

  return {
    id: readString(value, "id", scope),
    item_id: readString(value, "item_id", scope),
    buyer_name: readString(value, "buyer_name", scope),
    last_seen_label: readString(value, "last_seen_label", scope),
    response_label: readString(value, "response_label", scope),
    updated_at_label: readString(value, "updated_at_label", scope),
    last_message_preview: readString(value, "last_message_preview", scope),
  };
}

function parseChatMessageType(
  value: Record<string, unknown>,
  key: string,
  scope: string,
): "buyer" | "seller" | "system-date" | "system-notice" {
  const messageType = value[key];

  if (
    messageType === "buyer"
    || messageType === "seller"
    || messageType === "system-date"
    || messageType === "system-notice"
  ) {
    return messageType;
  }

  throw new Error(`[${scope}] Expected "${key}" to be a valid chat message type`);
}

function parseChatMessageRow(value: unknown, scope: string): ChatMessageRow {
  if (!isRecord(value)) {
    throw new Error(`[${scope}] Expected chat message row object`);
  }

  return {
    id: readString(value, "id", scope),
    thread_id: readString(value, "thread_id", scope),
    message_type: parseChatMessageType(value, "message_type", scope),
    body: readString(value, "body", scope),
    sent_at_label: readNullableString(value, "sent_at_label", scope),
  };
}

function parseChatLandingItemRow(value: unknown, scope: string): ChatLandingItemRow {
  if (!isRecord(value)) {
    throw new Error(`[${scope}] Expected chat landing item row object`);
  }

  return {
    id: readString(value, "id", scope),
    seller_id: readString(value, "seller_id", scope),
    town: readString(value, "town", scope),
    sort_order: readNumber(value, "sort_order", scope),
  };
}

function parseChatLandingImageRow(value: unknown, scope: string): ChatLandingImageRow {
  if (!isRecord(value)) {
    throw new Error(`[${scope}] Expected chat landing image row object`);
  }

  return {
    item_id: readString(value, "item_id", scope),
    image_url: readString(value, "image_url", scope),
    sort_order: readNumber(value, "sort_order", scope),
  };
}

function parseChatLandingSellerRow(value: unknown, scope: string): ChatLandingSellerRow {
  if (!isRecord(value)) {
    throw new Error(`[${scope}] Expected chat landing seller row object`);
  }

  return {
    id: readString(value, "id", scope),
    name: readString(value, "name", scope),
  };
}

// ─── Domain mappers ───────────────────────────────────────────────────────────

function mapChatPreview(thread: ChatThreadRow, messages: ChatMessageRow[]): ChatPreview {
  return {
    id: thread.id,
    itemId: thread.item_id,
    buyerName: thread.buyer_name,
    lastSeen: thread.last_seen_label,
    responseLabel: thread.response_label,
    updatedAtLabel: thread.updated_at_label,
    lastMessagePreview: thread.last_message_preview,
    messages: messages.map((message) =>
      message.message_type === "buyer" || message.message_type === "seller"
        ? {
            id: message.id,
            type: message.message_type,
            text: message.body,
            time: message.sent_at_label ?? "",
          }
        : {
            id: message.id,
            type: message.message_type,
            text: message.body,
          },
    ),
  };
}

function mapThreadPreview(
  thread: ChatThreadRow,
  item: ChatLandingItemRow | undefined,
  seller: ChatLandingSellerRow | undefined,
  avatarImage: string | undefined,
): ChatThreadPreview | null {
  if (!item || !seller) {
    return null;
  }

  return {
    id: thread.id,
    name: seller.name,
    town: item.town,
    updatedAt: thread.updated_at_label,
    lastMessage: thread.last_message_preview,
    avatarImage: avatarImage ?? "",
    href: appendTabQuery(`/chat/${formatItemSlug(item.sort_order)}`, "chat"),
  };
}

// ─── Public exports ───────────────────────────────────────────────────────────

export const getChatLandingData = cache(async (): Promise<ChatThreadPreview[]> => {
  if (!hasSupabaseEnv()) {
    return getFallbackChatThreadPreviews();
  }

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("chat_threads")
      .select("*")
      .order("updated_at", { ascending: false })
      .order("created_at", { ascending: false });

    if (error || !data) {
      throw error ?? new Error("Missing chat threads");
    }

    const threads = parseRows(data, "chat-landing.threads", parseChatThreadRow);
    const itemIds = Array.from(new Set(threads.map((thread) => thread.item_id)));

    let items: ChatLandingItemRow[] = [];
    let sellers: ChatLandingSellerRow[] = [];
    let images: ChatLandingImageRow[] = [];

    if (itemIds.length > 0) {
      const { data: itemsData, error: itemsError } = await supabase
        .from("items")
        .select("id, seller_id, town, sort_order")
        .in("id", itemIds);

      if (itemsError || !itemsData) {
        throw itemsError ?? new Error("Missing chat landing items");
      }

      items = parseRows(itemsData, "chat-landing.items", parseChatLandingItemRow);

      const sellerIds = Array.from(new Set(items.map((item) => item.seller_id)));
      const [{ data: imagesData, error: imagesError }, { data: sellersData, error: sellersError }] = await Promise.all([
        supabase
          .from("item_images")
          .select("item_id, image_url, sort_order")
          .in("item_id", itemIds)
          .order("sort_order", { ascending: true }),
        sellerIds.length > 0
          ? supabase.from("users").select("id, name").in("id", sellerIds)
          : Promise.resolve({ data: [], error: null }),
      ]);

      if (imagesError) {
        throw imagesError;
      }

      if (sellersError) {
        throw sellersError;
      }

      images = parseRows(imagesData ?? [], "chat-landing.images", parseChatLandingImageRow);
      sellers = parseRows(sellersData ?? [], "chat-landing.sellers", parseChatLandingSellerRow);
    }

    const itemById = new Map(items.map((item) => [item.id, item]));
    const sellerById = new Map(sellers.map((seller) => [seller.id, seller]));
    const firstImageByItemId = new Map<string, string>();
    for (const image of images) {
      if (!firstImageByItemId.has(image.item_id)) {
        firstImageByItemId.set(image.item_id, image.image_url);
      }
    }

    const previews = threads.map((thread) => {
      const item = itemById.get(thread.item_id);
      const seller = item ? sellerById.get(item.seller_id) : undefined;

      return mapThreadPreview(thread, item, seller, firstImageByItemId.get(thread.item_id));
    });

    return previews.filter((preview): preview is ChatThreadPreview => preview != null);
  } catch (error) {
    logSupabaseFallback("chat-landing", error);
    return getFallbackChatThreadPreviews();
  }
});

export const getChatScreenData = cache(
  async (itemKey: string): Promise<{ item: MarketplaceItem; seller: SellerProfile; chat: ChatPreview } | null> => {
    if (!hasSupabaseEnv()) {
      const detail = await getMarketplaceItemDetail(itemKey);

      if (!detail) {
        return null;
      }

      return {
        ...detail,
        chat: getChatByItemId(detail.item.id),
      };
    }

    try {
      const supabase = createServerSupabaseClient();
      const detail = await getMarketplaceItemDetail(itemKey);

      if (!detail) {
        return null;
      }

      const resolvedItemId = detail.item.id;

      const { data: threadData, error: threadError } = await supabase
        .from("chat_threads")
        .select("*")
        .eq("item_id", resolvedItemId)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (threadError) {
        throw threadError;
      }

      if (!threadData) {
        return {
          ...detail,
          chat: buildGenericChatPreview(detail.item.id, detail.seller.name, detail.item.title),
        };
      }

      const thread = parseChatThreadRow(threadData, "chat.thread");

      const { data: messageData, error: messageError } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("thread_id", thread.id)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (messageError || !messageData) {
        throw messageError ?? new Error(`Missing chat messages for item ${resolvedItemId}`);
      }

      return {
        ...detail,
        chat: mapChatPreview(thread, parseRows(messageData, "chat.messages", parseChatMessageRow)),
      };
    } catch (error) {
      logSupabaseFallback("chat", error);

      const detail = await getMarketplaceItemDetail(itemKey);

      if (detail) {
        return {
          ...detail,
          chat: buildGenericChatPreview(detail.item.id, detail.seller.name, detail.item.title),
        };
      }

      const item = getItemById(itemKey);
      const seller = item ? getSellerById(item.sellerId) : undefined;

      if (!item || !seller) {
        return null;
      }

      return {
        item,
        seller,
        chat: getChatByItemId(item.id),
      };
    }
  },
);
