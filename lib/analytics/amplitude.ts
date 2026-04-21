"use client";

import * as amplitude from "@amplitude/unified";
import { ensureVisitorExperimentContext, getEventExperimentProperties } from "@/lib/analytics/visitor-experiment";

let hasInitializedAmplitude = false;
const AMPLITUDE_API_KEY = "290e6f4f90b9e7274301e2954fccc25f";

export function initAmplitude() {
  if (hasInitializedAmplitude) {
    return;
  }

  amplitude.initAll(AMPLITUDE_API_KEY, {
    analytics: { autocapture: true },
  });

  const visitorExperimentContext = ensureVisitorExperimentContext();

  if (visitorExperimentContext) {
    amplitude.setUserId(visitorExperimentContext.userId);

    const identify = new amplitude.Identify();
    identify.set("app_version", visitorExperimentContext.appVersion);
    identify.set("experiment_id", visitorExperimentContext.experiment.id);
    identify.set("iteration", visitorExperimentContext.experiment.iteration);
    identify.set("variant", visitorExperimentContext.experiment.variant);
    amplitude.identify(identify);
  }

  hasInitializedAmplitude = true;
}

export function trackEvent(eventType: string, eventProperties?: Record<string, unknown>) {
  initAmplitude();
  amplitude.track(eventType, {
    ...eventProperties,
    ...getEventExperimentProperties(),
  });
}
