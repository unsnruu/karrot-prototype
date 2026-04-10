import { ChatScreen } from "@/features/chat/screens/chat-screen";
import { getChatScreenData } from "@/lib/server-data";

export default async function ChatPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  const chatData = await getChatScreenData(id);

  return (
    <ChatScreen
      chat={chatData?.chat}
      item={chatData?.item}
      itemId={id}
      seller={chatData?.seller}
      source={Array.isArray(resolvedSearchParams.source) ? resolvedSearchParams.source[0] : resolvedSearchParams.source}
    />
  );
}
