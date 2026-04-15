import { ChatAppointmentLocationScreen } from "@/features/chat/screens/chat-appointment-location-screen";
import { appendNavigationQuery } from "@/lib/tab-navigation";

export default async function ChatAppointmentLocationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ returnTo?: string | string[]; tab?: string | string[] }>;
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

  return <ChatAppointmentLocationScreen backHref={appointmentHref} completeHref={appointmentHref} />;
}
