import { CommunityScreen } from "@/features/community/screens/community-screen";
import { cafePosts, communityMeetups, type CommunityTabKey } from "@/lib/community";
import { getCommunityPosts } from "@/lib/server-data";

type CommunityPageProps = {
  searchParams?: Promise<{
    tab?: string | string[];
  }>;
};

function resolveCommunityTab(tab?: string | string[]): CommunityTabKey {
  const value = Array.isArray(tab) ? tab[0] : tab;

  if (value === "meetup" || value === "cafe") {
    return value;
  }

  return "town";
}

export default async function CommunityPage({ searchParams }: CommunityPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const selectedTab = resolveCommunityTab(resolvedSearchParams.tab);
  const posts = await getCommunityPosts();

  return (
    <CommunityScreen
      cafePosts={cafePosts}
      meetups={communityMeetups}
      posts={posts}
      selectedTab={selectedTab}
    />
  );
}
