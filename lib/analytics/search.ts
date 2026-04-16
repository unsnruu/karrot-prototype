"use client";

function compactProperties(properties: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(properties).filter(([, value]) => value !== undefined));
}

export function buildSearchEventProperties({
  screenName,
  path,
  queryString,
  searchName,
  surface,
  destinationPath,
  query,
  hasQuery,
  additionalProperties,
}: {
  screenName: string;
  path?: string;
  queryString?: string;
  searchName?: string;
  surface?: string;
  destinationPath?: string;
  query?: string;
  hasQuery?: boolean;
  additionalProperties?: Record<string, unknown>;
}) {
  return compactProperties({
    screen_name: screenName,
    path,
    query_string: queryString || undefined,
    search_name: searchName,
    surface,
    destination_path: destinationPath,
    query,
    has_query: hasQuery,
    ...additionalProperties,
  });
}
