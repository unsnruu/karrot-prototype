"use client";

function compactProperties(properties: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(properties).filter(([, value]) => value !== undefined));
}

export function buildElementClickedEventProperties({
  screenName,
  targetName,
  path,
  destinationPath,
}: {
  screenName: string;
  targetName: string;
  path?: string;
  destinationPath?: string;
  targetType?: string;
  surface?: string;
  queryString?: string;
  targetId?: string;
  targetPosition?: number;
}) {
  return compactProperties({
    screen_name: screenName,
    target_name: targetName,
    path,
    destination_path: destinationPath,
  });
}
