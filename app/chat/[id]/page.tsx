import { ChatScreen } from "@/features/chat/screens/chat-screen";
import { getChatScreenData } from "@/lib/chat-data";
import { resolveReturnHref, resolveTabHref } from "@/lib/tab-navigation";

export default async function ChatPage({
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
    <ChatScreen
      backHref={resolveReturnHref(returnTo, resolveTabHref(tab, "/chat"))}
      chat={chatData?.chat}
      item={chatData?.item}
      itemId={id}
      seller={chatData?.seller}
    />
  );
}
