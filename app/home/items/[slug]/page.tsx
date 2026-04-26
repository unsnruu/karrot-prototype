import { notFound } from "next/navigation";
import { ItemDetailScreen } from "@/features/home/screens/item-detail-screen";
import { type HomeFeedItem } from "@/lib/marketplace";
import { getHomeFeedPage, getMarketplaceItemDetail } from "@/lib/marketplace-data";
import { isSafeLocalHref } from "@/lib/tab-navigation";

export default async function HomeItemPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ returnTo?: string | string[] }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  const rawReturnTo = Array.isArray(resolvedSearchParams.returnTo)
    ? resolvedSearchParams.returnTo[0]
    : resolvedSearchParams.returnTo;
  const returnTo = isSafeLocalHref(rawReturnTo) ? rawReturnTo : undefined;
  const detail = await getMarketplaceItemDetail(slug);

  if (!detail) {
    notFound();
  }

  const feedPage = await getHomeFeedPage({ limit: 8 });

  const relatedItems = feedPage.items.filter(
    (item): item is HomeFeedItem => item.type === "marketplace-item" && item.id !== detail.item.id,
  );

  return (
    <ItemDetailScreen
      item={detail.item}
      relatedItems={relatedItems}
      returnTo={returnTo}
      seller={detail.seller}
    />
  );
}
