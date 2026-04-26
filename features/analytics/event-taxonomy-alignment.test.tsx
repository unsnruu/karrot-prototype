import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { ChatThreadRow } from "@/features/chat/components/chat-thread-row";
import { CommunityHeader } from "@/features/community/components/community-header";
import { ItemDetailChatButton } from "@/features/home/components/item-detail-chat-button";
import { TownMapScreen } from "@/features/town-map/screens/town-map-screen";
import { TownMapSearchScreen } from "@/features/town-map/screens/town-map-search-screen";

const navigationState = vi.hoisted(() => ({
  pathname: "/home",
  searchParams: new URLSearchParams(),
  push: vi.fn(),
}));

const amplitudeMocks = vi.hoisted(() => ({
  trackEvent: vi.fn(),
}));

const chatStorageMocks = vi.hoisted(() => ({
  ensureLocalChatThread: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => navigationState.pathname,
  useSearchParams: () => navigationState.searchParams,
  useRouter: () => ({
    push: navigationState.push,
  }),
}));

vi.mock("@/lib/analytics/amplitude", () => amplitudeMocks);
vi.mock("@/lib/local-chat-storage", () => chatStorageMocks);
vi.mock("@/components/ui/pending-feature-link", () => ({
  PendingFeatureLink: ({ children, onClick, ...props }: { children: React.ReactNode; onClick?: () => void }) =>
    React.createElement(
      "button",
      {
        type: "button",
        onClick,
        ...props,
      },
      children,
    ),
}));

vi.mock("@/features/town-map/components/town-map-bottom-sheet", () => ({
  TownMapBottomSheet: () => React.createElement("div", { "data-testid": "town-map-bottom-sheet" }),
}));

vi.mock("@/features/town-map/components/town-map-category-chip", () => ({
  TownMapCategoryChip: () => React.createElement("div", { "data-testid": "town-map-category-chip" }),
}));

vi.mock("@/features/town-map/components/town-map-kakao-map", () => ({
  TownMapKakaoMap: () => React.createElement("div", { "data-testid": "town-map-map" }),
}));

