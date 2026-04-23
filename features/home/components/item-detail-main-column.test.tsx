import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
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
  beforeEach(() => {
    localStorage.clear();
    resetVisitorExperimentContextForTests();
    vi.restoreAllMocks();
  });

  it("hides nearby businesses in the as-is variant", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.2);

    render(
      React.createElement(ItemDetailMainColumn, {
        adItem: undefined,
        detailHref: "/home/items/item-1",
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
        nearbyBusinesses: [
          {
            category: "카페",
            id: "business-1",
            image: "/business-1.webp",
            name: "근처 업체",
            rating: 4.8,
            regularCount: 12,
            townLabel: "합정동",
          },
        ],
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

    await waitFor(() => {
      expect(screen.queryByText("근처 업체")).not.toBeInTheDocument();
    });
  });

  it("shows nearby businesses in the carousel variant", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.8);

    render(
      React.createElement(ItemDetailMainColumn, {
        adItem: undefined,
        detailHref: "/home/items/item-1",
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
        nearbyBusinesses: [
          {
            category: "카페",
            id: "business-1",
            image: "/business-1.webp",
            name: "근처 업체",
            rating: 4.8,
            regularCount: 12,
            townLabel: "합정동",
          },
        ],
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

    expect(await screen.findByText("거래 장소 근처의 방문할 만한 곳이에요")).toBeInTheDocument();
    expect(screen.getByText("근처 업체")).toBeInTheDocument();
    expect(screen.getByText("구경하기")).toBeInTheDocument();
  });
});
