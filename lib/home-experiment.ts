export function buildExperimentHref(href: string) {
  if (href === "/") {
    return "/home";
  }

  return href;
}

export function resolveExperimentHomeHref() {
  return "/home";
}

export function resolveHomeHrefFromPathname(pathname?: string) {
  void pathname;
  return "/home";
}
