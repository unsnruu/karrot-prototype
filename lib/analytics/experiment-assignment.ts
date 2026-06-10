import packageJson from "@/package.json";

export const VISITOR_EXPERIMENT_STORAGE_KEY = "karrot_visitor_experiment_context.v11";
export const VISITOR_EXPERIMENT_COOKIE_KEY = "karrot_visitor_experiment_context_v11";

export const ACTIVE_EXPERIMENT_ID = "none";
export const ACTIVE_EXPERIMENT_ITERATION = "1";
export const ACTIVE_EXPERIMENT_VARIANTS = ["none"] as const;

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

export function createAnonymousVisitorId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `anon_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function hashString(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

export function pickVisitorExperimentVariant(userId: string): VisitorExperimentVariant {
  const variantIndex = hashString(userId) % ACTIVE_EXPERIMENT_VARIANTS.length;
  return ACTIVE_EXPERIMENT_VARIANTS[variantIndex] ?? ACTIVE_EXPERIMENT_VARIANTS[0];
}

export function createVisitorExperimentContext(userId = createAnonymousVisitorId()): VisitorExperimentContext {
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

export function createVisitorExperimentContextForVariant(
  variant: VisitorExperimentVariant,
  userId = createAnonymousVisitorId(),
): VisitorExperimentContext {
  return {
    userId,
    appVersion: packageJson.version,
    experiment: {
      id: ACTIVE_EXPERIMENT_ID,
      iteration: ACTIVE_EXPERIMENT_ITERATION,
      variant,
    },
  };
}

export function isVisitorExperimentVariant(value: unknown): value is VisitorExperimentVariant {
  return typeof value === "string" && ACTIVE_EXPERIMENT_VARIANTS.includes(value as (typeof ACTIVE_EXPERIMENT_VARIANTS)[number]);
}

export function parseVisitorExperimentContext(rawContext: string | null | undefined): VisitorExperimentContext | null {
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
