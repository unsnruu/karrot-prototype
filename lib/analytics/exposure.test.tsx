import React from "react";
import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useExposureTracking } from "@/lib/analytics/exposure";

const trackEventMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/analytics/amplitude", () => ({
  trackEvent: trackEventMock,
}));

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];

  callback: IntersectionObserverCallback;
  observe = vi.fn();
  disconnect = vi.fn();

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }
}

function TestExposureTracker() {
  const ref = useExposureTracking<HTMLDivElement>({
    eventType: "component_exposed",
    eventProperties: {
      component_name: "important_module",
      screen_name: "home",
      surface: "feed",
    },
  });

  return <div ref={ref}>tracked</div>;
}

describe("useExposureTracking", () => {
  afterEach(() => {
    MockIntersectionObserver.instances = [];
    trackEventMock.mockReset();
    vi.unstubAllGlobals();
  });

  it("tracks exposure once after the threshold is reached", () => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

    render(<TestExposureTracker />);

    const observer = MockIntersectionObserver.instances[0];
    expect(observer.observe).toHaveBeenCalled();

    observer.callback([
      {
        intersectionRatio: 0.7,
        isIntersecting: true,
      } as IntersectionObserverEntry,
    ], observer as unknown as IntersectionObserver);

    observer.callback([
      {
        intersectionRatio: 1,
        isIntersecting: true,
      } as IntersectionObserverEntry,
    ], observer as unknown as IntersectionObserver);

    expect(trackEventMock).toHaveBeenCalledTimes(1);
    expect(trackEventMock).toHaveBeenCalledWith("component_exposed", {
      component_name: "important_module",
      screen_name: "home",
      surface: "feed",
    });
  });
});
