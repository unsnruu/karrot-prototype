"use client";

import * as amplitude from "@amplitude/unified";

let hasInitializedAmplitude = false;
const ANONYMOUS_VISITOR_STORAGE_KEY = "karrot_anonymous_visitor_id";
const AMPLITUDE_API_KEY = "cae4beaac8ce7c7b1fb962423ae32a01";

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

  amplitude.initAll(AMPLITUDE_API_KEY, {
    analytics: { autocapture: true },
  });

  amplitude.setUserId(getAnonymousVisitorId());

  hasInitializedAmplitude = true;
}

export function trackEvent(eventType: string, eventProperties?: Record<string, unknown>) {
  initAmplitude();
  amplitude.track(eventType, eventProperties);
}
