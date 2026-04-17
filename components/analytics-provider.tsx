"use client";

import { useMemo } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initAmplitude, trackEvent } from "@/lib/analytics/amplitude";
import { setHomeExperimentUserProperties } from "@/lib/analytics/home-experiment-user-properties";
import { buildScreenViewedEventProperties, getScreenName, isScreenViewedTrackedLocally } from "@/lib/analytics/screen-view";
import { readHomeExperimentVariantFromPathname, resolveHomeExperimentVariant } from "@/lib/home-experiment";

export function AnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const screenName = useMemo(() => getScreenName(pathname), [pathname]);
  const currentScreenSessionRef = useRef<{
    hasTrackedExit: boolean;
    properties: Record<string, unknown>;
    startedAt: number;
  } | null>(null);
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

  const trackCurrentScreenExit = (exitReason: "pagehide" | "route_change") => {
    const currentScreenSession = currentScreenSessionRef.current;

    if (!currentScreenSession || currentScreenSession.hasTrackedExit) {
      return;
    }

    currentScreenSession.hasTrackedExit = true;

    trackEvent("screen_exited", {
      ...currentScreenSession.properties,
      duration_ms: Math.max(0, Date.now() - currentScreenSession.startedAt),
      exit_reason: exitReason,
    });
  };

  useEffect(() => {
    initAmplitude();
  }, []);

  useEffect(() => {
    const handlePageHide = () => {
      trackCurrentScreenExit("pagehide");
    };

    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
    };
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
    };

    const screenViewedProperties = buildScreenViewedEventProperties({
      pathname,
      queryString: search,
      additionalProperties: Object.keys(additionalProperties).length > 0 ? additionalProperties : undefined,
    });

    const screenSession = {
      hasTrackedExit: false,
      properties: screenViewedProperties,
      startedAt: Date.now(),
    };

    currentScreenSessionRef.current = screenSession;

    if (!isScreenViewedTrackedLocally(pathname)) {
      trackEvent("screen_viewed", screenViewedProperties);
    }

    return () => {
      if (currentScreenSessionRef.current !== screenSession) {
        return;
      }

      trackCurrentScreenExit("route_change");
    };
  }, [homeExperimentVariant, pathname, search, searchParams]);

  useEffect(() => {
    const source = searchParams.get("exp_source");
    const variant = searchParams.get("exp_variant");
    const surface = searchParams.get("exp_surface");
    const targetId = searchParams.get("exp_target_id") ?? searchParams.get("exp_ad_id");
    const targetPosition = searchParams.get("exp_target_position") ?? searchParams.get("exp_index");
    const targetName = searchParams.get("exp_target_name") ?? "home_native_ad";
    const targetType = searchParams.get("exp_target_type") ?? "ad";

    if (source !== "home_experiment") {
      return;
    }

    if (!pathname.includes("/town-map")) {
      return;
    }

    trackEvent("home_experiment_town_map_entered", {
      experiment_name: "home_to_town_map_entry",
      experiment_surface: surface ?? undefined,
      experiment_variant: variant ?? undefined,
      path: pathname,
      screen_name: screenName,
      target_id: targetId ?? undefined,
      target_name: targetName,
      target_position: targetPosition != null ? Number(targetPosition) : undefined,
      target_type: targetType,
    });
  }, [pathname, screenName, searchParams]);

  useEffect(() => {
    const isHomeExperimentScreen = pathname === "/home" || /^\/exp\/(a|b|c|d)\/home$/.test(pathname);

    if (!isHomeExperimentScreen || !homeExperimentVariant) {
      return;
    }

    const milestones = [25, 50, 75, 100] as const;
    const trackedMilestones = new Set<number>();

    const handleScroll = () => {
      const documentElement = document.documentElement;
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      const scrollableHeight = documentElement.scrollHeight - viewportHeight;
      const progress = scrollableHeight <= 0 ? 100 : Math.min(100, Math.round(((scrollTop + viewportHeight) / documentElement.scrollHeight) * 100));

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

  useEffect(() => {
    const source = searchParams.get("exp_source");
    const variant = searchParams.get("exp_variant");
    const surface = searchParams.get("exp_surface");
    const targetId = searchParams.get("exp_target_id") ?? searchParams.get("exp_ad_id");
    const targetPosition = searchParams.get("exp_target_position") ?? searchParams.get("exp_index");
    const targetName = searchParams.get("exp_target_name") ?? "home_native_ad";
    const targetType = searchParams.get("exp_target_type") ?? "ad";

    if (source !== "home_experiment" || !pathname.includes("/town-map")) {
      return;
    }

    let hasTracked = false;

    const trackEngagement = (engagementType: "dwell" | "scroll" | "tap") => {
      if (hasTracked) {
        return;
      }

      hasTracked = true;
      trackEvent("town_map_landing_engaged", {
        engagement_type: engagementType,
        experiment_name: "home_to_town_map_entry",
        experiment_surface: surface ?? undefined,
        experiment_variant: variant ?? undefined,
        path: pathname,
        screen_name: screenName,
        target_id: targetId ?? undefined,
        target_name: targetName,
        target_position: targetPosition != null ? Number(targetPosition) : undefined,
        target_type: targetType,
      });
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pointerdown", handlePointerDown);
    };

    const handleScroll = () => {
      trackEngagement("scroll");
    };

    const handlePointerDown = () => {
      trackEngagement("tap");
    };

    const dwellTimer = window.setTimeout(() => {
      trackEngagement("dwell");
    }, 5000);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });

    return () => {
      window.clearTimeout(dwellTimer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [pathname, screenName, searchParams]);

  return null;
}
