"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EllipsisVertical, X } from "lucide-react";
import { ActionButton } from "@/components/ui/action-button";
import { FieldButton } from "@/components/ui/field-button";
import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import { trackEvent } from "@/lib/analytics/amplitude";
import { buildElementClickedEventProperties, trackElementClicked } from "@/lib/analytics/element-click";
import { buildScreenViewedEventProperties } from "@/lib/analytics/screen-view";
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
  const [selectedDate, setSelectedDate] = useState<string | null>(initialDraft.date);
  const [selectedTime, setSelectedTime] = useState<string | null>(initialDraft.time);
  const [selectedReminder, setSelectedReminder] = useState<string | null>(initialDraft.reminder);
  const selectedLocation = initialDraft.location;
  const appointmentPath = completeBaseHref.replace(/\/complete$/, "");

  useEffect(() => {
    trackEvent(
      "screen_viewed",
      buildScreenViewedEventProperties({
        pathname: appointmentPath,
        queryString: "",
      }),
    );
  }, [appointmentPath]);

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
          <Link
            className="flex h-8 w-8 items-center justify-center text-black"
            href={backHref}
            onClick={() => {
              trackElementClicked({
                screenName: "chat_appointment",
                targetType: "button",
                targetName: "chat_appointment_close_button",
                surface: "header",
                path: appointmentPath,
                destinationPath: backHref,
              });
            }}
            replace
          >
            <X aria-hidden="true" className="h-6 w-6" strokeWidth={1.9} />
          </Link>
          <PendingFeatureLink
            className="flex h-8 w-8 items-center justify-center text-black"
            featureLabel="약속 메뉴"
            returnTo={backHref}
            tracking={{
              screenName: "chat_appointment",
              targetType: "button",
              targetName: "chat_appointment_menu_button",
              surface: "header",
              path: appointmentPath,
            }}
          >
            <EllipsisVertical aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
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
                trackEvent(
                  "element_clicked",
                  buildElementClickedEventProperties({
                    screenName: "chat_appointment",
                    targetType: "button",
                    targetName: "chat_appointment_complete_button",
                    surface: "sticky_footer",
                    path: appointmentPath,
                    destinationPath: completeHref,
                  }),
                );
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
  const targetName =
    label === "날짜"
      ? "chat_appointment_date_row"
      : label === "시간"
        ? "chat_appointment_time_row"
        : label === "장소"
          ? "chat_appointment_location_row"
          : "chat_appointment_reminder_row";

  if (href) {
    return (
      <FieldButton
        href={href}
        label={label}
        onClick={() => {
          trackElementClicked({
            screenName: "chat_appointment",
            targetType: "field",
            targetName,
            surface: "form",
            path: "/chat/appointment",
            destinationPath: href.replace(/\?.*$/, ""),
          });
        }}
        placeholder={trailing}
        tone="line"
        value={muted ? undefined : trailing}
      />
    );
  }

  if (onClick) {
    return (
      <FieldButton
        label={label}
        onClick={() => {
          trackElementClicked({
            screenName: "chat_appointment",
            targetType: "field",
            targetName,
            surface: "form",
            path: "/chat/appointment",
          });
          onClick();
        }}
        placeholder={trailing}
        tone="line"
        value={muted ? undefined : trailing}
      />
    );
  }

  return <FieldButton label={label} placeholder={trailing} tone="line" value={muted ? undefined : trailing} />;
}
