import { DevelopmentPendingScreen } from "@/features/shared/screens/development-pending-screen";
import { resolveReturnHref } from "@/lib/tab-navigation";

export default async function DevelopingPage({
  searchParams,
}: {
  searchParams?: Promise<{ feature?: string | string[]; returnTo?: string | string[] }>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const rawFeature = Array.isArray(resolvedSearchParams.feature) ? resolvedSearchParams.feature[0] : resolvedSearchParams.feature;
  const rawReturnTo = Array.isArray(resolvedSearchParams.returnTo)
    ? resolvedSearchParams.returnTo[0]
    : resolvedSearchParams.returnTo;

  return (
    <DevelopmentPendingScreen
      fallbackHref={resolveReturnHref(rawReturnTo, "/home")}
      featureLabel={rawFeature?.trim() || "이 기능"}
    />
  );
}
