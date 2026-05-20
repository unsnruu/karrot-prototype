"use client";

import packageJson from "@/package.json";

const LEGACY_VISITOR_EXPERIMENT_STORAGE_KEY = "karrot_visitor_experiment_context";
const PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY = "karrot_visitor_experiment_context.v2";
const PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY_V3 = "karrot_visitor_experiment_context.v3";
const PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY_V4 = "karrot_visitor_experiment_context.v4";
const VISITOR_EXPERIMENT_STORAGE_KEY = "karrot_visitor_experiment_context.v5";

export const ACTIVE_EXPERIMENT_ID = "none";
export const ACTIVE_EXPERIMENT_ITERATION = "1";
export const ACTIVE_EXPERIMENT_VARIANT = "none";

export type ItemLocationMapChatCalloutVariant = "control" | "map_flow_callout";
type VisitorExperimentVariant = typeof ACTIVE_EXPERIMENT_VARIANT;

export type VisitorExperimentContext = {
  userId: string;
  appVersion: string;
  experiment: {
    id: string;
    iteration: string;
    variant: VisitorExperimentVariant;
  };
};

let visitorExperimentContext: VisitorExperimentContext | null = null;

function getLegacyUiVariantOverride(): ItemLocationMapChatCalloutVariant | null {
  if (process.env.NODE_ENV === "production" || typeof window === "undefined") {
    return null;
  }

  const variantOverride = new URLSearchParams(window.location.search).get("experimentVariant");

  if (variantOverride === "control" || variantOverride === "map_flow_callout") {
    return variantOverride;
  }

  return null;
}

function createAnonymousVisitorId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `anon_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function createVisitorExperimentContext(): VisitorExperimentContext {
  return {
    userId: createAnonymousVisitorId(),
    appVersion: packageJson.version,
    experiment: {
      id: ACTIVE_EXPERIMENT_ID,
      iteration: ACTIVE_EXPERIMENT_ITERATION,
      variant: ACTIVE_EXPERIMENT_VARIANT,
    },
  };
}

export function ensureVisitorExperimentContext() {
  if (visitorExperimentContext) {
    return visitorExperimentContext;
  }

  if (typeof window === "undefined") {
    return null;
  }

  window.localStorage.removeItem(LEGACY_VISITOR_EXPERIMENT_STORAGE_KEY);
  window.localStorage.removeItem(PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY);
  window.localStorage.removeItem(PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY_V3);
  window.localStorage.removeItem(PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY_V4);

  const nextContext = createVisitorExperimentContext();
  window.localStorage.setItem(VISITOR_EXPERIMENT_STORAGE_KEY, JSON.stringify(nextContext));
  visitorExperimentContext = nextContext;

  return nextContext;
}

export function getEventExperimentProperties() {
  const context = ensureVisitorExperimentContext();

  if (!context) {
    return {};
  }

  return {
    user_id: context.userId,
    app_version: context.appVersion,
    experiment_id: context.experiment.id,
    iteration: context.experiment.iteration,
    variant: context.experiment.variant,
  };
}

export function getItemLocationMapChatCalloutVariant() {
  return getLegacyUiVariantOverride() ?? "control";
}

export function resetVisitorExperimentContextForTests() {
  visitorExperimentContext = null;

  if (typeof window !== "undefined") {
    window.localStorage.removeItem(LEGACY_VISITOR_EXPERIMENT_STORAGE_KEY);
    window.localStorage.removeItem(PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY);
    window.localStorage.removeItem(PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY_V3);
    window.localStorage.removeItem(PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY_V4);
    window.localStorage.removeItem(VISITOR_EXPERIMENT_STORAGE_KEY);
  }
}
