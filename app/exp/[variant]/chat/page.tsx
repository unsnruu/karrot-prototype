import { ChatLandingScreen } from "@/features/chat/screens/chat-landing-screen";
import { isHomeExperimentVariant } from "@/lib/home-experiment";
import { getChatLandingData } from "@/lib/chat-data";
import { notFound } from "next/navigation";

export default async function ExperimentChatLandingPage({
  params,
}: {
  params: Promise<{ variant: string }>;
}) {
  const { variant } = await params;

  if (!isHomeExperimentVariant(variant)) {
    notFound();
  }

  const threads = await getChatLandingData();

  return <ChatLandingScreen threads={threads} />;
}
