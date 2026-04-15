import { SELL_FLOW_DEFAULT_LOCATION } from "@/lib/sell-flow";

export type ChatAppointmentDraft = {
  date: string | null;
  time: string | null;
  reminder: string | null;
  location: string | null;
  createdAt: string | null;
};

type AppointmentSearchParams = {
  appointmentDate?: string | string[];
  appointmentTime?: string | string[];
  appointmentReminder?: string | string[];
  appointmentLocation?: string | string[];
  appointmentCreatedAt?: string | string[];
};

export const DEFAULT_CHAT_APPOINTMENT_TIME = "오후 6:20";
export const DEFAULT_CHAT_APPOINTMENT_REMINDER = "30분 전";
export const DEFAULT_CHAT_APPOINTMENT_LOCATION = SELL_FLOW_DEFAULT_LOCATION.label;

function readFirstQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function readNormalizedQueryValue(value: string | string[] | undefined) {
  const normalized = readFirstQueryValue(value)?.trim();
  return normalized ? normalized : null;
}

export function formatChatAppointmentDateLabel(date = new Date()) {
  const monthDayFormatter = new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    timeZone: "Asia/Seoul",
  });
  const weekdayFormatter = new Intl.DateTimeFormat("ko-KR", {
    weekday: "short",
    timeZone: "Asia/Seoul",
  });

  return `${monthDayFormatter.format(date)} (${weekdayFormatter.format(date)})`;
}

export function formatChatAppointmentCreatedTime(date = new Date()) {
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Seoul",
  }).format(date);
}

export function parseChatAppointmentDraft(searchParams: AppointmentSearchParams): ChatAppointmentDraft {
  return {
    date: readNormalizedQueryValue(searchParams.appointmentDate),
    time: readNormalizedQueryValue(searchParams.appointmentTime),
    reminder: readNormalizedQueryValue(searchParams.appointmentReminder),
    location: readNormalizedQueryValue(searchParams.appointmentLocation),
    createdAt: readNormalizedQueryValue(searchParams.appointmentCreatedAt),
  };
}

export function appendChatAppointmentQuery(href: string, draft: ChatAppointmentDraft) {
  const params = new URLSearchParams();

  if (draft.date) {
    params.set("appointmentDate", draft.date);
  }

  if (draft.time) {
    params.set("appointmentTime", draft.time);
  }

  if (draft.reminder) {
    params.set("appointmentReminder", draft.reminder);
  }

  if (draft.location) {
    params.set("appointmentLocation", draft.location);
  }

  if (draft.createdAt) {
    params.set("appointmentCreatedAt", draft.createdAt);
  }

  const query = params.toString();

  if (!query) {
    return href;
  }

  const separator = href.includes("?") ? "&" : "?";
  return `${href}${separator}${query}`;
}

export function isChatAppointmentReady(draft: ChatAppointmentDraft) {
  return Boolean(draft.date && draft.time && draft.location);
}
