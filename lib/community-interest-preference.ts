import { communityFilters, type CommunityPost, type CommunityTopicFilterKey } from "@/lib/community";

export const COMMUNITY_INTEREST_TOPIC_STORAGE_KEY = "karrot_community_interest_topic.v2";
export const COMMUNITY_INTEREST_TOPIC_COOKIE_KEY = "karrot_community_interest_topic_v2";
export const COMMUNITY_INTEREST_TOPIC_LIMIT = 3;

export function getCommunityInterestTopicFilter(topicId: string | null | undefined) {
  if (!topicId) {
    return null;
  }

  return communityFilters.find((filter) => filter.id === topicId && Boolean(filter.topic)) ?? null;
}

export function isCommunityInterestTopicId(topicId: string | null | undefined): topicId is CommunityTopicFilterKey {
  return Boolean(getCommunityInterestTopicFilter(topicId));
}

export function parseCommunityInterestTopicIds(rawTopicIds: string | null | undefined) {
  if (!rawTopicIds) {
    return [];
  }

  try {
    const parsedTopicIds = JSON.parse(rawTopicIds) as unknown;

    if (Array.isArray(parsedTopicIds)) {
      return parsedTopicIds
        .filter((topicId): topicId is string => typeof topicId === "string" && isCommunityInterestTopicId(topicId))
        .slice(0, COMMUNITY_INTEREST_TOPIC_LIMIT);
    }
  } catch {
    // Support older single-topic values while clearing between forced entries.
  }

  return isCommunityInterestTopicId(rawTopicIds) ? [rawTopicIds] : [];
}

export function serializeCommunityInterestTopicIds(topicIds: string[]) {
  return JSON.stringify(
    topicIds
      .filter((topicId) => isCommunityInterestTopicId(topicId))
      .slice(0, COMMUNITY_INTEREST_TOPIC_LIMIT),
  );
}

export function sortPostsByInterestTopics(posts: CommunityPost[], topicIds: string[]) {
  const selectedTopics = topicIds
    .map((topicId) => getCommunityInterestTopicFilter(topicId)?.topic)
    .filter((topic): topic is string => Boolean(topic));

  if (selectedTopics.length === 0) {
    return posts;
  }

  const selectedTopicSet = new Set(selectedTopics);

  return [...posts].sort((leftPost, rightPost) => {
    const leftMatches = selectedTopicSet.has(leftPost.topic);
    const rightMatches = selectedTopicSet.has(rightPost.topic);

    if (leftMatches === rightMatches) {
      return 0;
    }

    return leftMatches ? -1 : 1;
  });
}
