"use client";

import { trackEvent } from "@/lib/analytics/amplitude";

function compactProperties(properties: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(properties).filter(([, value]) => value !== undefined));
}

type ComponentInteractedEventPropertiesInput = {
  componentName: string;
  interactionType: string;
  screenName: string;
  surface: string;
  path?: string;
  entrySource?: string;
  targetId?: string;
};

export function buildComponentInteractedEventProperties({
  componentName,
  interactionType,
  screenName,
  surface,
  path,
  entrySource,
  targetId,
}: ComponentInteractedEventPropertiesInput) {
  return compactProperties({
    component_name: componentName,
    interaction_type: interactionType,
    screen_name: screenName,
    surface,
    path,
    entry_source: entrySource,
    target_id: targetId,
  });
}

export function trackComponentInteracted(input: ComponentInteractedEventPropertiesInput) {
  trackEvent("component_interacted", buildComponentInteractedEventProperties(input));
}
