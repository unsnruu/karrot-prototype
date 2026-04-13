export const tabRootPaths = {
  home: "/home",
  chat: "/chat",
  community: "/community",
  "town-map": "/town-map",
  "my-karrot": "/my-karrot",
} as const;

export type TabKey = keyof typeof tabRootPaths;

export function isTabKey(value: string | undefined): value is TabKey {
  return typeof value === "string" && value in tabRootPaths;
}

export function resolveTabHref(tab: string | undefined, fallback: string) {
  return isTabKey(tab) ? tabRootPaths[tab] : fallback;
}

export function appendTabQuery(href: string, tab: TabKey) {
  const separator = href.includes("?") ? "&" : "?";
  return `${href}${separator}tab=${tab}`;
}
