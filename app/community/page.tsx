import { cookies } from "next/headers";
import { CommunityScreen } from "@/features/community/screens/community-screen";
import {
  createVisitorExperimentContext,
  parseVisitorExperimentContext,
  VISITOR_EXPERIMENT_COOKIE_KEY,
} from "@/lib/analytics/experiment-assignment";
import { cafePosts, communityFilters, communityMeetups, type CommunityFeedFilterKey, type CommunityPost, type CommunityTabKey, type CommunityTopicFilterKey } from "@/lib/community";
import { getCommunityPosts } from "@/lib/community-data";

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

function getServerVisitorExperimentContext(rawContext: string | undefined) {
  if (!rawContext) {
    return createVisitorExperimentContext();
  }

  try {
    return parseVisitorExperimentContext(rawContext) ?? parseVisitorExperimentContext(decodeURIComponent(rawContext)) ?? createVisitorExperimentContext();
  } catch {
    return createVisitorExperimentContext();
  }
}

export default async function CommunityPage({ searchParams }: CommunityPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const selectedTab = resolveCommunityTab(resolvedSearchParams.tab);
  const selectedFeed = resolveCommunityFeedFilter(resolvedSearchParams.feed);
  const selectedTopic = resolveCommunityTopicFilter(resolvedSearchParams.topic);
  const cookieStore = await cookies();
  const visitorExperimentContext = getServerVisitorExperimentContext(cookieStore.get(VISITOR_EXPERIMENT_COOKIE_KEY)?.value);
  const posts = filterPostsByTopic(await getCommunityPosts(), selectedTopic);

  return (
    <CommunityScreen
      cafePosts={cafePosts}
      experimentVariant={visitorExperimentContext.experiment.variant}
      meetups={communityMeetups}
      posts={posts}
      selectedFeed={selectedFeed}
      selectedTab={selectedTab}
      selectedTopic={selectedTopic}
    />
  );
}
