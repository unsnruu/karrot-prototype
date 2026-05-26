"use client";

import packageJson from "@/package.json";

const LEGACY_VISITOR_EXPERIMENT_STORAGE_KEY = "karrot_visitor_experiment_context";
const PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY = "karrot_visitor_experiment_context.v2";
const PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY_V3 = "karrot_visitor_experiment_context.v3";
const PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY_V4 = "karrot_visitor_experiment_context.v4";
const PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY_V5 = "karrot_visitor_experiment_context.v5";
const PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY_V6 = "karrot_visitor_experiment_context.v6";
const VISITOR_EXPERIMENT_STORAGE_KEY = "karrot_visitor_experiment_context.v7";

export const ACTIVE_EXPERIMENT_ID = "community_post_list_preview";
export const ACTIVE_EXPERIMENT_ITERATION = "1";
export const ACTIVE_EXPERIMENT_VARIANTS = ["one_line_content", "two_line_content", "ai_summary", "full_content"] as const;

export type VisitorExperimentVariant = (typeof ACTIVE_EXPERIMENT_VARIANTS)[number];

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

function createAnonymousVisitorId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `anon_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function hashString(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function pickVisitorExperimentVariant(userId: string): VisitorExperimentVariant {
  const variantIndex = hashString(userId) % ACTIVE_EXPERIMENT_VARIANTS.length;
  return ACTIVE_EXPERIMENT_VARIANTS[variantIndex] ?? ACTIVE_EXPERIMENT_VARIANTS[0];
}

function createVisitorExperimentContext(): VisitorExperimentContext {
  const userId = createAnonymousVisitorId();

  return {
    userId,
    appVersion: packageJson.version,
    experiment: {
      id: ACTIVE_EXPERIMENT_ID,
      iteration: ACTIVE_EXPERIMENT_ITERATION,
      variant: pickVisitorExperimentVariant(userId),
    },
  };
}

function isVisitorExperimentVariant(value: unknown): value is VisitorExperimentVariant {
  return typeof value === "string" && ACTIVE_EXPERIMENT_VARIANTS.includes(value as VisitorExperimentVariant);
}

function readStoredVisitorExperimentContext(): VisitorExperimentContext | null {
  const rawContext = window.localStorage.getItem(VISITOR_EXPERIMENT_STORAGE_KEY);

  if (!rawContext) {
    return null;
  }

  try {
    const parsedContext = JSON.parse(rawContext) as Partial<VisitorExperimentContext>;

    if (
      typeof parsedContext.userId !== "string" ||
      parsedContext.appVersion !== packageJson.version ||
      parsedContext.experiment?.id !== ACTIVE_EXPERIMENT_ID ||
      parsedContext.experiment.iteration !== ACTIVE_EXPERIMENT_ITERATION ||
      !isVisitorExperimentVariant(parsedContext.experiment.variant)
    ) {
      return null;
    }

    return {
      userId: parsedContext.userId,
      appVersion: parsedContext.appVersion,
      experiment: {
        id: parsedContext.experiment.id,
        iteration: parsedContext.experiment.iteration,
        variant: parsedContext.experiment.variant,
      },
    };
  } catch {
    return null;
  }
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
  window.localStorage.removeItem(PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY_V5);
  window.localStorage.removeItem(PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY_V6);

  const storedContext = readStoredVisitorExperimentContext();

  if (storedContext) {
    visitorExperimentContext = storedContext;
    return storedContext;
  }

  const nextContext = createVisitorExperimentContext();
  window.localStorage.setItem(VISITOR_EXPERIMENT_STORAGE_KEY, JSON.stringify(nextContext));
  visitorExperimentContext = nextContext;

  return nextContext;
}

export function getVisitorExperimentVariant() {
  return ensureVisitorExperimentContext()?.experiment.variant ?? ACTIVE_EXPERIMENT_VARIANTS[0];
}

export function getEventExperimentProperties() {
  const context = ensureVisitorExperimentContext();

  if (!context) {
    return {};
  }

  return {
    user_id: context.userId,
    session_id: context.userId,
    app_version: context.appVersion,
    experiment_id: context.experiment.id,
    iteration: context.experiment.iteration,
    variant: context.experiment.variant,
  };
}

export function resetVisitorExperimentContextForTests() {
  visitorExperimentContext = null;

  if (typeof window !== "undefined") {
    window.localStorage.removeItem(LEGACY_VISITOR_EXPERIMENT_STORAGE_KEY);
    window.localStorage.removeItem(PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY);
    window.localStorage.removeItem(PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY_V3);
    window.localStorage.removeItem(PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY_V4);
    window.localStorage.removeItem(PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY_V5);
    window.localStorage.removeItem(PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY_V6);
    window.localStorage.removeItem(VISITOR_EXPERIMENT_STORAGE_KEY);
  }
}
