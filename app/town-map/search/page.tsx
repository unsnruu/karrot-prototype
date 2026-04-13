import { TownMapSearchScreen } from "@/features/town-map/screens/town-map-search-screen";
import { resolveReturnHref, resolveTabHref } from "@/lib/tab-navigation";

type TownMapSearchPageProps = {
  searchParams?: Promise<{
    returnTo?: string | string[];
    tab?: string | string[];
  }>;
};

export default async function TownMapSearchPage({ searchParams }: TownMapSearchPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const tab = Array.isArray(resolvedSearchParams.tab) ? resolvedSearchParams.tab[0] : resolvedSearchParams.tab;
  const returnTo = Array.isArray(resolvedSearchParams.returnTo)
    ? resolvedSearchParams.returnTo[0]
    : resolvedSearchParams.returnTo;
  const returnHref = resolveReturnHref(returnTo, resolveTabHref(tab, "/town-map"));

  return <TownMapSearchScreen returnHref={returnHref} />;
}
