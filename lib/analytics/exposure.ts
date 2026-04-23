"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics/amplitude";

type ExposureEventType = "element_exposed" | "component_exposed";

type UseExposureTrackingInput = {
  eventType: ExposureEventType;
  eventProperties: Record<string, unknown>;
  disabled?: boolean;
  threshold?: number;
};

const DEFAULT_THRESHOLD = 0.6;

export function useExposureTracking<T extends HTMLElement>({
  eventType,
  eventProperties,
  disabled = false,
  threshold = DEFAULT_THRESHOLD,
}: UseExposureTrackingInput) {
  const targetRef = useRef<T | null>(null);
  const hasTrackedExposureRef = useRef(false);
  const eventPropertiesRef = useRef(eventProperties);

  eventPropertiesRef.current = eventProperties;

  useEffect(() => {
    if (disabled || hasTrackedExposureRef.current) {
      return;
    }

    const target = targetRef.current;
    if (!target || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const hasReachedThreshold = entries.some((entry) => {
          if (!entry.isIntersecting) {
            return false;
          }

          if (threshold <= 0) {
            return true;
          }

          return entry.intersectionRatio >= threshold;
        });

        if (!hasReachedThreshold || hasTrackedExposureRef.current) {
          return;
        }

        hasTrackedExposureRef.current = true;
        trackEvent(eventType, eventPropertiesRef.current);
        observer.disconnect();
      },
      {
        threshold: [threshold],
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [disabled, eventType, threshold]);

  return targetRef;
}
