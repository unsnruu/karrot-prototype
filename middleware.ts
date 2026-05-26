import { NextResponse, type NextRequest } from "next/server";
import {
  COMMUNITY_EXPERIMENT_ENTRY_VARIANTS,
  createVisitorExperimentContext,
  createVisitorExperimentContextForVariant,
  parseVisitorExperimentContext,
  VISITOR_EXPERIMENT_COOKIE_KEY,
} from "@/lib/analytics/experiment-assignment";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function parseCookieContext(rawContext: string | undefined) {
  if (!rawContext) {
    return null;
  }

  try {
    return parseVisitorExperimentContext(rawContext) ?? parseVisitorExperimentContext(decodeURIComponent(rawContext));
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const existingContext = parseCookieContext(request.cookies.get(VISITOR_EXPERIMENT_COOKIE_KEY)?.value);
  const forcedVariant = COMMUNITY_EXPERIMENT_ENTRY_VARIANTS[pathname as keyof typeof COMMUNITY_EXPERIMENT_ENTRY_VARIANTS];
  const context = forcedVariant
    ? createVisitorExperimentContextForVariant(forcedVariant, existingContext?.userId)
    : existingContext ?? createVisitorExperimentContext();
  const serializedContext = JSON.stringify(context);

  if (forcedVariant) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/community";

    const response = NextResponse.redirect(redirectUrl);

    response.cookies.set(VISITOR_EXPERIMENT_COOKIE_KEY, serializedContext, {
      maxAge: ONE_YEAR_SECONDS,
      path: "/",
      sameSite: "lax",
    });

    return response;
  }

  const requestHeaders = new Headers(request.headers);
  const currentCookieHeader = requestHeaders.get("cookie");
  const nextCookie = `${VISITOR_EXPERIMENT_COOKIE_KEY}=${encodeURIComponent(serializedContext)}`;

  requestHeaders.set("cookie", currentCookieHeader ? `${currentCookieHeader}; ${nextCookie}` : nextCookie);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.cookies.set(VISITOR_EXPERIMENT_COOKIE_KEY, serializedContext, {
    maxAge: ONE_YEAR_SECONDS,
    path: "/",
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icons|images).*)"],
};
