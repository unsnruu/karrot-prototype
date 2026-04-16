"use client";

function compactProperties(properties: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(properties).filter(([, value]) => value !== undefined));
}

export function buildElementExposedEventProperties({
  screenName,
  targetType,
  targetName,
  surface,
  path,
  queryString,
  targetId,
  targetPosition,
  additionalProperties,
}: {
  screenName: string;
  targetType: string;
  targetName: string;
  surface?: string;
  path?: string;
  queryString?: string;
  targetId?: string;
  targetPosition?: number;
  additionalProperties?: Record<string, unknown>;
}) {
  return compactProperties({
    screen_name: screenName,
    target_type: targetType,
    target_name: targetName,
    surface,
    path,
    query_string: queryString || undefined,
    target_id: targetId,
    target_position: targetPosition,
    ...additionalProperties,
  });
}
