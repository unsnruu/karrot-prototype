import { HomeSearchScreen } from "@/features/home/screens/home-search-screen";

type HomeSearchPageProps = {
  searchParams?: Promise<{
    query?: string | string[];
  }>;
};

export default async function HomeSearchPage({ searchParams }: HomeSearchPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const query = Array.isArray(resolvedSearchParams.query) ? resolvedSearchParams.query[0] : resolvedSearchParams.query;

  return <HomeSearchScreen initialQuery={query ?? ""} />;
}
