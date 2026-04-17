"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ActionButton } from "@/components/ui/action-button";
import { FieldButton } from "@/components/ui/field-button";
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
            label="날짜"
            muted={selectedDate == null}
            onClick={() => setSelectedDate(formatChatAppointmentDateLabel())}
            trailing={selectedDate ?? "날짜 선택"}
          />
          <AppointmentRow
            label="시간"
            muted={selectedTime == null}
            onClick={() => setSelectedTime(DEFAULT_CHAT_APPOINTMENT_TIME)}
            trailing={selectedTime ?? "시간 선택"}
          />
          <AppointmentRow href={locationHref} label="장소" muted={selectedLocation == null} trailing={selectedLocation ?? "장소 선택"} />
          <AppointmentRow
            label="약속 전 나에게 알림"
            muted={selectedReminder == null}
            onClick={() => setSelectedReminder(DEFAULT_CHAT_APPOINTMENT_REMINDER)}
            trailing={selectedReminder ?? "알림 선택"}
          />
        </section>

        <div className="mt-auto pt-16">
          {completeHref ? (
            <ActionButton
              fullWidth
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
              size="medium"
              variant="brandSolid"
            >
              완료
            </ActionButton>
          ) : (
            <ActionButton
              aria-disabled="true"
              className="cursor-not-allowed bg-[#868b94] text-[#d1d3d8]"
              disabled
              fullWidth
              size="medium"
              variant="neutralSolid"
            >
              완료
            </ActionButton>
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
  href,
  onClick,
}: {
  label: string;
  trailing: string;
  muted?: boolean;
  href?: string;
  onClick?: () => void;
}) {
  if (href) {
    return <FieldButton href={href} label={label} placeholder={trailing} tone="line" value={muted ? undefined : trailing} />;
  }

  if (onClick) {
    return <FieldButton label={label} onClick={onClick} placeholder={trailing} tone="line" value={muted ? undefined : trailing} />;
  }

  return <FieldButton label={label} placeholder={trailing} tone="line" value={muted ? undefined : trailing} />;
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
