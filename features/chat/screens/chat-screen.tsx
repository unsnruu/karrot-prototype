import type { ReactNode } from "react";
import Link from "next/link";
import { CalendarDays, CirclePlus, EllipsisVertical, Phone, SendHorizontal, Smile, Plus, ChevronLeft } from "lucide-react";
import { AppImage } from "@/components/ui/app-image";
import { AppToolbar } from "@/components/ui/app-toolbar";
import { ActionButton } from "@/components/ui/action-button";
import { IconButton } from "@/components/ui/icon-button";
import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import { ChatMessageRow } from "@/features/chat/components/chat-message-row";
import { HistoryBackButton } from "@/features/chat/components/history-back-button";
import { appendChatAppointmentQuery, isChatAppointmentReady, type ChatAppointmentDraft } from "@/lib/chat-appointment";
import { appendNavigationQuery } from "@/lib/tab-navigation";
import { type ChatPreview, type MarketplaceItem, type SellerProfile } from "@/lib/marketplace";

export function ChatScreen({
  item,
  seller,
  chat,
  appointmentDraft,
  itemId,
  backHref,
}: {
  item?: MarketplaceItem | null;
  seller?: SellerProfile | null;
  chat?: ChatPreview | null;
  appointmentDraft?: ChatAppointmentDraft;
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
  const appointmentActionHref = appointmentDraft ? appendChatAppointmentQuery(appointmentHref, appointmentDraft) : appointmentHref;
  const chatMessages = appointmentDraft && isChatAppointmentReady(appointmentDraft)
    ? [
        ...resolvedChat.messages,
        {
          id: `appointment-${itemId}`,
          type: "appointment-card" as const,
          date: appointmentDraft.date!,
          time: appointmentDraft.time!,
          location: appointmentDraft.location!,
          createdAt: appointmentDraft.createdAt ?? "",
          viewHref: appointmentActionHref,
        },
      ]
    : resolvedChat.messages;

  return (
    <main className="min-h-screen bg-[#eef2f6]">
      <div className="mobile-shell min-h-screen bg-white">
        <AppToolbar
          className="border-b border-black/5 bg-white px-4 pb-2 pt-5"
          center={
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-start gap-[5px]">
                <p className="text-[16px] font-bold leading-none text-black">{seller.name}</p>
                <div className="rounded-full bg-[#fff2e2] px-[4px] py-[2px]">
                  <p className="text-[10px] font-semibold leading-none text-[#f3a027]">{Math.round(seller.mannerScore)}°C</p>
                </div>
              </div>
              <p className="text-[12px] leading-none text-black">{resolvedChat.responseLabel ?? `${seller.town} · 마지막 접속 ${resolvedChat.lastSeen}`}</p>
            </div>
          }
          leading={
            <>
              <HistoryBackButton className="flex h-8 w-8 items-center justify-center text-black" fallbackHref={backHref}>
                <ChevronLeft aria-hidden="true" className="h-6 w-6" strokeWidth={1.9} />
              </HistoryBackButton>
              <div className="flex h-8 w-8 items-center justify-center" />
            </>
          }
          trailing={
            <>
              <IconButton ariaLabel="전화하기" className="text-black" pendingFeatureLabel="전화하기" returnTo={backHref}>
                <Phone aria-hidden="true" className="h-6 w-6" strokeWidth={1.7} />
              </IconButton>
              <IconButton ariaLabel="채팅 메뉴" className="text-black" pendingFeatureLabel="채팅 메뉴" returnTo={backHref}>
                <EllipsisVertical aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
              </IconButton>
            </>
          }
        />

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
            <ChatActionButton backHref={backHref} href={appointmentActionHref} icon={<CalendarDays aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />} label="약속잡기" />
            <ChatActionButton backHref={backHref} icon={<WonIcon />} label="당근페이" />
            <ChatActionButton backHref={backHref} icon={<CirclePlus aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />} label="물품추가" />
          </div>
        </section>

        <section className="bg-[#f8fafc] pb-24 pt-5">
          <div className="space-y-3 px-4">
            {chatMessages.map((message) => (
              <ChatMessageRow key={message.id} message={message} sellerAvatar={seller.avatar} />
            ))}
          </div>
        </section>

        <footer className="fixed inset-x-0 bottom-0 z-10 bg-white">
          <div className="mobile-shell flex items-center gap-3 px-2 pb-10 pt-2">
            <IconButton ariaLabel="채팅에 항목 추가하기" className="text-[#8f95a3]" pendingFeatureLabel="채팅에 항목 추가하기" returnTo={backHref}>
              <Plus aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
            </IconButton>
            <div className="flex h-10 flex-1 items-center gap-1 rounded-full bg-[#f2f4f5] px-3">
              <p className="flex-1 text-[16px] font-medium text-[#aeb2b5]">메시지 보내기</p>
              <PendingFeatureLink className="flex h-6 w-6 items-center justify-center text-[#9aa1ac]" featureLabel="이모지 보내기" returnTo={backHref}>
                <Smile aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
              </PendingFeatureLink>
            </div>
            <PendingFeatureLink className="flex h-6 w-6 items-center justify-center text-[#d3d7dd]" featureLabel="메시지 보내기" returnTo={backHref}>
              <SendHorizontal aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
            </PendingFeatureLink>
          </div>
        </footer>
      </div>
    </main>
  );
}

function ChatActionButton({ icon, label, href, backHref }: { icon: ReactNode; label: string; href?: string; backHref: string }) {
  if (href) {
    return (
      <ActionButton
        href={href}
        leading={icon}
        size="small"
        variant="neutralOutline"
      >
        {label}
      </ActionButton>
    );
  }

  return (
    <ActionButton
      leading={icon}
      pendingFeatureLabel={label}
      returnTo={backHref}
      size="small"
      variant="neutralOutline"
    >
      {label}
    </ActionButton>
  );
}
function WonIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
      <path d="M4 4.5L6.6 11.5L8 8.2L9.4 11.5L12 4.5M3.2 7H12.8M2.8 9.4H13.2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}
