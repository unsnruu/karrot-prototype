import { CommunityScreen } from "@/features/community/screens/community-screen";
import { cafePosts, communityFilters, communityMeetups, type CommunityPost, type CommunityTabKey, type CommunityTopicFilterKey } from "@/lib/community";
import { getCommunityPosts } from "@/lib/community-data";

type CommunityPageProps = {
  searchParams?: Promise<{
    tab?: string | string[];
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

function resolveCommunityTopicFilter(topic?: string | string[]): CommunityTopicFilterKey {
  const value = Array.isArray(topic) ? topic[0] : topic;

  if (value === "general" || value === "town-scene" || value === "story") {
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

export default async function CommunityPage({ searchParams }: CommunityPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const selectedTab = resolveCommunityTab(resolvedSearchParams.tab);
  const selectedTopic = resolveCommunityTopicFilter(resolvedSearchParams.topic);
  const posts = filterPostsByTopic(await getCommunityPosts(), selectedTopic);

  return (
    <CommunityScreen
      cafePosts={cafePosts}
      meetups={communityMeetups}
      posts={posts}
      selectedTab={selectedTab}
      selectedTopic={selectedTopic}
    />
  );
}
