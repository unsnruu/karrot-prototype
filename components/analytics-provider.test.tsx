import React from "react";
import { render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { resetVisitorExperimentContextForTests } from "@/lib/analytics/visitor-experiment";

const navigationState = vi.hoisted(() => ({
  pathname: "/home",
  searchParams: new URLSearchParams("category=%EB%94%94%EC%A7%80%ED%84%B8%EA%B8%B0%EA%B8%B0"),
}));

const amplitudeMocks = vi.hoisted(() => {
  const track = vi.fn();
  const initAll = vi.fn();
  const setUserId = vi.fn();
  const identify = vi.fn();

  class Identify {
    set = vi.fn().mockReturnThis();
  }

  return { Identify, identify, initAll, setUserId, track };
});

vi.mock("next/navigation", () => ({
  usePathname: () => navigationState.pathname,
  useSearchParams: () => navigationState.searchParams,
}));

vi.mock("@amplitude/unified", () => amplitudeMocks);

describe("AnalyticsProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    resetVisitorExperimentContextForTests();
    vi.clearAllMocks();
    navigationState.pathname = "/home";
    navigationState.searchParams = new URLSearchParams("category=%EB%94%94%EC%A7%80%ED%84%B8%EA%B8%B0%EA%B8%B0");
    vi.spyOn(Math, "random").mockReturnValue(0.9);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sends screen_viewed with common properties for home experiment screens", async () => {
    render(React.createElement(AnalyticsProvider));

    await waitFor(() => {
      expect(amplitudeMocks.track).toHaveBeenCalledWith(
        "screen_viewed",
        expect.objectContaining({
          path: "/home",
          query_string: "category=%EB%94%94%EC%A7%80%ED%84%B8%EA%B8%B0%EA%B8%B0",
          screen_name: "home",
          app_version: "1.1",
          experiment_id: "item_detail_nearby_business_entry",
          iteration: "2",
          variant: "carousel_relocation",
        }),
      );
    });
  });

  it("sends screen_viewed with common properties for developing screens", async () => {
    navigationState.pathname = "/developing";
    navigationState.searchParams = new URLSearchParams("feature=%EC%83%81%ED%92%88%20%EA%B3%B5%EC%9C%A0%ED%95%98%EA%B8%B0&returnTo=%2Fhome");

    render(React.createElement(AnalyticsProvider));

    await waitFor(() => {
      expect(amplitudeMocks.track).toHaveBeenCalledWith(
        "screen_viewed",
        expect.objectContaining({
          path: "/developing",
          query_string: "feature=%EC%83%81%ED%92%88+%EA%B3%B5%EC%9C%A0%ED%95%98%EA%B8%B0&returnTo=%2Fhome",
          screen_name: "developing",
          app_version: "1.1",
          experiment_id: "item_detail_nearby_business_entry",
          iteration: "2",
          variant: "carousel_relocation",
        }),
      );
    });
  });

  it("keeps only common properties on screen_viewed when home experiment traffic enters town map", async () => {
    navigationState.pathname = "/town-map";
    navigationState.searchParams = new URLSearchParams(
      "entry_source=home_native_ad&entry_surface=top_carousel&entry_target_id=ad-1&entry_target_position=2&entry_target_name=home_native_ad&entry_target_type=ad",
    );

    render(React.createElement(AnalyticsProvider));

    await waitFor(() => {
      expect(amplitudeMocks.track).toHaveBeenCalledWith(
        "screen_viewed",
        expect.objectContaining({
          path: "/town-map",
          query_string:
            "entry_source=home_native_ad&entry_surface=top_carousel&entry_target_id=ad-1&entry_target_position=2&entry_target_name=home_native_ad&entry_target_type=ad",
          screen_name: "town_map",
          app_version: "1.1",
          experiment_id: "item_detail_nearby_business_entry",
          iteration: "2",
          variant: "carousel_relocation",
        }),
      );
    });
  });
});
