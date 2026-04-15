"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import { trackEvent } from "@/lib/analytics/amplitude";
import {
  appendChatAppointmentQuery,
  DEFAULT_CHAT_APPOINTMENT_REMINDER,
  DEFAULT_CHAT_APPOINTMENT_TIME,
  formatChatAppointmentCreatedTime,
  formatChatAppointmentDateLabel,
  isChatAppointmentReady,
  type ChatAppointmentDraft,
} from "@/lib/chat-appointment";
import { type MarketplaceItem, type SellerProfile } from "@/lib/marketplace";

export function ChatAppointmentScreen({
  seller,
  item,
  backHref,
  locationBaseHref,
  completeBaseHref,
  initialDraft,
}: {
  seller?: SellerProfile | null;
  item?: MarketplaceItem | null;
  backHref: string;
  locationBaseHref: string;
  completeBaseHref: string;
  initialDraft: ChatAppointmentDraft;
}) {
  if (!seller || !item) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f5f5] p-6 text-center">
        <div className="rounded-[24px] bg-white p-8 shadow-lg">
          <p className="text-lg font-semibold text-[#111827]">약속 화면을 불러올 수 없어요.</p>
          <Link className="mt-4 inline-block text-sm font-semibold text-[#ff6f0f]" href={backHref}>
            채팅으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  const [selectedDate, setSelectedDate] = useState<string | null>(initialDraft.date);
  const [selectedTime, setSelectedTime] = useState<string | null>(initialDraft.time);
  const [selectedReminder, setSelectedReminder] = useState<string | null>(initialDraft.reminder);
  const selectedLocation = initialDraft.location;

  useEffect(() => {
    if (!seller || !item) {
      trackEvent("chat_appointment_invalid_state", {
        has_item: Boolean(item),
        has_seller: Boolean(seller),
        source: "chat_appointment",
      });
      return;
    }

    trackEvent("chat_appointment_started", {
      item_id: item.id,
      seller_name: seller.name,
      thread_id: item.id,
    });
  }, [item, seller]);

  const currentDraft: ChatAppointmentDraft = {
    date: selectedDate,
    time: selectedTime,
    reminder: selectedReminder,
    location: selectedLocation,
    createdAt: initialDraft.createdAt,
  };
  const isReadyToComplete = isChatAppointmentReady(currentDraft);
  const locationHref = appendChatAppointmentQuery(locationBaseHref, currentDraft);
  const completeHref = isReadyToComplete
    ? appendChatAppointmentQuery(completeBaseHref, {
        ...currentDraft,
        createdAt: currentDraft.createdAt ?? formatChatAppointmentCreatedTime(),
      })
    : null;

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="mobile-shell flex min-h-screen flex-col bg-white px-4 pb-10 pt-6">
        <header className="flex items-center justify-between">
          <Link className="flex h-8 w-8 items-center justify-center text-black" href={backHref} replace>
            <CloseIcon />
          </Link>
          <PendingFeatureLink className="flex h-8 w-8 items-center justify-center text-black" featureLabel="약속 메뉴" returnTo={backHref}>
            <KebabIcon />
          </PendingFeatureLink>
        </header>

        <h1 className="mt-8 text-[21px] font-semibold tracking-[-0.03em] text-black">{seller.name}님과 약속</h1>

        <section className="mt-8">
          <AppointmentRow
            icon="down"
            label="날짜"
            muted={selectedDate == null}
            onClick={() => setSelectedDate(formatChatAppointmentDateLabel())}
            trailing={selectedDate ?? "날짜 선택"}
          />
          <AppointmentRow
            icon="down"
            label="시간"
            muted={selectedTime == null}
            onClick={() => setSelectedTime(DEFAULT_CHAT_APPOINTMENT_TIME)}
            trailing={selectedTime ?? "시간 선택"}
          />
          <AppointmentRow href={locationHref} icon="right" label="장소" muted={selectedLocation == null} trailing={selectedLocation ?? "장소 선택"} />
          <AppointmentRow
            icon="down"
            label="약속 전 나에게 알림"
            muted={selectedReminder == null}
            onClick={() => setSelectedReminder(DEFAULT_CHAT_APPOINTMENT_REMINDER)}
            trailing={selectedReminder ?? "알림 선택"}
          />
        </section>

        <div className="mt-auto pt-16">
          {completeHref ? (
            <Link
              className="flex h-[52px] w-full items-center justify-center rounded-[8px] bg-[#ff6f0f] text-[15px] font-bold text-white"
              href={completeHref}
              onClick={() => {
                trackEvent("chat_appointment_completed", {
                  has_location: Boolean(currentDraft.location),
                  has_reminder: Boolean(currentDraft.reminder),
                  item_id: item.id,
                  scheduled_date: currentDraft.date ?? undefined,
                  scheduled_time: currentDraft.time ?? undefined,
                  seller_name: seller.name,
                  thread_id: item.id,
                });
              }}
              replace
            >
              완료
            </Link>
          ) : (
            <button
              aria-disabled="true"
              className="flex h-[52px] w-full cursor-not-allowed items-center justify-center rounded-[8px] bg-[#868b94] text-[15px] font-bold text-[#d1d3d8]"
              disabled
              type="button"
            >
              완료
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

function AppointmentRow({
  label,
  trailing,
  muted = false,
  icon,
  href,
  onClick,
}: {
  label: string;
  trailing: string;
  muted?: boolean;
  icon: "down" | "right";
  href?: string;
  onClick?: () => void;
}) {
  const content = (
    <>
      <p className="text-[16px] font-semibold text-[#25282d]">{label}</p>
      <div className="flex items-center gap-2">
        <p className={`text-[16px] ${muted ? "text-[#c6c9cf]" : "text-[#25282d]"}`}>{trailing}</p>
        {icon === "down" ? <ChevronDownIcon /> : <ChevronRightIcon />}
      </div>
    </>
  );

  if (href) {
    return (
      <Link className="flex h-[54px] items-center justify-between border-b border-black/5" href={href}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button className="flex h-[54px] w-full items-center justify-between border-b border-black/5 text-left" onClick={onClick} type="button">
        {content}
      </button>
    );
  }

  return <div className="flex h-[54px] items-center justify-between border-b border-black/5">{content}</div>;
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24">
      <path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.9" />
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

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 20 20" width="20">
      <path d="M5.5 7.5L10 12L14.5 7.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 20 20" width="20">
      <path d="M7.5 5.5L12 10L7.5 14.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}
