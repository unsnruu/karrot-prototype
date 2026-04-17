import { notFound } from "next/navigation";
import { ItemLocationScreen } from "@/features/home/screens/item-location-screen";
import { getMarketplaceItemDetail } from "@/lib/marketplace-data";
import { appendNavigationQuery, isSafeLocalHref } from "@/lib/tab-navigation";

export default async function HomeItemLocationPage({
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
  const detail = await getMarketplaceItemDetail(slug);

  if (!detail) {
    notFound();
  }

  const detailHref = appendNavigationQuery(`/home/items/${slug}`, {
    returnTo: isSafeLocalHref(rawReturnTo) ? rawReturnTo : undefined,
  });

  return <ItemLocationScreen backHref={detailHref} item={detail.item} />;
}
