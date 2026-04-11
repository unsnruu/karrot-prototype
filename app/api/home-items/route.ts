import { NextRequest, NextResponse } from "next/server";
import { HOME_FEED_PAGE_SIZE } from "@/lib/marketplace";
import { getHomeFeedPage } from "@/lib/marketplace-data";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const offsetParam = Number(searchParams.get("offset") ?? 0);
  const limitParam = Number(searchParams.get("limit") ?? HOME_FEED_PAGE_SIZE);
  const categoryParam = searchParams.get("category") ?? undefined;

  const offset = Number.isFinite(offsetParam) ? Math.max(0, Math.floor(offsetParam)) : 0;
  const limit = Number.isFinite(limitParam) ? Math.max(1, Math.min(Math.floor(limitParam), HOME_FEED_PAGE_SIZE)) : HOME_FEED_PAGE_SIZE;

  const result = await getHomeFeedPage({ offset, limit, category: categoryParam });

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
