"use client";

const LOCALLY_TRACKED_SCREEN_PATHS = new Set([
  "/home/sell/photos",
  "/home/sell/write",
  "/home/sell/price",
  "/home/sell/location",
  "/home/sell/preview",
]);

function compactProperties(properties: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(properties).filter(([, value]) => value !== undefined));
}

export function getScreenName(pathname: string) {
  if (pathname === "/") {
    return "root";
  }

  if (pathname === "/home") {
    return "home";
  }

  if (pathname === "/community") {
    return "community";
  }

  if (pathname.startsWith("/community/")) {
    return "community_post_detail";
  }

  if (pathname === "/town-map") {
    return "town_map";
  }

  if (pathname === "/town-map/search") {
    return "town_map_search";
  }

  if (pathname.startsWith("/town-map/businesses/")) {
    return "town_map_business_detail";
  }

  if (pathname === "/chat") {
    return "chat";
  }

  if (pathname.startsWith("/chat/") && pathname.endsWith("/appointment/location")) {
    return "chat_appointment_location";
  }

  if (pathname.startsWith("/chat/") && pathname.endsWith("/appointment")) {
    return "chat_appointment";
  }

  if (pathname.startsWith("/chat/")) {
    return "chat_detail";
  }

  if (pathname === "/my-karrot") {
    return "my_karrot";
  }

  if (pathname === "/home/services") {
    return "home_services";
  }

  if (pathname === "/home/sell") {
    return "sell_entry";
  }

  if (pathname === "/home/sell/photos") {
    return "sell_photos";
  }

  if (pathname === "/home/sell/write") {
    return "sell_write";
  }

  if (pathname === "/home/sell/price") {
    return "sell_price";
  }

  if (pathname === "/home/sell/location") {
    return "sell_location";
  }

  if (pathname === "/home/sell/preview") {
    return "sell_preview";
  }

  if (pathname.startsWith("/home/items/") && pathname.endsWith("/location")) {
    return "item_location";
  }

  if (pathname.startsWith("/home/items/")) {
    return "item_detail";
  }

  const experimentMatch = pathname.match(/^\/exp\/(a|b|c|d)\/(.+)$/);
  if (experimentMatch) {
    const [, variant, screen] = experimentMatch;
    return `exp_${variant}_${screen.replaceAll("/", "_")}`;
  }

  return pathname.replaceAll("/", "_").replace(/^_+/, "") || "unknown";
}

export function buildScreenViewedEventProperties({
  pathname,
  queryString,
  additionalProperties,
}: {
  pathname: string;
  queryString: string;
  additionalProperties?: Record<string, unknown>;
}) {
  return compactProperties({
    path: pathname,
    query_string: queryString || undefined,
    screen_name: getScreenName(pathname),
    ...additionalProperties,
  });
}

export function isScreenViewedTrackedLocally(pathname: string) {
  return LOCALLY_TRACKED_SCREEN_PATHS.has(pathname);
}
