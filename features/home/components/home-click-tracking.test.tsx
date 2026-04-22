import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HomeFab } from "@/features/home/components/home-fab";
import { HomeHeader } from "@/features/home/components/home-header";
import { MarketplaceListItem } from "@/features/home/components/marketplace-list-item";

const navigationState = vi.hoisted(() => ({
  pathname: "/home",
  searchParams: new URLSearchParams("category=%EB%94%94%EC%A7%80%ED%84%B8%EA%B8%B0%EA%B8%B0"),
}));

const amplitudeMocks = vi.hoisted(() => ({
  trackEvent: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => navigationState.pathname,
  useSearchParams: () => navigationState.searchParams,
}));

vi.mock("@/lib/analytics/amplitude", () => amplitudeMocks);

describe("home click tracking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    navigationState.pathname = "/home";
    navigationState.searchParams = new URLSearchParams("category=%EB%94%94%EC%A7%80%ED%84%B8%EA%B8%B0%EA%B8%B0");
  });

  it("tracks marketplace item clicks as element_clicked", () => {
    render(
      React.createElement(MarketplaceListItem, {
        category: "디지털기기",
        item: {
          chats: 3,
          distance: "도보 3분",
          href: "/home/items/item-1",
          id: "item-1",
          image: "/test-item.webp",
          likes: 5,
          postedAt: "방금",
          priceLabel: "10,000원",
          slug: "item-1",
          title: "테스트 상품",
          town: "합정동",
          type: "marketplace-item",
        },
        position: 2,
      }),
    );

    fireEvent.click(screen.getByRole("link", { name: /테스트 상품/ }));

    expect(amplitudeMocks.trackEvent).toHaveBeenCalledWith("element_clicked", expect.objectContaining({
      destination_path: "/home/items/item-1?returnTo=%2Fhome%3Fcategory%3D%25EB%2594%2594%25EC%25A7%2580%25ED%2584%25B8%25EA%25B8%25B0%25EA%25B8%25B0",
      path: "/home",
      screen_name: "home",
      target_name: "home_item_card",
    }));
  });

  it("keeps the current home path as returnTo when opening item detail", () => {
    navigationState.pathname = "/home";
    navigationState.searchParams = new URLSearchParams("category=%EB%94%94%EC%A7%80%ED%84%B8%EA%B8%B0%EA%B8%B0");

    render(
      React.createElement(MarketplaceListItem, {
        category: "디지털기기",
        item: {
          chats: 3,
          distance: "도보 3분",
          href: "/home/items/item-1",
          id: "item-1",
          image: "/test-item.webp",
          likes: 5,
          postedAt: "방금",
          priceLabel: "10,000원",
          slug: "item-1",
          title: "테스트 상품",
          town: "합정동",
          type: "marketplace-item",
        },
        position: 2,
      }),
    );

    const itemLinks = screen.getAllByRole("link", { name: /테스트 상품/ });

    expect(itemLinks[itemLinks.length - 1]).toHaveAttribute(
      "href",
      "/home/items/item-1?returnTo=%2Fhome%3Fcategory%3D%25EB%2594%2594%25EC%25A7%2580%25ED%2584%25B8%25EA%25B8%25B0%25EA%25B8%25B0",
    );
  });

  it("tracks home category clicks as element_clicked", () => {
    render(
      React.createElement(HomeHeader, {
        categories: [{ label: "전체" }, { label: "디지털기기" }],
        selectedCategory: "전체",
      }),
    );

    fireEvent.click(screen.getByRole("link", { name: "디지털기기" }));

    expect(amplitudeMocks.trackEvent).toHaveBeenCalledWith("element_clicked", expect.objectContaining({
      destination_path: "/home?category=%EB%94%94%EC%A7%80%ED%84%B8%EA%B8%B0%EA%B8%B0",
      path: "/home",
      screen_name: "home",
      target_name: "home_category_chip",
    }));
  });

  it("tracks home fab trigger and action clicks as element_clicked", () => {
    render(React.createElement(HomeFab));

    fireEvent.click(screen.getByRole("button", { name: "새 글 작성" }));

    expect(amplitudeMocks.trackEvent).toHaveBeenCalledWith("element_clicked", expect.objectContaining({
      path: "/home",
      screen_name: "home",
      target_name: "home_fab_trigger_open_menu",
    }));

    fireEvent.click(screen.getByRole("menuitem", { name: /내 물건 팔기/i }));

    expect(amplitudeMocks.trackEvent).toHaveBeenCalledWith("element_clicked", expect.objectContaining({
      destination_path: "/home/sell/photos",
      path: "/home",
      screen_name: "home",
      target_name: "home_sell_fab_start_sell",
    }));
  });
});
