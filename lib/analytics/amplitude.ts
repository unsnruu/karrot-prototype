"use client";

import * as amplitude from "@amplitude/unified";

let hasInitializedAmplitude = false;
const ANONYMOUS_VISITOR_STORAGE_KEY = "karrot_anonymous_visitor_id";

function createAnonymousVisitorId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `anon_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function getAnonymousVisitorId() {
  const existingVisitorId = window.localStorage.getItem(ANONYMOUS_VISITOR_STORAGE_KEY);

  if (existingVisitorId) {
    return existingVisitorId;
  }

  const nextVisitorId = createAnonymousVisitorId();
  window.localStorage.setItem(ANONYMOUS_VISITOR_STORAGE_KEY, nextVisitorId);
  return nextVisitorId;
}

export function initAmplitude() {
  if (hasInitializedAmplitude) {
    return;
  }

  amplitude.initAll("e7c295575d3deb8cfe579c02a820e507", {
    analytics: { autocapture: true },
  });

  amplitude.setUserId(getAnonymousVisitorId());

  hasInitializedAmplitude = true;
}

export function trackEvent(eventType: string, eventProperties?: Record<string, unknown>) {
  amplitude.track(eventType, eventProperties);
}
