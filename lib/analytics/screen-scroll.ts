"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics/amplitude";

type UseScreenScrollMilestonesInput = {
  screenName: string;
  path: string;
  queryString?: string;
  milestones: number[];
  disabled?: boolean;
};

function compactProperties(properties: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(properties).filter(([, value]) => value !== undefined));
}

function getScrollReachedPercent() {
  const scrollElement = document.documentElement;
  const scrollTop = window.scrollY || scrollElement.scrollTop || 0;
  const viewportHeight = window.innerHeight || scrollElement.clientHeight || 0;
  const scrollHeight = Math.max(scrollElement.scrollHeight, document.body?.scrollHeight ?? 0);

  if (scrollHeight <= viewportHeight) {
    return 100;
  }

  return Math.min(100, Math.round(((scrollTop + viewportHeight) / scrollHeight) * 100));
}

export function useScreenScrollMilestones({
  screenName,
  path,
  queryString,
  milestones,
  disabled = false,
}: UseScreenScrollMilestonesInput) {
  const trackedMilestonesRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (disabled || milestones.length === 0 || typeof window === "undefined") {
      return;
    }

    trackedMilestonesRef.current = new Set();
    const sortedMilestones = [...milestones].sort((left, right) => left - right);

    const handleScroll = () => {
      const scrollReached = getScrollReachedPercent();

      for (const milestone of sortedMilestones) {
        if (scrollReached < milestone || trackedMilestonesRef.current.has(milestone)) {
          continue;
        }

        trackedMilestonesRef.current.add(milestone);
        trackEvent("screen_viewed", compactProperties({
          screen_name: screenName,
          path,
          query_string: queryString || undefined,
          scroll_reached: milestone,
        }));
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [disabled, milestones, path, queryString, screenName]);
}
