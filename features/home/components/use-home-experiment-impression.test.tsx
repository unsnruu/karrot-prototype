import React from "react";
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useHomeExperimentImpression } from "@/features/home/components/use-home-experiment-impression";

const amplitudeMocks = vi.hoisted(() => ({
  trackEvent: vi.fn(),
}));

vi.mock("@/lib/analytics/amplitude", () => amplitudeMocks);

class MockIntersectionObserver {
  static latestCallback: IntersectionObserverCallback | null = null;

  constructor(callback: IntersectionObserverCallback) {
    MockIntersectionObserver.latestCallback = callback;
  }

  disconnect() {}

  observe() {}

  unobserve() {}

  takeRecords() {
    return [];
  }
}

function TestComponent() {
  const ref = useHomeExperimentImpression({
    path: "/home",
    screen_name: "home",
    surface: "top_carousel",
    target_id: "ad-1",
    target_name: "home_native_ad",
    target_type: "ad",
  });

  return React.createElement("div", { ref });
}

describe("useHomeExperimentImpression", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  });

  it("tracks ad exposure as element_exposed when the element intersects", () => {
    render(React.createElement(TestComponent));

    MockIntersectionObserver.latestCallback?.(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );

    expect(amplitudeMocks.trackEvent).toHaveBeenCalledWith("element_exposed", {
      path: "/home",
      screen_name: "home",
      surface: "top_carousel",
      target_id: "ad-1",
      target_name: "home_native_ad",
      target_type: "ad",
    });
  });
});
