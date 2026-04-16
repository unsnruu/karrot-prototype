"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics/amplitude";

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
        trackEvent("element_exposed", eventProperties);
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
