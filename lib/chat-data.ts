import "server-only";

import { cache } from "react";
import { getChatByItemId, getItemById, getSellerById, type ChatPreview } from "@/lib/marketplace";
import { createServerSupabaseClient, hasSupabaseEnv } from "@/lib/supabase/server";
import {
  isRecord,
  logSupabaseFallback,
  parseRows,
  readSenderRole,
  readString,
} from "@/lib/supabase/row-helpers";
import { getMarketplaceItemDetailById } from "@/lib/marketplace-data";
import type { MarketplaceItem, SellerProfile } from "@/lib/marketplace";

// ─── Row types ────────────────────────────────────────────────────────────────

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

// ─── Domain mappers ───────────────────────────────────────────────────────────

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

// ─── Public exports ───────────────────────────────────────────────────────────

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
