import { describe, expect, it } from "vitest";
import { buildHomeExperimentTownMapHref } from "@/lib/analytics/home-experiment";

describe("buildHomeExperimentTownMapHref", () => {
  it("keeps town-map destinations shared while preserving experiment params", () => {
    expect(
      buildHomeExperimentTownMapHref({
        ad: {
          type: "native-ad",
          id: "home-native-ad-01",
          title: "동네지도 광고",
          feature: "동네지도",
          image: "/test.webp",
          destination: "동네지도",
          likes: 10,
          placementKey: "home_feed_inline",
          href: "/town-map",
        },
        index: 0,
        surface: "inline_card",
        variant: "b",
      }),
    ).toBe(
      "/town-map?exp_source=home_experiment&exp_variant=b&exp_surface=inline_card&exp_target_id=home-native-ad-01&exp_target_position=0&exp_target_name=home_native_ad&exp_target_type=ad",
    );
  });

  it("does not rewrite non town-map destinations", () => {
    expect(
      buildHomeExperimentTownMapHref({
        ad: {
          type: "native-ad",
          id: "home-native-ad-02",
          title: "동네생활 광고",
          feature: "동네 생활",
          image: "/test.webp",
          destination: "동네 생활",
          likes: 10,
          placementKey: "home_feed_inline",
          href: "/community",
        },
        index: 1,
        surface: "inline_banner",
        variant: "c",
      }),
    ).toBe("/community");
  });
});
