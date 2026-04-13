import { ChatAppointmentScreen } from "@/features/chat/screens/chat-appointment-screen";
import { getChatScreenData } from "@/lib/chat-data";
import { resolveTabHref } from "@/lib/tab-navigation";

export default async function ChatAppointmentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ tab?: string | string[] }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  const tab = Array.isArray(resolvedSearchParams.tab) ? resolvedSearchParams.tab[0] : resolvedSearchParams.tab;
  const chatData = await getChatScreenData(id);

  return (
    <ChatAppointmentScreen
      backHref={resolveTabHref(tab, "/chat")}
      chat={chatData?.chat}
      item={chatData?.item}
      itemId={id}
      seller={chatData?.seller}
    />
  );
}
