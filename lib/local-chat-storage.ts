import type { ChatThreadPreview } from "@/lib/chat";
import { appendTabQuery } from "@/lib/tab-navigation";

const LOCAL_CHAT_THREADS_KEY = "karrot.prototype.local-chat-threads.v1";
const DEFAULT_CHAT_PREVIEW_MESSAGE = "네, 편하실 때 채팅 주세요. 오늘 저녁 직거래도 괜찮아요.";

export type LocalChatThreadRecord = {
  id: string;
  chatKey: string;
  itemId: string;
  sellerName: string;
  town: string;
  avatarImage?: string;
  href: string;
  createdAt: string;
  updatedAt: string;
  lastMessage: string;
};

type CreateLocalChatThreadInput = {
  chatKey: string;
  itemId: string;
  sellerName: string;
  town: string;
  avatarImage?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseLocalChatThreadRecord(value: unknown): LocalChatThreadRecord | null {
  if (!isRecord(value)) {
    return null;
  }

  const {
    id,
    chatKey,
    itemId,
    sellerName,
    town,
    avatarImage,
    href,
    createdAt,
    updatedAt,
    lastMessage,
  } = value;

  if (
    typeof id !== "string"
    || typeof chatKey !== "string"
    || typeof itemId !== "string"
    || typeof sellerName !== "string"
    || typeof town !== "string"
    || typeof href !== "string"
    || typeof createdAt !== "string"
    || typeof updatedAt !== "string"
    || typeof lastMessage !== "string"
  ) {
    return null;
  }

  return {
    id,
    chatKey,
    itemId,
    sellerName,
    town,
    avatarImage: typeof avatarImage === "string" ? avatarImage : undefined,
    href,
    createdAt,
    updatedAt,
    lastMessage,
  };
}

function canUseLocalStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readLocalChatThreads(): LocalChatThreadRecord[] {
  if (!canUseLocalStorage()) {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(LOCAL_CHAT_THREADS_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map(parseLocalChatThreadRecord)
      .filter((record): record is LocalChatThreadRecord => record != null)
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  } catch {
    return [];
  }
}

function writeLocalChatThreads(records: LocalChatThreadRecord[]) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(LOCAL_CHAT_THREADS_KEY, JSON.stringify(records));
}

export function createLocalChatThread(input: CreateLocalChatThreadInput): LocalChatThreadRecord {
  const timestamp = new Date().toISOString();

  return {
    id: `local-chat-${input.itemId}`,
    chatKey: input.chatKey,
    itemId: input.itemId,
    sellerName: input.sellerName,
    town: input.town,
    avatarImage: input.avatarImage,
    href: appendTabQuery(`/chat/${input.chatKey}`, "chat"),
    createdAt: timestamp,
    updatedAt: timestamp,
    lastMessage: DEFAULT_CHAT_PREVIEW_MESSAGE,
  };
}

export function ensureLocalChatThread(input: CreateLocalChatThreadInput) {
  const records = readLocalChatThreads();
  const existing = records.find((record) => record.itemId === input.itemId);

  if (existing) {
    return existing;
  }

  const next = createLocalChatThread(input);
  writeLocalChatThreads([next, ...records]);
  return next;
}

export function toChatThreadPreview(record: LocalChatThreadRecord): ChatThreadPreview {
  return {
    id: record.id,
    name: record.sellerName,
    town: record.town,
    updatedAt: "방금",
    lastMessage: record.lastMessage,
    avatarImage: record.avatarImage,
    href: record.href,
  };
}

export function mergeChatThreadPreviews(
  serverThreads: ChatThreadPreview[],
  localRecords: LocalChatThreadRecord[],
) {
  const serverKeys = new Set(serverThreads.map((thread) => thread.href ?? thread.id));
  const localThreads = localRecords
    .map(toChatThreadPreview)
    .filter((thread) => !serverKeys.has(thread.href ?? thread.id));

  return [...localThreads, ...serverThreads];
}
