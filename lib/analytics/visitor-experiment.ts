"use client";

import packageJson from "@/package.json";

const LEGACY_VISITOR_EXPERIMENT_STORAGE_KEY = "karrot_visitor_experiment_context";
const VISITOR_EXPERIMENT_STORAGE_KEY = "karrot_visitor_experiment_context.v2";

export const MEETUP_LOCATION_MAP_EXPERIMENT_ID = "meetup_location_map_redesign";
export const MEETUP_LOCATION_MAP_ITERATION = "1";

export type MeetupLocationMapVariant = "control" | "map_redesign";

export type VisitorExperimentContext = {
  userId: string;
  appVersion: string;
  experiment: {
    id: string;
    iteration: string;
    variant: MeetupLocationMapVariant;
  };
};

let visitorExperimentContext: VisitorExperimentContext | null = null;

function createAnonymousVisitorId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `anon_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function pickMeetupLocationMapVariant(): MeetupLocationMapVariant {
  return Math.random() < 0.5 ? "control" : "map_redesign";
}

function createVisitorExperimentContext(): VisitorExperimentContext {
  return {
    userId: createAnonymousVisitorId(),
    appVersion: packageJson.version,
    experiment: {
      id: MEETUP_LOCATION_MAP_EXPERIMENT_ID,
      iteration: MEETUP_LOCATION_MAP_ITERATION,
      variant: pickMeetupLocationMapVariant(),
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

export function getMeetupLocationMapVariant() {
  return ensureVisitorExperimentContext()?.experiment.variant;
}

export function resetVisitorExperimentContextForTests() {
  visitorExperimentContext = null;

  if (typeof window !== "undefined") {
    window.localStorage.removeItem(LEGACY_VISITOR_EXPERIMENT_STORAGE_KEY);
    window.localStorage.removeItem(VISITOR_EXPERIMENT_STORAGE_KEY);
  }
}
