import { ChatAppointmentLocationScreen } from "@/features/chat/screens/chat-appointment-location-screen";
import { DEFAULT_CHAT_APPOINTMENT_LOCATION, appendChatAppointmentQuery, parseChatAppointmentDraft } from "@/lib/chat-appointment";
import { appendNavigationQuery } from "@/lib/tab-navigation";

export default async function ChatAppointmentLocationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    returnTo?: string | string[];
    tab?: string | string[];
    appointmentDate?: string | string[];
    appointmentTime?: string | string[];
    appointmentReminder?: string | string[];
    appointmentLocation?: string | string[];
    appointmentCreatedAt?: string | string[];
  }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  const returnTo = Array.isArray(resolvedSearchParams.returnTo)
    ? resolvedSearchParams.returnTo[0]
    : resolvedSearchParams.returnTo;
  const tab = Array.isArray(resolvedSearchParams.tab) ? resolvedSearchParams.tab[0] : resolvedSearchParams.tab;
  const appointmentHref = appendNavigationQuery(`/chat/${id}/appointment`, {
    tab: tab === "chat" ? "chat" : undefined,
    returnTo,
  });
  const appointmentDraft = parseChatAppointmentDraft(resolvedSearchParams);
  const completeHref = appendChatAppointmentQuery(appointmentHref, {
    ...appointmentDraft,
    location: appointmentDraft.location ?? DEFAULT_CHAT_APPOINTMENT_LOCATION,
  });

  return <ChatAppointmentLocationScreen backHref={appointmentHref} completeHref={completeHref} />;
}
