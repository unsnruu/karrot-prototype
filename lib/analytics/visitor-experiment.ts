"use client";

import packageJson from "@/package.json";

const VISITOR_EXPERIMENT_STORAGE_KEY = "karrot_visitor_experiment_context";

export const ITEM_DETAIL_NEARBY_BUSINESS_EXPERIMENT_ID = "item_detail_nearby_business_entry";
export const ITEM_DETAIL_NEARBY_BUSINESS_ITERATION = "v1";

export type ItemDetailNearbyBusinessVariant = "as_is" | "nearby_business_carousel";

export type VisitorExperimentContext = {
  userId: string;
  appVersion: string;
  experiment: {
    id: string;
    iteration: string;
    variant: ItemDetailNearbyBusinessVariant;
  };
};

let visitorExperimentContext: VisitorExperimentContext | null = null;

function createAnonymousVisitorId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `anon_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function pickItemDetailNearbyBusinessVariant(): ItemDetailNearbyBusinessVariant {
  return Math.random() < 0.5 ? "as_is" : "nearby_business_carousel";
}

function createVisitorExperimentContext(): VisitorExperimentContext {
  return {
    userId: createAnonymousVisitorId(),
    appVersion: packageJson.version,
    experiment: {
      id: ITEM_DETAIL_NEARBY_BUSINESS_EXPERIMENT_ID,
      iteration: ITEM_DETAIL_NEARBY_BUSINESS_ITERATION,
      variant: pickItemDetailNearbyBusinessVariant(),
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

export function getItemDetailNearbyBusinessVariant() {
  return ensureVisitorExperimentContext()?.experiment.variant;
}

export function resetVisitorExperimentContextForTests() {
  visitorExperimentContext = null;

  if (typeof window !== "undefined") {
    window.localStorage.removeItem(VISITOR_EXPERIMENT_STORAGE_KEY);
  }
}
