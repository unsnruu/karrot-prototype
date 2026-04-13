import { ChatAppointmentScreen } from "@/features/chat/screens/chat-appointment-screen";
import { getChatScreenData } from "@/lib/chat-data";
import { appendNavigationQuery } from "@/lib/tab-navigation";

export default async function ChatAppointmentPage({
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
  const chatData = await getChatScreenData(id);

  return (
    <ChatAppointmentScreen
      backHref={appendNavigationQuery(`/chat/${id}`, { tab: tab === "chat" ? "chat" : undefined, returnTo })}
      chat={chatData?.chat}
      item={chatData?.item}
      itemId={id}
      seller={chatData?.seller}
    />
  );
}
