import React from "react";
import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AnalyticsProvider } from "@/components/analytics-provider";

const navigationState = vi.hoisted(() => ({
  pathname: "/home",
  searchParams: new URLSearchParams("category=%EB%94%94%EC%A7%80%ED%84%B8%EA%B8%B0%EA%B8%B0&variant=b"),
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
    vi.clearAllMocks();
    navigationState.pathname = "/home";
    navigationState.searchParams = new URLSearchParams("category=%EB%94%94%EC%A7%80%ED%84%B8%EA%B8%B0%EA%B8%B0&variant=b");
  });

  it("sends screen_viewed with experiment context for home experiment screens", async () => {
    render(React.createElement(AnalyticsProvider));

    await waitFor(() => {
      expect(amplitudeMocks.track).toHaveBeenCalledWith("screen_viewed", {
        category: "디지털기기",
        experiment_name: "home_to_town_map_entry",
        experiment_variant: "b",
        path: "/home",
        query_string: "category=%EB%94%94%EC%A7%80%ED%84%B8%EA%B8%B0%EA%B8%B0&variant=b",
        screen_name: "home",
      });
    });
  });

  it("sends screen_viewed with pending feature context for developing screens", async () => {
    navigationState.pathname = "/developing";
    navigationState.searchParams = new URLSearchParams("feature=%EC%83%81%ED%92%88%20%EA%B3%B5%EC%9C%A0%ED%95%98%EA%B8%B0&returnTo=%2Fhome");

    render(React.createElement(AnalyticsProvider));

    await waitFor(() => {
      expect(amplitudeMocks.track).toHaveBeenCalledWith("screen_viewed", {
        feature_label: "상품 공유하기",
        path: "/developing",
        query_string: "feature=%EC%83%81%ED%92%88+%EA%B3%B5%EC%9C%A0%ED%95%98%EA%B8%B0&returnTo=%2Fhome",
        return_to: "/home",
        screen_name: "developing",
        screen_type: "pending_feature",
      });
    });
  });
});
