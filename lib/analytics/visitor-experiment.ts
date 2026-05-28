"use client";

import {
  ACTIVE_EXPERIMENT_ID,
  ACTIVE_EXPERIMENT_ITERATION,
  ACTIVE_EXPERIMENT_VARIANTS,
  createVisitorExperimentContext,
  parseVisitorExperimentContext,
  pickVisitorExperimentVariant,
  VISITOR_EXPERIMENT_COOKIE_KEY,
  VISITOR_EXPERIMENT_STORAGE_KEY,
  type VisitorExperimentContext,
  type VisitorExperimentVariant,
} from "@/lib/analytics/experiment-assignment";

const LEGACY_VISITOR_EXPERIMENT_STORAGE_KEY = "karrot_visitor_experiment_context";
const PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY = "karrot_visitor_experiment_context.v2";
const PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY_V3 = "karrot_visitor_experiment_context.v3";
const PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY_V4 = "karrot_visitor_experiment_context.v4";
const PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY_V5 = "karrot_visitor_experiment_context.v5";
const PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY_V6 = "karrot_visitor_experiment_context.v6";
const PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY_V7 = "karrot_visitor_experiment_context.v7";
const PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY_V8 = "karrot_visitor_experiment_context.v8";

let visitorExperimentContext: VisitorExperimentContext | null = null;

function readStoredVisitorExperimentContext(): VisitorExperimentContext | null {
  return parseVisitorExperimentContext(window.localStorage.getItem(VISITOR_EXPERIMENT_STORAGE_KEY));
}

function readCookieVisitorExperimentContext(): VisitorExperimentContext | null {
  const cookieContext = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${VISITOR_EXPERIMENT_COOKIE_KEY}=`))
    ?.split("=")[1];

  try {
    return parseVisitorExperimentContext(cookieContext ? decodeURIComponent(cookieContext) : null);
  } catch {
    return null;
  }
}

function persistVisitorExperimentContext(context: VisitorExperimentContext) {
  const serializedContext = JSON.stringify(context);
  window.localStorage.setItem(VISITOR_EXPERIMENT_STORAGE_KEY, serializedContext);
  document.cookie = `${VISITOR_EXPERIMENT_COOKIE_KEY}=${encodeURIComponent(serializedContext)}; path=/; max-age=31536000; samesite=lax`;
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
  window.localStorage.removeItem(PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY_V7);
  window.localStorage.removeItem(PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY_V8);

  const cookieContext = readCookieVisitorExperimentContext();

  if (cookieContext) {
    persistVisitorExperimentContext(cookieContext);
    visitorExperimentContext = cookieContext;
    return cookieContext;
  }

  const storedContext = readStoredVisitorExperimentContext();

  if (storedContext) {
    persistVisitorExperimentContext(storedContext);
    visitorExperimentContext = storedContext;
    return storedContext;
  }

  const nextContext = createVisitorExperimentContext();
  persistVisitorExperimentContext(nextContext);
  visitorExperimentContext = nextContext;

  return nextContext;
}

export function buildVisitorExperimentContextFromSessionId(sessionId: string) {
  return createVisitorExperimentContext(sessionId);
}

export function getVisitorExperimentVariant() {
  return ensureVisitorExperimentContext()?.experiment.variant ?? ACTIVE_EXPERIMENT_VARIANTS[0];
}

export function getVisitorExperimentVariantForSessionId(sessionId: string) {
  return pickVisitorExperimentVariant(sessionId);
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
    window.localStorage.removeItem(PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY_V7);
    window.localStorage.removeItem(PREVIOUS_VISITOR_EXPERIMENT_STORAGE_KEY_V8);
    window.localStorage.removeItem(VISITOR_EXPERIMENT_STORAGE_KEY);
    document.cookie = `${VISITOR_EXPERIMENT_COOKIE_KEY}=; path=/; max-age=0; samesite=lax`;
  }
}
