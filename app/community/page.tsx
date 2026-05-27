import { cookies } from "next/headers";
import { CommunityScreen } from "@/features/community/screens/community-screen";
import { parseVisitorExperimentContext, VISITOR_EXPERIMENT_COOKIE_KEY, type VisitorExperimentVariant } from "@/lib/analytics/experiment-assignment";
import { cafePosts, communityFilters, communityMeetups, type CommunityFeedFilterKey, type CommunityPost, type CommunityTabKey, type CommunityTopicFilterKey } from "@/lib/community";
import { getCommunityPosts } from "@/lib/community-data";
import { COMMUNITY_INTEREST_TOPIC_COOKIE_KEY, parseCommunityInterestTopicIds, sortPostsByInterestTopics } from "@/lib/community-interest-preference";

const CONTROL_EXPERIMENT_VARIANT: VisitorExperimentVariant = "control";

type CommunityPageProps = {
  searchParams?: Promise<{
    tab?: string | string[];
    feed?: string | string[];
    topic?: string | string[];
  }>;
};

function resolveCommunityTab(tab?: string | string[]): CommunityTabKey {
  const value = Array.isArray(tab) ? tab[0] : tab;

  if (value === "meetup" || value === "cafe") {
    return value;
  }

  return "town";
}

function resolveCommunityFeedFilter(feed?: string | string[]): CommunityFeedFilterKey {
  const value = Array.isArray(feed) ? feed[0] : feed;

  if (value === "latest") {
    return value;
  }

  return "recommended";
}

function resolveCommunityTopicFilter(topic?: string | string[]): CommunityTopicFilterKey {
  const value = Array.isArray(topic) ? topic[0] : topic;

  if (value && communityFilters.some((filter) => filter.id === value)) {
    return value;
  }

  return "all";
}

function filterPostsByTopic(posts: CommunityPost[], selectedTopic: CommunityTopicFilterKey) {
  const selectedFilter = communityFilters.find((filter) => filter.id === selectedTopic);

  if (!selectedFilter?.topic) {
    return posts;
  }

  return posts.filter((post) => post.topic === selectedFilter.topic);
}

function getStoredExperimentVariant(rawContext: string | undefined) {
  if (!rawContext) {
    return null;
  }

  try {
    return parseVisitorExperimentContext(rawContext)?.experiment.variant ?? parseVisitorExperimentContext(decodeURIComponent(rawContext))?.experiment.variant ?? null;
  } catch {
    return null;
  }
}

export default async function CommunityPage({ searchParams }: CommunityPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const selectedTab = resolveCommunityTab(resolvedSearchParams.tab);
  const selectedFeed = resolveCommunityFeedFilter(resolvedSearchParams.feed);
  const selectedTopic = resolveCommunityTopicFilter(resolvedSearchParams.topic);
  const cookieStore = await cookies();
  const storedVariant = getStoredExperimentVariant(cookieStore.get(VISITOR_EXPERIMENT_COOKIE_KEY)?.value);
  const rawInterestTopicIds = cookieStore.get(COMMUNITY_INTEREST_TOPIC_COOKIE_KEY)?.value;
  const interestTopicIds = parseCommunityInterestTopicIds(rawInterestTopicIds ? decodeURIComponent(rawInterestTopicIds) : null);
  const shouldPrioritizeInterestTopic = storedVariant === "interest_based" && selectedTab === "town" && selectedFeed === "recommended" && selectedTopic === "all";
  const allPosts = await getCommunityPosts();
  const posts = shouldPrioritizeInterestTopic ? sortPostsByInterestTopics(allPosts, interestTopicIds) : filterPostsByTopic(allPosts, selectedTopic);

  return (
    <CommunityScreen
      cafePosts={cafePosts}
      experimentVariant={CONTROL_EXPERIMENT_VARIANT}
      meetups={communityMeetups}
      posts={posts}
      selectedFeed={selectedFeed}
      selectedTab={selectedTab}
      selectedTopic={selectedTopic}
    />
  );
}
