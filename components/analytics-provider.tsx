"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initAmplitude, trackEvent } from "@/lib/analytics/amplitude";
import { setHomeExperimentUserProperties } from "@/lib/analytics/home-experiment-user-properties";
import { buildScreenViewedEventProperties, isScreenViewedTrackedLocally } from "@/lib/analytics/screen-view";
import { readHomeExperimentVariantFromPathname, resolveHomeExperimentVariant } from "@/lib/home-experiment";

export function AnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const homeExperimentVariant = (() => {
    const experimentVariantFromPath = readHomeExperimentVariantFromPathname(pathname);

    if (experimentVariantFromPath) {
      return experimentVariantFromPath;
    }

    if (pathname === "/home") {
      return resolveHomeExperimentVariant(searchParams.get("variant") ?? undefined);
    }

    return undefined;
  })();

  useEffect(() => {
    initAmplitude();
  }, []);

  useEffect(() => {
    if (!homeExperimentVariant) {
      return;
    }

    setHomeExperimentUserProperties(homeExperimentVariant);
  }, [homeExperimentVariant]);

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
