import { chatPreviews, getItemById } from "@/lib/marketplace";
import { appendTabQuery } from "@/lib/tab-navigation";

export type ChatCategory = {
  label: string;
  active?: boolean;
  hasChevron?: boolean;
  icon?: "filter";
};

export type ChatThreadPreview = {
  id: string;
  name: string;
  town: string;
  updatedAt: string;
  lastMessage: string;
  avatarImage?: string;
  href?: string;
};

export const chatCategories: ChatCategory[] = [
  { label: "필터", icon: "filter" },
  { label: "전체", active: true },
  { label: "판매" },
  { label: "구매" },
  { label: "안읽음" },
  { label: "모임" },
];

export function getFallbackChatThreadPreviews(): ChatThreadPreview[] {
  return chatPreviews.flatMap((chat) => {
    const item = getItemById(chat.itemId);

    if (!item) {
      return [];
    }

    const lastMessage =
      chat.lastMessagePreview ??
      [...chat.messages].reverse().find((message) => message.type === "buyer" || message.type === "seller")?.text ??
      "";

    return [
      {
        id: chat.id,
        name: chat.buyerName,
        town: item.town,
        updatedAt: chat.updatedAtLabel ?? "방금",
        lastMessage,
        avatarImage: item.image,
        href: appendTabQuery(`/chat/${item.slug ?? chat.itemId}`, "chat"),
      },
    ];
  });
}

export const chatThreadPreviews: ChatThreadPreview[] = getFallbackChatThreadPreviews();