describe("event taxonomy alignment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    navigationState.pathname = "/home";
    navigationState.searchParams = new URLSearchParams();
  });

  it("tracks bottom navigation clicks as element_clicked", () => {
    render(React.createElement(BottomNav));

    fireEvent.click(screen.getByRole("link", { name: "커뮤니티" }));

    expect(amplitudeMocks.trackEvent).toHaveBeenCalledWith("element_clicked", expect.objectContaining({
      destination_path: "/community",
      path: "/home",
      screen_name: "home",
      target_name: "bottom_nav_tab",
    }));
  });

  it("keeps the home tab linked to the shared home route", () => {
    navigationState.pathname = "/home";

    render(React.createElement(BottomNav));

    const homeLinks = screen.getAllByRole("link", { name: "홈" });
    const townMapLinks = screen.getAllByRole("link", { name: "동네지도" });

    expect(homeLinks[homeLinks.length - 1]).toHaveAttribute("href", "/home");
    expect(townMapLinks[townMapLinks.length - 1]).toHaveAttribute("href", "/town-map");
  });

  it("tracks community tab clicks as element_clicked", () => {
    navigationState.pathname = "/community";
    navigationState.searchParams = new URLSearchParams("tab=town");

    render(
      React.createElement(CommunityHeader, {
        selectedTab: "town",
        selectedTopic: "all",
      }),
    );

    fireEvent.click(screen.getByRole("link", { name: "모임" }));

    expect(amplitudeMocks.trackEvent).toHaveBeenCalledWith("element_clicked", expect.objectContaining({
      destination_path: "/community?tab=meetup",
      path: "/community",
      screen_name: "community",
      target_name: "community_top_tab",
    }));
  });

  it("tracks chat thread opens as element_clicked", () => {
    navigationState.pathname = "/chat";

    render(
      React.createElement(ChatThreadRow, {
        thread: {
          avatarImage: "",
          href: "/chat/thread-1",
          id: "thread-1",
          lastMessage: "안녕하세요",
          name: "당근이",
          town: "합정동",
          updatedAt: "방금",
        },
      }),
    );

    fireEvent.click(screen.getByRole("link", { name: /당근이/ }));

    expect(amplitudeMocks.trackEvent).toHaveBeenCalledWith("element_clicked", expect.objectContaining({
      destination_path: "/chat/thread-1",
      path: "/chat",
      screen_name: "chat",
      target_name: "chat_thread_row",
    }));
  });

  it("tracks item detail chat button clicks as element_clicked", () => {
    navigationState.pathname = "/home/items/item-1";

    render(
      React.createElement(ItemDetailChatButton, {
        avatarImage: "/avatar.webp",
        chatHref: "/chat/item-1",
        chatKey: "chat-item-1",
        itemId: "item-1",
        sellerName: "당근이",
        town: "합정동",
      }),
    );

    fireEvent.click(screen.getByRole("button", { name: "채팅하기" }));

    expect(amplitudeMocks.trackEvent).toHaveBeenCalledWith("element_clicked", expect.objectContaining({
      destination_path: "/chat/item-1",
      path: "/home/items/item-1",
      screen_name: "item_detail",
      target_name: "item_detail_chat_button_open_chat",
    }));
    expect(chatStorageMocks.ensureLocalChatThread).toHaveBeenCalled();
    expect(navigationState.push).toHaveBeenCalledWith("/chat/item-1");
  });

  it("tracks town map search entry as element_clicked", () => {
    navigationState.pathname = "/town-map";
    navigationState.searchParams = new URLSearchParams("tab=town-map");

    render(React.createElement(TownMapScreen, { pins: [] }));

    fireEvent.click(screen.getByRole("link", { name: "업체 검색 화면 열기" }));

    expect(amplitudeMocks.trackEvent).toHaveBeenCalledWith("element_clicked", expect.objectContaining({
      destination_path: "/town-map/search?tab=town-map&returnTo=%2Ftown-map",
      path: "/town-map",
      screen_name: "town_map",
      target_name: "town_map_search_input",
    }));
  });

  it("tracks town map search history clear as element_clicked", () => {
    navigationState.pathname = "/town-map/search";
    navigationState.searchParams = new URLSearchParams("returnTo=%2Ftown-map");

    render(React.createElement(TownMapSearchScreen, { returnHref: "/town-map" }));

    fireEvent.click(screen.getByRole("button", { name: "전체 삭제" }));

    expect(amplitudeMocks.trackEvent).toHaveBeenCalledWith("element_clicked", expect.objectContaining({
      path: "/town-map/search",
      screen_name: "town_map_search",
      target_name: "town_map_search_history_clear",
    }));
  });

  it("routes town map recent search items into search results with tracking", () => {
    navigationState.pathname = "/town-map/search";
    navigationState.searchParams = new URLSearchParams("returnTo=%2Ftown-map");

    render(React.createElement(TownMapSearchScreen, { returnHref: "/town-map" }));

    fireEvent.click(screen.getAllByRole("button", { name: "거래" })[0]);

    expect(amplitudeMocks.trackEvent).toHaveBeenCalledWith("element_clicked", expect.objectContaining({
      destination_path: "/town-map/search/results?query=%EA%B1%B0%EB%9E%98&returnTo=%2Ftown-map&entrySource=town_map_search",
      path: "/town-map/search",
      query: "거래",
      screen_name: "town_map_search",
      target_name: "town_map_recent_search_item",
    }));
    expect(navigationState.push).toHaveBeenCalledWith(
      "/town-map/search/results?query=%EA%B1%B0%EB%9E%98&returnTo=%2Ftown-map&entrySource=town_map_search",
    );
  });
});
