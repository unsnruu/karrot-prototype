import type { ChatAppointmentDraft } from "@/lib/chat-appointment";
import { isChatAppointmentReady } from "@/lib/chat-appointment";

type LocalChatAppointmentRecord = ChatAppointmentDraft & {
  chatKey: string;
  updatedAt: string;
};

const localChatAppointments = new Map<string, LocalChatAppointmentRecord>();

export function readLocalChatAppointment(chatKey: string): ChatAppointmentDraft | null {
  const record = localChatAppointments.get(chatKey);

  if (!record) {
    return null;
  }

  return {
    date: record.date,
    time: record.time,
    reminder: record.reminder,
    location: record.location,
    createdAt: record.createdAt,
  };
}

export function saveLocalChatAppointment(chatKey: string, draft: ChatAppointmentDraft) {
  if (!isChatAppointmentReady(draft)) {
    return;
  }

  localChatAppointments.set(chatKey, {
    chatKey,
    date: draft.date,
    time: draft.time,
    reminder: draft.reminder,
    location: draft.location,
    createdAt: draft.createdAt,
    updatedAt: new Date().toISOString(),
  });
}

export function resetLocalChatAppointmentsForTests() {
  localChatAppointments.clear();
}
