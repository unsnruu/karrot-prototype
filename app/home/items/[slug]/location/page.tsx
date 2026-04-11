import { notFound } from "next/navigation";
import { ItemLocationScreen } from "@/features/home/screens/item-location-screen";
import { getMarketplaceItemDetail } from "@/lib/server-data";

export default async function HomeItemLocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = await getMarketplaceItemDetail(slug);

  if (!detail) {
    notFound();
  }

  return <ItemLocationScreen item={detail.item} />;
}
