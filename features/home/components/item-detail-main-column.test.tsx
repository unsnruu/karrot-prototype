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

  beforeEach(() => {
    localStorage.clear();
    resetVisitorExperimentContextForTests();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("shows nearby businesses with an orange cta button variant", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.2);

    renderItemDetail();

    expect(await screen.findAllByText("거래 장소 근처의 방문할 만한 곳이에요")).not.toHaveLength(0);
    const browseButton = screen.getByRole("link", { name: /구경하기/i });
    expect(browseButton).toHaveClass("bg-[#ff6600]");
    expect(browseButton).toHaveClass("text-white");
    expect(screen.getByText("도보 3분 근처에서 거래할 수 있어요").compareDocumentPosition(browseButton)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it("shows nearby businesses with a neutral cta button variant", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);

    renderItemDetail();

    expect(await screen.findAllByText("거래 장소 근처의 방문할 만한 곳이에요")).not.toHaveLength(0);
    const browseButton = screen.getByRole("link", { name: /구경하기/i });
    expect(browseButton).toHaveClass("bg-[#2a3038]");
    expect(browseButton).toHaveClass("text-white");
    expect(screen.getByText("도보 3분 근처에서 거래할 수 있어요").compareDocumentPosition(browseButton)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it("shows nearby businesses in the carousel relocation variant", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.9);

    renderItemDetail();

    expect(await screen.findAllByText("거래 장소 근처의 방문할 만한 곳이에요")).not.toHaveLength(0);
    const browseButton = screen.getByRole("link", { name: /구경하기/i });
    expect(browseButton).toHaveClass("border-black/10");
    expect(screen.getByText("도보 3분 근처에서 거래할 수 있어요").compareDocumentPosition(browseButton)).toBe(Node.DOCUMENT_POSITION_PRECEDING);
  });
});
