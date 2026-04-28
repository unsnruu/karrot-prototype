"use client";

import packageJson from "@/package.json";

const LEGACY_VISITOR_EXPERIMENT_STORAGE_KEY = "karrot_visitor_experiment_context";
const PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY = "karrot_visitor_experiment_context.v2";
const VISITOR_EXPERIMENT_STORAGE_KEY = "karrot_visitor_experiment_context.v3";

export const CHAT_APPOINTMENT_PLACE_RECOMMENDATION_EXPERIMENT_ID = "chat_appointment_place_recommendation";
export const CHAT_APPOINTMENT_PLACE_RECOMMENDATION_ITERATION = "1";

export type ChatAppointmentPlaceRecommendationVariant = "control" | "message" | "callout";

export type VisitorExperimentContext = {
  userId: string;
  appVersion: string;
  experiment: {
    id: string;
    iteration: string;
    variant: ChatAppointmentPlaceRecommendationVariant;
  };
};

let visitorExperimentContext: VisitorExperimentContext | null = null;

function getDevVariantOverride(): ChatAppointmentPlaceRecommendationVariant | null {
  if (process.env.NODE_ENV === "production" || typeof window === "undefined") {
    return null;
  }

  const variantOverride = new URLSearchParams(window.location.search).get("experimentVariant");

  if (variantOverride === "control" || variantOverride === "message" || variantOverride === "callout") {
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

function pickChatAppointmentPlaceRecommendationVariant(): ChatAppointmentPlaceRecommendationVariant {
  const variantOverride = getDevVariantOverride();

  if (variantOverride) {
    return variantOverride;
  }

  const bucket = Math.random();

  if (bucket < 1 / 3) {
    return "control";
  }

  if (bucket < 2 / 3) {
    return "message";
  }

  return "callout";
}

function createVisitorExperimentContext(): VisitorExperimentContext {
  return {
    userId: createAnonymousVisitorId(),
    appVersion: packageJson.version,
    experiment: {
      id: CHAT_APPOINTMENT_PLACE_RECOMMENDATION_EXPERIMENT_ID,
      iteration: CHAT_APPOINTMENT_PLACE_RECOMMENDATION_ITERATION,
      variant: pickChatAppointmentPlaceRecommendationVariant(),
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

export function getChatAppointmentPlaceRecommendationVariant() {
  return getDevVariantOverride() ?? ensureVisitorExperimentContext()?.experiment.variant;
}

export function resetVisitorExperimentContextForTests() {
  visitorExperimentContext = null;

  if (typeof window !== "undefined") {
    window.localStorage.removeItem(LEGACY_VISITOR_EXPERIMENT_STORAGE_KEY);
    window.localStorage.removeItem(PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY);
    window.localStorage.removeItem(VISITOR_EXPERIMENT_STORAGE_KEY);
  }
}
