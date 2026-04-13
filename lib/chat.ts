import { chatPreviews, getItemById, getSellerById } from "@/lib/marketplace";
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

const chatThreadAvatarMap: Record<string, string> = {
  "chat-macbook": "https://www.figma.com/api/mcp/asset/1df94a1c-00aa-4f44-84d0-a28f6a6b8545",
  "chat-lush-dirty": "https://www.figma.com/api/mcp/asset/67c7c837-e85b-4c90-8fa3-ead0032eda5c",
  "00000000-0000-0000-0000-000000004001": "https://www.figma.com/api/mcp/asset/1df94a1c-00aa-4f44-84d0-a28f6a6b8545",
  "00000000-0000-0000-0000-000000004002": "https://www.figma.com/api/mcp/asset/67c7c837-e85b-4c90-8fa3-ead0032eda5c",
};

export function getThreadAvatarImage(threadId: string, fallback?: string) {
  return chatThreadAvatarMap[threadId] ?? fallback;
}

export function getFallbackChatThreadPreviews(): ChatThreadPreview[] {
  return chatPreviews.flatMap((chat) => {
    const item = getItemById(chat.itemId);

    if (!item) {
      return [];
    }

    const seller = getSellerById(item.sellerId);
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
        avatarImage: getThreadAvatarImage(chat.id, seller?.avatar),
        href: appendTabQuery(`/chat/${chat.itemId}`, "chat"),
      },
    ];
  });
}

export const chatThreadPreviews: ChatThreadPreview[] = getFallbackChatThreadPreviews();
