import React from "react";
import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useScreenScrollMilestones } from "@/lib/analytics/screen-scroll";

const trackEventMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/analytics/amplitude", () => ({
  trackEvent: trackEventMock,
}));

function TestScreenScrollTracker() {
  useScreenScrollMilestones({
    screenName: "item_detail",
    path: "/home/items/item-1",
    milestones: [25, 50, 75],
  });

  return <div>tracked</div>;
}

describe("useScreenScrollMilestones", () => {
  afterEach(() => {
    trackEventMock.mockReset();
  });

  it("replays screen_viewed with scroll_reached when a milestone is crossed", () => {
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 500,
    });

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 0,
      writable: true,
    });

    Object.defineProperty(document.documentElement, "scrollHeight", {
      configurable: true,
      value: 2000,
    });

    Object.defineProperty(document.body, "scrollHeight", {
      configurable: true,
      value: 2000,
    });

    render(<TestScreenScrollTracker />);

    expect(trackEventMock).toHaveBeenCalledWith("screen_viewed", {
      path: "/home/items/item-1",
      screen_name: "item_detail",
      scroll_reached: 25,
    });

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 500,
      writable: true,
    });

    window.dispatchEvent(new Event("scroll"));

    expect(trackEventMock).toHaveBeenCalledWith("screen_viewed", {
      path: "/home/items/item-1",
      screen_name: "item_detail",
      scroll_reached: 50,
    });

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 1300,
      writable: true,
    });

    window.dispatchEvent(new Event("scroll"));

    expect(trackEventMock).toHaveBeenCalledWith("screen_viewed", {
      path: "/home/items/item-1",
      screen_name: "item_detail",
      scroll_reached: 75,
    });
    expect(trackEventMock).toHaveBeenCalledTimes(3);
  });
});
