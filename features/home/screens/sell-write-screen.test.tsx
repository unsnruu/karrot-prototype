import React from "react";
import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SellWriteScreen } from "@/features/home/screens/sell-write-screen";
import { resetVisitorExperimentContextForTests } from "@/lib/analytics/visitor-experiment";

const navigationState = vi.hoisted(() => ({
  pathname: "/home/sell/write",
  searchParams: new URLSearchParams(),
  push: vi.fn(),
  replace: vi.fn(),
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

const sellFlowState = vi.hoisted(() => ({
  value: {
    draft: {
      acceptPriceSuggestion: false,
      description: "향수 일괄 판매",
      location: {
        address: "서울 마포구 합정동",
        distanceLabel: "도보 3분",
        label: "합정역 2번 출구",
        lat: 37.551,
        lng: 126.914,
      },
      photos: ["/photo-1.webp", "/photo-2.webp"],
      priceText: "75000",
      title: "향수 판매",
      tradeType: "sell",
    },
    hydrated: true,
    isReadyToSubmit: true,
    resetDraft: vi.fn(),
    setAcceptPriceSuggestion: vi.fn(),
    setDescription: vi.fn(),
    setLocation: vi.fn(),
    setPriceText: vi.fn(),
    setTitle: vi.fn(),
    setTradeType: vi.fn(),
    togglePhoto: vi.fn(),
  },
}));

vi.mock("next/navigation", () => ({
  usePathname: () => navigationState.pathname,
  useRouter: () => ({ push: navigationState.push, replace: navigationState.replace }),
  useSearchParams: () => navigationState.searchParams,
}));

vi.mock("@amplitude/unified", () => amplitudeMocks);

vi.mock("@/features/home/components/sell-flow-provider", () => ({
  useSellFlow: () => sellFlowState.value,
}));

describe("SellWriteScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    resetVisitorExperimentContextForTests();
    navigationState.pathname = "/home/sell/write";
    navigationState.searchParams = new URLSearchParams();
    vi.spyOn(Math, "random").mockReturnValue(0.2);
  });

  it("sends screen_viewed with common properties", async () => {
    render(React.createElement(SellWriteScreen));

    await waitFor(() => {
      expect(amplitudeMocks.track).toHaveBeenCalledWith(
        "screen_viewed",
        expect.objectContaining({
          path: "/home/sell/write",
          screen_name: "sell_write",
          app_version: "3.0",
          experiment_id: "chat_appointment_place_recommendation",
          iteration: "1",
          variant: "message",
        }),
      );
    });
  });
});
