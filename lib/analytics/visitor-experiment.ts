"use client";

import packageJson from "@/package.json";

const LEGACY_VISITOR_EXPERIMENT_STORAGE_KEY = "karrot_visitor_experiment_context";
const PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY = "karrot_visitor_experiment_context.v2";
const PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY_V3 = "karrot_visitor_experiment_context.v3";
const VISITOR_EXPERIMENT_STORAGE_KEY = "karrot_visitor_experiment_context.v4";

export const ITEM_LOCATION_MAP_CHAT_CALLOUT_EXPERIMENT_ID = "item_location_map_chat_callout";
export const ITEM_LOCATION_MAP_CHAT_CALLOUT_ITERATION = "1";

export type ItemLocationMapChatCalloutVariant = "control" | "map_flow_callout";

export type VisitorExperimentContext = {
  userId: string;
  appVersion: string;
  experiment: {
    id: string;
    iteration: string;
    variant: ItemLocationMapChatCalloutVariant;
  };
};

let visitorExperimentContext: VisitorExperimentContext | null = null;

function getDevVariantOverride(): ItemLocationMapChatCalloutVariant | null {
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

function pickItemLocationMapChatCalloutVariant(): ItemLocationMapChatCalloutVariant {
  const variantOverride = getDevVariantOverride();

  if (variantOverride) {
    return variantOverride;
  }

  const bucket = Math.random();

  if (bucket < 1 / 2) {
    return "control";
  }

  return "map_flow_callout";
}

function createVisitorExperimentContext(): VisitorExperimentContext {
  return {
    userId: createAnonymousVisitorId(),
    appVersion: packageJson.version,
    experiment: {
      id: ITEM_LOCATION_MAP_CHAT_CALLOUT_EXPERIMENT_ID,
      iteration: ITEM_LOCATION_MAP_CHAT_CALLOUT_ITERATION,
      variant: pickItemLocationMapChatCalloutVariant(),
    },
  };
}

export function ensureVisitorExperimentContext() {
  if (visitorExperimentContext) {
    const variantOverride = getDevVariantOverride();

    if (variantOverride && visitorExperimentContext.experiment.variant !== variantOverride) {
      visitorExperimentContext = {
        ...visitorExperimentContext,
        experiment: {
          ...visitorExperimentContext.experiment,
          variant: variantOverride,
        },
      };

      window.localStorage.setItem(VISITOR_EXPERIMENT_STORAGE_KEY, JSON.stringify(visitorExperimentContext));
    }

    return visitorExperimentContext;
  }

  if (typeof window === "undefined") {
    return null;
  }

  window.localStorage.removeItem(LEGACY_VISITOR_EXPERIMENT_STORAGE_KEY);
  window.localStorage.removeItem(PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY);
  window.localStorage.removeItem(PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY_V3);

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
  return getDevVariantOverride() ?? ensureVisitorExperimentContext()?.experiment.variant;
}

export function resetVisitorExperimentContextForTests() {
  visitorExperimentContext = null;

  if (typeof window !== "undefined") {
    window.localStorage.removeItem(LEGACY_VISITOR_EXPERIMENT_STORAGE_KEY);
    window.localStorage.removeItem(PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY);
    window.localStorage.removeItem(PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY_V3);
    window.localStorage.removeItem(VISITOR_EXPERIMENT_STORAGE_KEY);
  }
}
