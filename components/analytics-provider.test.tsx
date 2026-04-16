import React from "react";
import { render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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
  let currentNow = 0;

  beforeEach(() => {
    currentNow = new Date("2026-04-16T00:00:00.000Z").getTime();
    vi.spyOn(Date, "now").mockImplementation(() => currentNow);
    localStorage.clear();
    vi.clearAllMocks();
    navigationState.pathname = "/home";
    navigationState.searchParams = new URLSearchParams("category=%EB%94%94%EC%A7%80%ED%84%B8%EA%B8%B0%EA%B8%B0&variant=b");
  });

  afterEach(() => {
    vi.restoreAllMocks();
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

  it("sends screen_exited with duration when the route changes", async () => {
    navigationState.pathname = "/community";
    navigationState.searchParams = new URLSearchParams();

    const { rerender } = render(React.createElement(AnalyticsProvider));

    await waitFor(() => {
      expect(amplitudeMocks.track).toHaveBeenCalledWith("screen_viewed", {
        path: "/community",
        screen_name: "community",
      });
    });

    currentNow = new Date("2026-04-16T00:00:01.500Z").getTime();
    navigationState.pathname = "/chat";
    navigationState.searchParams = new URLSearchParams();
    rerender(React.createElement(AnalyticsProvider));

    await waitFor(() => {
      expect(amplitudeMocks.track).toHaveBeenCalledWith("screen_exited", {
        duration_ms: 1500,
        exit_reason: "route_change",
        path: "/community",
        screen_name: "community",
      });
    });
  });
});
