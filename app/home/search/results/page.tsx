import { HomeSearchResultsScreen } from "@/features/home/screens/home-search-results-screen";
import { getCommunityPosts } from "@/lib/community-data";

type HomeSearchResultsPageProps = {
  searchParams?: Promise<{
    query?: string | string[];
    tab?: string | string[];
  }>;
};

export default async function HomeSearchResultsPage({ searchParams }: HomeSearchResultsPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const query = Array.isArray(resolvedSearchParams.query) ? resolvedSearchParams.query[0] : resolvedSearchParams.query;
  const tab = Array.isArray(resolvedSearchParams.tab) ? resolvedSearchParams.tab[0] : resolvedSearchParams.tab;
  const normalizedQuery = query?.trim() || "맛집";
  const posts = await getCommunityPosts();

  return <HomeSearchResultsScreen activeTab={tab === "community" ? "community" : "all"} posts={posts} query={normalizedQuery} />;
}
