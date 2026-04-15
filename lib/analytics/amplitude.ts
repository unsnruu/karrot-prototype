"use client";

import * as amplitude from "@amplitude/unified";

let hasInitializedAmplitude = false;

export function initAmplitude() {
  if (hasInitializedAmplitude) {
    return;
  }

  amplitude.initAll("e7c295575d3deb8cfe579c02a820e507", {
    analytics: { autocapture: true },
    sessionReplay: { sampleRate: 1 },
  });

  hasInitializedAmplitude = true;
}

export function trackEvent(eventType: string, eventProperties?: Record<string, unknown>) {
  amplitude.track(eventType, eventProperties);
}
