import { describe, expect, it, vi } from "vitest";

vi.unmock("@/components/ui/app-image");

import { resolveFallbackSrc, shouldBypassImageOptimization } from "@/components/ui/app-image";

describe("shouldBypassImageOptimization", () => {
  it("bypasses optimization for Supabase public storage URLs", () => {
    expect(
      shouldBypassImageOptimization(
        "https://udazzhluazlmcsbdbhzo.supabase.co/storage/v1/object/public/home-native-ads/cafe/cafe-ad-01.webp",
      ),
    ).toBe(true);
  });

  it("bypasses optimization for proxied Supabase storage URLs", () => {
    expect(
      shouldBypassImageOptimization(
        "https://ubtagudazzhluazlmcsbdbhzo8-8supabase8-8co.p.useberry.com/storage/v1/object/public/home-native-ads/cafe/cafe-ad-01.webp",
      ),
    ).toBe(true);
  });

  it("does not bypass optimization for unrelated remote URLs", () => {
    expect(shouldBypassImageOptimization("https://images.unsplash.com/photo-123")).toBe(false);
  });
});

describe("resolveFallbackSrc", () => {
  it("uses a transparent fallback for decorative images", () => {
    expect(resolveFallbackSrc("https://www.figma.com/api/mcp/asset/example", "")).toContain("data:image/gif");
  });

  it("uses the local placeholder for content images", () => {
    expect(resolveFallbackSrc("https://www.figma.com/api/mcp/asset/example", "동네지도 카드 이미지")).toBe(
      "/images/fallback-placeholder.webp",
    );
  });
});
