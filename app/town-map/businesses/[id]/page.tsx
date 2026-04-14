import { notFound } from "next/navigation";
import { TownMapBusinessDetailScreen } from "@/features/town-map/screens/town-map-business-detail-screen";
import { getTownMapBusinessDetail } from "@/lib/town-map-business-data";
import { getTownMapBusinessNewsPosts } from "@/lib/town-map-business-news-data";
import { resolveTabHref } from "@/lib/tab-navigation";

export default async function TownMapBusinessPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ tab?: string | string[]; section?: string | string[] }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  const tab = Array.isArray(resolvedSearchParams.tab) ? resolvedSearchParams.tab[0] : resolvedSearchParams.tab;
  const section = Array.isArray(resolvedSearchParams.section) ? resolvedSearchParams.section[0] : resolvedSearchParams.section;
  const activeTab = resolveBusinessDetailTab(section);
  const [detail, newsPosts] = await Promise.all([getTownMapBusinessDetail(id), getTownMapBusinessNewsPosts(id)]);

  if (!detail) {
    notFound();
  }

  return (
    <TownMapBusinessDetailScreen
      activeTab={activeTab}
      backHref={resolveTabHref(tab, "/town-map")}
      detail={detail}
      newsPosts={newsPosts}
      tabHrefs={buildBusinessDetailTabHrefs({ businessId: id, tab })}
    />
  );
}

type BusinessDetailTab = "home" | "news" | "reviews" | "photos";

function resolveBusinessDetailTab(value: string | undefined): BusinessDetailTab {
  if (value === "home" || value === "news" || value === "reviews" || value === "photos") {
    return value;
  }

  return "news";
}

function buildBusinessDetailTabHrefs({
  businessId,
  tab,
}: {
  businessId: string;
  tab?: string;
}): Record<BusinessDetailTab, string> {
  const basePath = `/town-map/businesses/${businessId}`;

  return {
    home: createBusinessDetailHref(basePath, tab, "home"),
    news: createBusinessDetailHref(basePath, tab, "news"),
    reviews: createBusinessDetailHref(basePath, tab, "reviews"),
    photos: createBusinessDetailHref(basePath, tab, "photos"),
  };
}

function createBusinessDetailHref(basePath: string, tab: string | undefined, section: BusinessDetailTab) {
  const params = new URLSearchParams();

  if (tab) {
    params.set("tab", tab);
  }

  params.set("section", section);

  return `${basePath}?${params.toString()}`;
}
