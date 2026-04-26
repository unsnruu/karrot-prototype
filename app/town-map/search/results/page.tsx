import { TownMapSearchResultsScreen } from "@/features/town-map/screens/town-map-search-results-screen";
import { resolveReturnHref } from "@/lib/tab-navigation";
import { type TownMapSearchEntrySource } from "@/lib/town-map";

type TownMapSearchResultsPageProps = {
  searchParams?: Promise<{
    entrySource?: string | string[];
    query?: string | string[];
    returnTo?: string | string[];
  }>;
};

function readSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function resolveEntrySource(value: string | undefined): TownMapSearchEntrySource {
  return value === "item_detail" ? "item_detail" : "town_map_search";
}

export default async function TownMapSearchResultsPage({ searchParams }: TownMapSearchResultsPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const query = readSingleParam(resolvedSearchParams.query)?.trim() || "합정역";
  const returnTo = readSingleParam(resolvedSearchParams.returnTo);
  const entrySource = resolveEntrySource(readSingleParam(resolvedSearchParams.entrySource));
  const fallbackReturnHref = entrySource === "item_detail" ? "/home" : "/town-map";
  const returnHref = resolveReturnHref(returnTo, fallbackReturnHref);

  return (
    <TownMapSearchResultsScreen
      entrySource={entrySource}
      query={query}
      returnHref={returnHref}
    />
  );
}
