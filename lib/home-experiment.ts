export const homeExperimentVariants = ["a", "b", "c"] as const;

export type HomeExperimentVariant = typeof homeExperimentVariants[number];

export function isHomeExperimentVariant(value: string | undefined): value is HomeExperimentVariant {
  return value === "a" || value === "b" || value === "c";
}

export function resolveHomeExperimentVariant(value: string | string[] | undefined): HomeExperimentVariant {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (isHomeExperimentVariant(candidate)) {
    return candidate;
  }

  return "a";
}

export function readHomeExperimentVariantFromPathname(pathname: string) {
  const match = pathname.match(/^\/exp\/(a|b|c)(?:\/|$)/);
  return match?.[1] as HomeExperimentVariant | undefined;
}

export function buildExperimentHref(href: string, variant?: HomeExperimentVariant) {
  if (!variant || !href.startsWith("/")) {
    return href;
  }

  if (href === "/") {
    return `/exp/${variant}/home`;
  }

  return `/exp/${variant}${href}`;
}

export function resolveExperimentHomeHref(variant?: HomeExperimentVariant) {
  return buildExperimentHref("/home", variant);
}

export function resolveHomeHrefFromPathname(pathname: string) {
  return resolveExperimentHomeHref(readHomeExperimentVariantFromPathname(pathname));
}
