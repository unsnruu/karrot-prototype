import { DevelopmentPendingScreen } from "@/features/shared/screens/development-pending-screen";
import { resolveReturnHref } from "@/lib/tab-navigation";

export default async function DevelopingPage({
  searchParams,
}: {
  searchParams?: Promise<{ returnTo?: string | string[] }>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const rawReturnTo = Array.isArray(resolvedSearchParams.returnTo)
    ? resolvedSearchParams.returnTo[0]
    : resolvedSearchParams.returnTo;

  return <DevelopmentPendingScreen fallbackHref={resolveReturnHref(rawReturnTo, "/home")} />;
}
