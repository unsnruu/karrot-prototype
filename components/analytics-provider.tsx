"use client";

import { useMemo } from "react";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initAmplitude, trackEvent } from "@/lib/analytics/amplitude";
import { readHomeExperimentVariantFromPathname, resolveHomeExperimentVariant } from "@/lib/home-experiment";

export function AnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
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
    trackEvent("screen_viewed", {
      path: pathname,
      query_string: search || undefined,
    });
  }, [pathname, search]);

  useEffect(() => {
    const isHomeExperimentScreen = pathname === "/home" || /^\/exp\/(a|b|c)\/home$/.test(pathname);

    if (!isHomeExperimentScreen || !homeExperimentVariant) {
      return;
    }

    trackEvent("home_experiment_screen_viewed", {
      category: searchParams.get("category") ?? "전체",
      experiment_name: "home_to_town_map_entry",
      experiment_variant: homeExperimentVariant,
      path: pathname,
    });
  }, [homeExperimentVariant, pathname, searchParams]);

  useEffect(() => {
    const source = searchParams.get("exp_source");
    const variant = searchParams.get("exp_variant");
    const surface = searchParams.get("exp_surface");
    const adId = searchParams.get("exp_ad_id");
    const adIndex = searchParams.get("exp_index");

    if (source !== "home_experiment") {
      return;
    }

    if (!pathname.includes("/town-map")) {
      return;
    }

    trackEvent("home_experiment_town_map_entered", {
      ad_id: adId ?? undefined,
      ad_index: adIndex != null ? Number(adIndex) : undefined,
      experiment_name: "home_to_town_map_entry",
      experiment_surface: surface ?? undefined,
      experiment_variant: variant ?? undefined,
      path: pathname,
    });
  }, [pathname, searchParams]);

  useEffect(() => {
    const isHomeExperimentScreen = pathname === "/home" || /^\/exp\/(a|b|c)\/home$/.test(pathname);

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
  }, [homeExperimentVariant, pathname]);

  useEffect(() => {
    const source = searchParams.get("exp_source");
    const variant = searchParams.get("exp_variant");
    const surface = searchParams.get("exp_surface");

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
  }, [pathname, searchParams]);

  return null;
}
