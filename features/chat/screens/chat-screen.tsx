import type { ReactNode } from "react";
import Link from "next/link";
import { AppImage } from "@/components/ui/app-image";
import { HistoryBackButton } from "@/features/chat/components/history-back-button";
import { appendNavigationQuery } from "@/lib/tab-navigation";
import { type ChatMessage, type ChatPreview, type MarketplaceItem, type SellerProfile } from "@/lib/marketplace";

export function ChatScreen({
  item,
  seller,
  chat,
  itemId,
  backHref,
}: {
  item?: MarketplaceItem | null;
  seller?: SellerProfile | null;
  chat?: ChatPreview | null;
  itemId: string;
  backHref: string;
}) {
  if (!item || !seller) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#eef2f6] p-6 text-center">
        <div className="rounded-[24px] bg-white p-8 shadow-lg">
          <p className="text-lg font-semibold text-[#111827]">채팅 정보를 찾을 수 없어요.</p>
          <Link className="mt-4 inline-block text-sm font-semibold text-[#ff6f0f]" href="/">
            피드로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  const resolvedChat = chat ?? {
    id: `fallback-${itemId}`,
    itemId,
    buyerName: "새싹님",
    lastSeen: "방금",
    responseLabel: "보통 30분 이내 응답",
    messages: [],
  };
  const appointmentHref = appendNavigationQuery(`/chat/${itemId}/appointment`, {
    tab: "chat",
    returnTo: backHref,
  });

  return (
    <main className="min-h-screen bg-[#eef2f6]">
      <div className="mobile-shell min-h-screen bg-white">
        <header className="border-b border-black/5 bg-white px-4 pb-2 pt-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HistoryBackButton className="flex h-8 w-8 items-center justify-center text-black" fallbackHref={backHref}>
                <BackIcon />
              </HistoryBackButton>
              <div className="flex h-8 w-8 items-center justify-center" />
            </div>

            <div className="flex flex-1 flex-col items-center gap-1">
              <div className="flex items-start gap-[5px]">
                <p className="text-[16px] font-bold leading-none text-black">{seller.name}</p>
                <div className="rounded-full bg-[#fff2e2] px-[4px] py-[2px]">
                  <p className="text-[10px] font-semibold leading-none text-[#f3a027]">{Math.round(seller.mannerScore)}°C</p>
                </div>
              </div>
              <p className="text-[12px] leading-none text-black">{resolvedChat.responseLabel ?? `${seller.town} · 마지막 접속 ${resolvedChat.lastSeen}`}</p>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex h-8 w-8 items-center justify-center text-black" type="button">
                <CallIcon />
              </button>
              <button className="flex h-8 w-8 items-center justify-center text-black" type="button">
                <KebabIcon />
              </button>
            </div>
          </div>
        </header>

        <section className="border-b border-black/5 bg-white px-4 py-4">
          <div className="flex items-center gap-3">
            <AppImage alt={item.title} className="h-10 w-10 rounded object-cover" height={40} src={item.image} width={40} />
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-[14px] leading-none text-[#111827]">
                <span className="mr-1 font-semibold">{item.condition}</span>
                <span>{item.title}</span>
              </p>
              <p className="mt-1 text-[15px] font-bold leading-none text-black">{item.priceLabel ?? "가격 문의"}</p>
            </div>
          </div>

          <div className="mt-2 flex gap-2">
            <ChatActionButton href={appointmentHref} icon={<CalendarIcon />} label="약속잡기" />
            <ChatActionButton icon={<WonIcon />} label="당근페이" />
            <ChatActionButton icon={<PlusCircleIcon />} label="물품추가" />
          </div>
        </section>

        <section className="bg-[#f8fafc] pb-24 pt-5">
          <div className="space-y-3 px-4">
            {resolvedChat.messages.map((message) => (
              <ChatMessageRow key={message.id} message={message} />
            ))}
          </div>
        </section>

        <footer className="fixed inset-x-0 bottom-0 z-10 bg-white">
          <div className="mobile-shell flex items-center gap-3 px-2 pb-10 pt-2">
            <button className="flex h-8 w-8 items-center justify-center text-[#8f95a3]" type="button">
              <PlusIcon />
            </button>
            <div className="flex h-10 flex-1 items-center gap-1 rounded-full bg-[#f2f4f5] px-3">
              <p className="flex-1 text-[16px] font-medium text-[#aeb2b5]">메시지 보내기</p>
              <button className="flex h-6 w-6 items-center justify-center text-[#9aa1ac]" type="button">
                <SmileIcon />
              </button>
            </div>
            <button className="flex h-6 w-6 items-center justify-center text-[#d3d7dd]" type="button">
              <SendIcon />
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
}

function ChatActionButton({ icon, label, href }: { icon: ReactNode; label: string; href?: string }) {
  if (href) {
    return (
      <Link
        className="flex h-[36px] items-center gap-1 rounded border border-black/10 bg-white px-3 text-[13px] font-semibold text-black"
        href={href}
      >
        <span className="flex h-4 w-4 items-center justify-center">{icon}</span>
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <button
      className="flex h-[36px] items-center gap-1 rounded border border-black/10 bg-white px-3 text-[13px] font-semibold text-black"
      type="button"
    >
      <span className="flex h-4 w-4 items-center justify-center">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function ChatMessageRow({ message }: { message: ChatMessage }) {
  if (message.type === "system-date") {
    return <p className="pt-1 text-center text-sm text-[#8d8f95]">{message.text}</p>;
  }

  if (message.type === "system-notice") {
    return <p className="text-center text-[13px] text-[#a3a7b0]">{message.text}</p>;
  }

  const isBuyer = message.type === "buyer";
  const messageTime = "time" in message ? message.time : "";

  return (
    <div className={`flex items-end gap-2 ${isBuyer ? "justify-end" : "justify-start"}`}>
      {!isBuyer ? <div className="h-8 w-8 shrink-0 rounded-full bg-[#eef1f4]" /> : null}
      <div
        className={`max-w-[78%] rounded-[18px] px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[65%] ${
          isBuyer ? "order-2 bg-[#ff6f0f] text-white" : "bg-[#f2f3f6] text-[#111827]"
        }`}
      >
        <p>{message.text}</p>
      </div>
      <p className={`text-[11px] text-[#adb1ba] ${isBuyer ? "order-1" : ""}`}>{messageTime}</p>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
      <path d="M5 1.5V3M11 1.5V3M2.5 5H13.5M4.6 8H7.1M8.9 8H11.4M4.6 10.8H7.1M8.9 10.8H11.4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <rect height="11" rx="2" stroke="currentColor" strokeWidth="1.5" width="11" x="2.5" y="2.5" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24">
      <path d="M14.5 6.5L9 12L14.5 17.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" />
    </svg>
  );
}

function CallIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24">
      <path d="M7.75 5.75H9.62C10 5.75 10.33 6.01 10.42 6.38L10.92 8.54C10.99 8.83 10.89 9.14 10.67 9.34L9.45 10.46C10.12 11.82 11.18 12.88 12.54 13.55L13.66 12.33C13.86 12.11 14.17 12.01 14.46 12.08L16.62 12.58C16.99 12.67 17.25 13 17.25 13.38V15.25C17.25 15.94 16.69 16.5 16 16.5H15.25C10.42 16.5 6.5 12.58 6.5 7.75V7C6.5 6.31 7.06 5.75 7.75 5.75Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}

function KebabIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
      <circle cx="12" cy="6.5" r="1.4" />
      <circle cx="12" cy="12" r="1.4" />
      <circle cx="12" cy="17.5" r="1.4" />
    </svg>
  );
}

function WonIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
      <path d="M4 4.5L6.6 11.5L8 8.2L9.4 11.5L12 4.5M3.2 7H12.8M2.8 9.4H13.2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function PlusCircleIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
      <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 5.3V10.7M5.3 8H10.7" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24">
      <path d="M12 5.5V18.5M5.5 12H18.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function SmileIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 20 20" width="20">
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7.2 12.2C7.8 13.15 8.84 13.75 10 13.75C11.16 13.75 12.2 13.15 12.8 12.2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <circle cx="7.3" cy="8.2" fill="currentColor" r="0.85" />
      <circle cx="12.7" cy="8.2" fill="currentColor" r="0.85" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 20 20" width="20">
      <path d="M3 10L16.2 3.8L13.1 16.4L9.65 11.6L3 10Z" fill="currentColor" />
    </svg>
  );
}
