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

export function isSafeLocalHref(value: string | undefined): value is string {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//");
}

export function resolveReturnHref(returnTo: string | undefined, fallback: string) {
  return isSafeLocalHref(returnTo) ? returnTo : fallback;
}

export function appendNavigationQuery(
  href: string,
  options: {
    tab?: TabKey;
    returnTo?: string;
  },
) {
  const params = new URLSearchParams();

  if (options.tab) {
    params.set("tab", options.tab);
  }

  if (isSafeLocalHref(options.returnTo)) {
    params.set("returnTo", options.returnTo);
  }

  const query = params.toString();

  if (!query) {
    return href;
  }

  const separator = href.includes("?") ? "&" : "?";
  return `${href}${separator}${query}`;
}
