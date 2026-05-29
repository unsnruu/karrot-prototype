import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { CommunityPostDetailScreen } from "@/features/community/screens/community-post-detail-screen";
import {
  createVisitorExperimentContext,
  parseVisitorExperimentContext,
  VISITOR_EXPERIMENT_COOKIE_KEY,
} from "@/lib/analytics/experiment-assignment";
import { getCommunityPostDetail, getCommunityRecommendations } from "@/lib/community-data";

function getServerVisitorExperimentContext(rawContext: string | undefined) {
  if (!rawContext) {
    return createVisitorExperimentContext();
  }

  try {
    return parseVisitorExperimentContext(rawContext) ?? parseVisitorExperimentContext(decodeURIComponent(rawContext)) ?? createVisitorExperimentContext();
  } catch {
    return createVisitorExperimentContext();
  }
}

export default async function CommunityPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ returnTo?: string | string[] }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  const returnTo = Array.isArray(resolvedSearchParams.returnTo)
    ? resolvedSearchParams.returnTo[0]
    : resolvedSearchParams.returnTo;
  const cookieStore = await cookies();
  const visitorExperimentContext = getServerVisitorExperimentContext(cookieStore.get(VISITOR_EXPERIMENT_COOKIE_KEY)?.value);
  const [detail, recommendations] = await Promise.all([
    getCommunityPostDetail(id),
    getCommunityRecommendations(id),
  ]);

  if (!detail) {
    notFound();
  }

  return (
    <CommunityPostDetailScreen
      detail={detail}
      recommendations={recommendations}
      returnTo={returnTo}
      shortcutVariant={visitorExperimentContext.experiment.variant}
    />
  );
}
