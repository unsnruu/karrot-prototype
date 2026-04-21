"use client";

import { useMemo } from "react";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initAmplitude, trackEvent } from "@/lib/analytics/amplitude";
import { setHomeExperimentUserProperties } from "@/lib/analytics/home-experiment-user-properties";
import { calculateScrollDepthPercent, getScrollDepthMilestones } from "@/lib/analytics/scroll-depth";
import { buildScreenViewedEventProperties, getScreenName, isScreenViewedTrackedLocally } from "@/lib/analytics/screen-view";
import { readHomeExperimentVariantFromPathname, resolveHomeExperimentVariant } from "@/lib/home-experiment";

export function AnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const screenName = useMemo(() => getScreenName(pathname), [pathname]);
  const homeExperimentVariant = useMemo(() => {
    const experimentVariantFromPath = readHomeExperimentVariantFromPathname(pathname);

    if (experimentVariantFromPath) {
      return experimentVariantFromPath;
    }

    if (pathname === "/home") {
      return resolveHomeExperimentVariant(searchParams.get("variant") ?? undefined);
    }

    return undefined;
  }, [pathname, searchParams]);

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
    const isHomeExperimentScreen = pathname === "/home" || /^\/exp\/(a|b|c|d)\/home$/.test(pathname);
    const isDevelopingScreen = pathname === "/developing";
    const isHomeExperimentTownMapScreen = pathname.includes("/town-map") && searchParams.get("exp_source") === "home_experiment";

    const additionalProperties = {
      ...(isHomeExperimentScreen && homeExperimentVariant
        ? {
            category: searchParams.get("category") ?? "전체",
            experiment_name: "home_to_town_map_entry",
            experiment_variant: homeExperimentVariant,
          }
        : undefined),
      ...(isDevelopingScreen
        ? {
            feature_label: searchParams.get("feature") ?? "이 기능",
            return_to: searchParams.get("returnTo") ?? undefined,
            screen_type: "pending_feature",
          }
        : undefined),
      ...(isHomeExperimentTownMapScreen
        ? {
            experiment_name: "home_to_town_map_entry",
            experiment_surface: searchParams.get("exp_surface") ?? undefined,
            experiment_variant: searchParams.get("exp_variant") ?? undefined,
            target_id: searchParams.get("exp_target_id") ?? searchParams.get("exp_ad_id") ?? undefined,
            target_name: searchParams.get("exp_target_name") ?? "home_native_ad",
            target_position: (() => {
              const rawValue = searchParams.get("exp_target_position") ?? searchParams.get("exp_index");
              return rawValue != null ? Number(rawValue) : undefined;
            })(),
            target_type: searchParams.get("exp_target_type") ?? "ad",
          }
        : undefined),
    };

    const screenViewedProperties = buildScreenViewedEventProperties({
      pathname,
      queryString: search,
      additionalProperties: Object.keys(additionalProperties).length > 0 ? additionalProperties : undefined,
    });

    if (!isScreenViewedTrackedLocally(pathname)) {
      trackEvent("screen_viewed", screenViewedProperties);
    }
  }, [homeExperimentVariant, pathname, search, searchParams]);

  useEffect(() => {
    const isHomeExperimentScreen = pathname === "/home" || /^\/exp\/(a|b|c|d)\/home$/.test(pathname);

    if (!isHomeExperimentScreen || !homeExperimentVariant) {
      return;
    }

    const milestones = getScrollDepthMilestones();
    const trackedMilestones = new Set<number>();

    const handleScroll = () => {
      const progress = calculateScrollDepthPercent();

      milestones.forEach((milestone) => {
        if (progress < milestone || trackedMilestones.has(milestone)) {
          return;
        }

        trackedMilestones.add(milestone);
        trackEvent("home_experiment_scroll_depth_reached", {
          depth_percent: milestone,
          experiment_name: "home_to_town_map_entry",
          experiment_variant: homeExperimentVariant,
          path: pathname,
          screen_name: screenName,
        });
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [homeExperimentVariant, pathname, screenName]);

  return null;
}
