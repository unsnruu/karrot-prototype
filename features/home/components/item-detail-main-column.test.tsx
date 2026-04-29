import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ItemDetailMainColumn } from "@/features/home/components/item-detail-main-column";
import { resetVisitorExperimentContextForTests } from "@/lib/analytics/visitor-experiment";

vi.mock("next/navigation", () => ({
  usePathname: () => "/home/items/item-1",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/lib/analytics/amplitude", () => ({
  trackEvent: vi.fn(),
}));

describe("ItemDetailMainColumn", () => {
  const renderItemDetail = () =>
    render(
      React.createElement(ItemDetailMainColumn, {
        adItem: undefined,
        item: {
          chats: 1,
          condition: "중고",
          description: "테스트 설명",
          distance: "도보 3분",
          id: "item-1",
          image: "/test-item.webp",
          likes: 2,
          meetupAddress: "서울 마포구 합정동",
          meetupHint: "합정역 2번 출구",
          meetupLat: 37.55,
          meetupLng: 126.91,
          postedAt: "방금",
          priceLabel: "10,000원",
          sellerId: "seller-1",
          sellingPoints: ["디지털기기"],
          slug: "item-1",
          title: "테스트 상품",
          town: "합정동",
          trustLabel: "신뢰할 수 있는 판매자",
          trustNote: "응답이 빨라요",
        },
        recommendationItems: [],
        returnTo: "/home",
        seller: {
          avatar: "/avatar.webp",
          badges: [],
          id: "seller-1",
          mannerScore: 36.5,
          name: "당근이",
          repeatDeals: 3,
          responseRate: 92,
          town: "합정동",
        },
      }),
    );

  beforeEach(() => {
    localStorage.clear();
    resetVisitorExperimentContextForTests();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("shows the baseline meetup location map", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.2);

    renderItemDetail();

    expect(await screen.findByText("거래 희망 장소")).toBeInTheDocument();
    expect(screen.getByText("지도 보기")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /지도 보기/ })).toHaveAttribute(
      "href",
      "/home/items/item-1/location?returnTo=%2Fhome",
    );
    expect(screen.getByText("서울 마포구 합정동")).toBeInTheDocument();
    expect(screen.getByText("도보 3분 근처에서 거래할 수 있어요")).toBeInTheDocument();
    expect(screen.queryByText("거래 장소 근처의 방문할 만한 곳이에요")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /구경하기/i })).not.toBeInTheDocument();
  });

  it("connects the meetup location map to town map for the v4 combined variant", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.8);

    renderItemDetail();

    expect(await screen.findByText("거래 희망 장소")).toBeInTheDocument();
    expect(screen.getByText("약속 장소 주변도 둘러보기")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /약속 장소 주변도 둘러보기/ })).toHaveAttribute(
      "href",
      "/town-map/search/results?query=%ED%95%A9%EC%A0%95%EC%97%AD+2%EB%B2%88+%EC%B6%9C%EA%B5%AC&returnTo=%2Fhome%2Fitems%2Fitem-1%3FreturnTo%3D%252Fhome&entrySource=item_detail",
    );
  });
});
