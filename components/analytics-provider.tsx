"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initAmplitude, trackEvent } from "@/lib/analytics/amplitude";

export function AnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  useEffect(() => {
    initAmplitude();
  }, []);

  useEffect(() => {
    trackEvent("screen_viewed", {
      path: pathname,
      query_string: search || undefined,
    });
  }, [pathname, search]);

  return null;
}
