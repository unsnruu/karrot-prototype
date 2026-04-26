"use client";

import { trackEvent } from "@/lib/analytics/amplitude";

function compactProperties(properties: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(properties).filter(([, value]) => value !== undefined));
}

export type ElementClickedEventPropertiesInput = {
  screenName: string;
  targetName: string;
  path?: string;
  destinationPath?: string;
  targetType?: string;
  surface?: string;
  queryString?: string;
  targetId?: string;
  targetPosition?: number;
  query?: string;
  entrySource?: string;
};

export function buildElementClickedEventProperties({
  screenName,
  targetName,
  path,
  destinationPath,
  targetType,
  surface,
  queryString,
  targetId,
  targetPosition,
  query,
  entrySource,
}: ElementClickedEventPropertiesInput) {
  return compactProperties({
    screen_name: screenName,
    target_name: targetName,
    path,
    destination_path: destinationPath,
    target_type: targetType,
    surface,
    query_string: queryString,
    target_id: targetId,
    target_position: targetPosition,
    query,
    entry_source: entrySource,
  });
}

export function trackElementClicked(input: ElementClickedEventPropertiesInput) {
  trackEvent("element_clicked", buildElementClickedEventProperties(input));
}
