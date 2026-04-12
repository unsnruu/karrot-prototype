import { notFound } from "next/navigation";
import { TownMapBusinessDetailScreen } from "@/features/town-map/screens/town-map-business-detail-screen";
import { getTownMapBusinessDetail } from "@/lib/town-map-business-data";

export default async function TownMapBusinessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getTownMapBusinessDetail(id);

  if (!detail) {
    notFound();
  }

  return <TownMapBusinessDetailScreen detail={detail} />;
}
