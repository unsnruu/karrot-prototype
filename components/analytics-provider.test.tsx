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
});
