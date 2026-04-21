"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initAmplitude, trackEvent } from "@/lib/analytics/amplitude";
import { buildScreenViewedEventProperties, isScreenViewedTrackedLocally } from "@/lib/analytics/screen-view";

export function AnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  useEffect(() => {
    initAmplitude();
  }, []);

  useEffect(() => {
    const screenViewedProperties = buildScreenViewedEventProperties({
      pathname,
      queryString: search,
    });

    if (!isScreenViewedTrackedLocally(pathname)) {
      trackEvent("screen_viewed", screenViewedProperties);
    }
  }, [pathname, search]);

  return null;
}
