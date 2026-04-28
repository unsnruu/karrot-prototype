import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ChatScreen } from "@/features/chat/screens/chat-screen";
import { resetVisitorExperimentContextForTests } from "@/lib/analytics/visitor-experiment";
import type { ChatAppointmentDraft } from "@/lib/chat-appointment";
import { resetLocalChatAppointmentsForTests } from "@/lib/local-chat-appointment-storage";

const routerMock = vi.hoisted(() => ({
  back: vi.fn(),
  push: vi.fn(),
  replace: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/chat/item-1",
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => routerMock,
}));

vi.mock("@seed-design/react", () => ({
  Callout: {
    Root: ({ asChild: _asChild, children, tone: _tone, ...props }: React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean; tone?: string }) =>
      React.createElement("div", props, children),
    Content: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) =>
      React.createElement("div", props, children),
    Title: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) =>
      React.createElement("span", props, children),
    Description: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) =>
      React.createElement("span", props, children),
    Link: ({ asChild: _asChild, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) =>
      React.createElement("span", props, children),
  },
}));

describe("ChatScreen experiment", () => {
  const completedAppointmentDraft: ChatAppointmentDraft = {
    createdAt: "오후 3:20",
    date: "오늘",
    location: "합정역 2번 출구",
    reminder: "약속 1시간 전",
    time: "오후 7:00",
  };

  const emptyAppointmentDraft: ChatAppointmentDraft = {
    createdAt: null,
    date: null,
    location: null,
    reminder: null,
    time: null,
  };

  const renderCompletedAppointmentChat = (appointmentDraft: ChatAppointmentDraft = completedAppointmentDraft) =>
    render(
      React.createElement(ChatScreen, {
        appointmentDraft,
        backHref: "/chat",
        chat: {
          buyerName: "새싹님",
          id: "chat-1",
          itemId: "item-1",
          lastSeen: "방금",
          messages: [],
          responseLabel: "보통 30분 이내 응답",
        },
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
        itemId: "item-1",
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
    routerMock.back.mockClear();
    routerMock.push.mockClear();
    routerMock.replace.mockClear();
    resetLocalChatAppointmentsForTests();
    resetVisitorExperimentContextForTests();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("shows the follow-up recommendation as a message card for the message variant", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.2);

    renderCompletedAppointmentChat();

    expect(await screen.findByText("약속을 만들었어요.")).toBeInTheDocument();
    expect(await screen.findByText("함께 방문해보세요")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "더 많은 업체 확인하기" })).toHaveAttribute(
      "href",
      "/town-map/search/results?query=%ED%95%A9%EC%A0%95%EC%97%AD+2%EB%B2%88+%EC%B6%9C%EA%B5%AC&returnTo=%2Fchat%2Fitem-1%3Ftab%3Dchat%26returnTo%3D%252Fchat&entrySource=chat_appointment",
    );
  });

  it("shows the follow-up recommendation as an actionable callout for the callout variant", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.8);

    renderCompletedAppointmentChat();

    expect(await screen.findByText("약속을 만들었어요.")).toBeInTheDocument();
    expect(await screen.findByText("추천")).toBeInTheDocument();
    expect(screen.getByText(/가신 김에 주변 업체도 둘러보세요/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "동네지도 바로가기" })).toHaveAttribute(
      "href",
      "/town-map/search/results?query=%ED%95%A9%EC%A0%95%EC%97%AD+2%EB%B2%88+%EC%B6%9C%EA%B5%AC&returnTo=%2Fchat%2Fitem-1%3Ftab%3Dchat%26returnTo%3D%252Fchat&entrySource=chat_appointment",
    );
  });

  it("replaces to the chat list when going back after completing an appointment", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.8);

    renderCompletedAppointmentChat();

    await screen.findByText("약속을 만들었어요.");
    fireEvent.click(screen.getByRole("button", { name: "뒤로가기" }));

    expect(routerMock.replace).toHaveBeenCalledWith("/chat");
    expect(routerMock.back).not.toHaveBeenCalled();
  });

  it("restores a completed appointment during the current client session only", async () => {
    renderCompletedAppointmentChat(emptyAppointmentDraft);

    expect(screen.queryByText("약속을 만들었어요.")).not.toBeInTheDocument();

    cleanup();
    renderCompletedAppointmentChat();

    expect(await screen.findByText("약속을 만들었어요.")).toBeInTheDocument();

    cleanup();
    renderCompletedAppointmentChat(emptyAppointmentDraft);

    expect(await screen.findByText("약속을 만들었어요.")).toBeInTheDocument();
    expect(window.localStorage.getItem("karrot.prototype.chat-appointments.v1")).toBeNull();
  });
});
