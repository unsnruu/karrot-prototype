import { ChatLandingScreen } from "@/features/chat/screens/chat-landing-screen";
import { getChatLandingData } from "@/lib/chat-data";

export default async function ChatLandingPage() {
  const threads = await getChatLandingData();

  return <ChatLandingScreen threads={threads} />;
}
