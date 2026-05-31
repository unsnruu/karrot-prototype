export type CommunityEmpathyReactionType = "like" | "curious";

export type CommunityEmpathyRecord = {
  id: string;
  postId: string;
  postTitle: string;
  reactionType: CommunityEmpathyReactionType;
  reactionLabel: string;
  description: string;
  createdAt: string;
};

const COMMUNITY_EMPATHY_STORAGE_KEY = "karrot_community_today_empathy.v1";
const COMMUNITY_EMPATHY_CALLOUT_STORAGE_KEY = "karrot_community_empathy_callout_seen.v1";

function isCommunityEmpathyRecord(value: unknown): value is CommunityEmpathyRecord {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Partial<CommunityEmpathyRecord>;

  return (
    typeof record.id === "string" &&
    typeof record.postId === "string" &&
    typeof record.postTitle === "string" &&
    (record.reactionType === "like" || record.reactionType === "curious") &&
    typeof record.reactionLabel === "string" &&
    typeof record.description === "string" &&
    typeof record.createdAt === "string"
  );
}

export function getCommunityEmpathyRecords() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const parsedRecords = JSON.parse(window.localStorage.getItem(COMMUNITY_EMPATHY_STORAGE_KEY) ?? "[]");

    if (!Array.isArray(parsedRecords)) {
      return [];
    }

    return parsedRecords.filter(isCommunityEmpathyRecord);
  } catch {
    return [];
  }
}

export function saveCommunityEmpathyRecord(record: Omit<CommunityEmpathyRecord, "id" | "createdAt">) {
  if (typeof window === "undefined") {
    return;
  }

  const nextRecord: CommunityEmpathyRecord = {
    ...record,
    id: `${record.postId}:${record.reactionType}`,
    createdAt: new Date().toISOString(),
  };
  const records = getCommunityEmpathyRecords().filter((currentRecord) => currentRecord.id !== nextRecord.id);
  const nextRecords = [nextRecord, ...records].slice(0, 20);

  window.localStorage.setItem(COMMUNITY_EMPATHY_STORAGE_KEY, JSON.stringify(nextRecords));
}

export function removeCommunityEmpathyRecord(postId: string, reactionType: CommunityEmpathyReactionType) {
  if (typeof window === "undefined") {
    return;
  }

  const recordId = `${postId}:${reactionType}`;
  const nextRecords = getCommunityEmpathyRecords().filter((record) => record.id !== recordId);

  window.localStorage.setItem(COMMUNITY_EMPATHY_STORAGE_KEY, JSON.stringify(nextRecords));
}

export function shouldShowCommunityEmpathyCallout() {
  if (typeof window === "undefined") {
    return false;
  }

  if (window.localStorage.getItem(COMMUNITY_EMPATHY_CALLOUT_STORAGE_KEY) === "true") {
    return false;
  }

  window.localStorage.setItem(COMMUNITY_EMPATHY_CALLOUT_STORAGE_KEY, "true");

  return true;
}
