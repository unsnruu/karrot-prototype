"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics/amplitude";
import { calculateScrollDepthPercent, resolveScrollDepthBucket } from "@/lib/analytics/scroll-depth";

export function useHomeExperimentImpression(eventProperties: Record<string, unknown>) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    let hasTracked = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (hasTracked) {
          return;
        }

        if (!entries[0]?.isIntersecting) {
          return;
        }

        hasTracked = true;

        const scrollDepthPercent = calculateScrollDepthPercent();

        trackEvent("element_exposed", {
          ...eventProperties,
          scroll_depth_bucket: resolveScrollDepthBucket(scrollDepthPercent),
          scroll_depth_percent: scrollDepthPercent,
        });
        observer.disconnect();
      },
      { threshold: 0.6 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [eventProperties]);

  return ref;
}
