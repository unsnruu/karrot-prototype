import { NextResponse, type NextRequest } from "next/server";
import { homeExperimentVariants, isHomeExperimentVariant, type HomeExperimentVariant } from "@/lib/home-experiment";

const HOME_EXPERIMENT_COOKIE = "home-experiment-variant";

function pickVariant(): HomeExperimentVariant {
  const randomIndex = Math.floor(Math.random() * homeExperimentVariants.length);
  return homeExperimentVariants[randomIndex] ?? "a";
}

function resolveVariantFromRequest(request: NextRequest): HomeExperimentVariant {
  const variantFromQuery = request.nextUrl.searchParams.get("variant") ?? undefined;

  if (isHomeExperimentVariant(variantFromQuery)) {
    return variantFromQuery;
  }

  const variantFromCookie = request.cookies.get(HOME_EXPERIMENT_COOKIE)?.value;

  if (isHomeExperimentVariant(variantFromCookie)) {
    return variantFromCookie;
  }

  return pickVariant();
}

function buildExperimentHomeUrl(request: NextRequest, variant: HomeExperimentVariant) {
  const nextUrl = request.nextUrl.clone();
  nextUrl.pathname = `/exp/${variant}/home`;
  nextUrl.searchParams.delete("variant");
  return nextUrl;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname !== "/" && pathname !== "/home") {
    return NextResponse.next();
  }

  const variant = resolveVariantFromRequest(request);
  const redirectUrl = buildExperimentHomeUrl(request, variant);
  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set({
    name: HOME_EXPERIMENT_COOKIE,
    value: variant,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}

export const config = {
  matcher: ["/", "/home"],
};
