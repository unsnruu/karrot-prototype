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

    expect(amplitudeMocks.trackEvent).toHaveBeenCalledWith("element_clicked", {
      destination_path: "/community",
      path: "/home",
      screen_name: "home",
      surface: "bottom_navigation",
      tab_label: "커뮤니티",
      target_id: "community",
      target_name: "bottom_nav_tab",
      target_type: "tab",
    });
  });

  it("keeps only the home tab variant-aware inside experiment home", () => {
    navigationState.pathname = "/exp/d/home";

    render(React.createElement(BottomNav));

    const homeLinks = screen.getAllByRole("link", { name: "홈" });
    const townMapLinks = screen.getAllByRole("link", { name: "동네지도" });

    expect(homeLinks[homeLinks.length - 1]).toHaveAttribute("href", "/exp/d/home");
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

    expect(amplitudeMocks.trackEvent).toHaveBeenCalledWith("element_clicked", {
      destination_path: "/community?tab=meetup",
      path: "/community",
      previous_tab: "town",
      screen_name: "community",
      surface: "header",
      target_id: "meetup",
      target_name: "community_top_tab",
      target_type: "tab",
    });
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

    expect(amplitudeMocks.trackEvent).toHaveBeenCalledWith("element_clicked", {
      counterparty_name: "당근이",
      destination_path: "/chat/thread-1",
      path: "/chat",
      screen_name: "chat",
      surface: "thread_list",
      target_id: "thread-1",
      target_name: "chat_thread_row",
      target_type: "list_item",
      town: "합정동",
    });
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

    expect(amplitudeMocks.trackEvent).toHaveBeenCalledWith("element_clicked", {
      chat_key: "chat-item-1",
      destination_path: "/chat/item-1",
      path: "/home/items/item-1",
      screen_name: "item_detail",
      seller_name: "당근이",
      surface: "sticky_footer",
      target_id: "item-1",
      target_name: "item_detail_chat_button_open_chat",
      target_type: "button",
      town: "합정동",
    });
    expect(chatStorageMocks.ensureLocalChatThread).toHaveBeenCalled();
    expect(navigationState.push).toHaveBeenCalledWith("/chat/item-1");
  });

  it("tracks town map search entry as search_opened", () => {
    navigationState.pathname = "/town-map";
    navigationState.searchParams = new URLSearchParams("tab=town-map");

    render(React.createElement(TownMapScreen, { pins: [] }));

    fireEvent.click(screen.getByRole("link", { name: "업체 검색 화면 열기" }));

    expect(amplitudeMocks.trackEvent).toHaveBeenCalledWith("search_opened", {
      destination_path: "/town-map/search?tab=town-map&returnTo=%2Ftown-map",
      path: "/town-map",
      screen_name: "town_map",
      search_name: "town_map_search_input",
      surface: "header",
    });
  });

  it("tracks town map search submit and history clear with search events", () => {
    navigationState.pathname = "/town-map/search";
    navigationState.searchParams = new URLSearchParams("returnTo=%2Ftown-map");

    render(React.createElement(TownMapSearchScreen, { returnHref: "/town-map" }));

    fireEvent.click(screen.getByRole("button", { name: "카페/간식" }));

    expect(amplitudeMocks.trackEvent).toHaveBeenCalledWith("search_submitted", {
      destination_path: "/developing?returnTo=%2Ftown-map&feature=%EB%8F%99%EB%84%A4%EC%A7%80%EB%8F%84%EC%97%90%EC%84%9C%20%EC%97%85%EC%B2%B4%20%EC%B0%BE%EA%B8%B0",
      has_query: true,
      path: "/town-map/search",
      query: "카페/간식",
      screen_name: "town_map_search",
      search_name: "town_map_search_input",
      surface: "search_screen",
    });

    fireEvent.click(screen.getByRole("button", { name: "전체 삭제" }));

    expect(amplitudeMocks.trackEvent).toHaveBeenCalledWith("search_history_cleared", {
      path: "/town-map/search",
      screen_name: "town_map_search",
      search_name: "town_map_search_input",
      surface: "recent_searches",
    });
  });
});
