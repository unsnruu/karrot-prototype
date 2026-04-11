import { notFound } from "next/navigation";
import { CommunityPostDetailScreen } from "@/features/community/screens/community-post-detail-screen";
import { getCommunityPostDetail, getCommunityRecommendations } from "@/lib/server-data";

export default async function CommunityPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [detail, recommendations] = await Promise.all([
    getCommunityPostDetail(id),
    getCommunityRecommendations(id),
  ]);

  if (!detail) {
    notFound();
  }

  return <CommunityPostDetailScreen detail={detail} recommendations={recommendations} />;
}
