"use client";

import { useEffect, useState } from "react";
import { ListSection } from "@/components/ui/list-section";
import { ChatThreadRow } from "@/features/chat/components/chat-thread-row";
import { mergeChatThreadPreviews, readLocalChatThreads } from "@/lib/local-chat-storage";
import type { ChatThreadPreview } from "@/lib/chat";

export function ChatThreadListClient({ threads }: { threads: ChatThreadPreview[] }) {
  const [resolvedThreads, setResolvedThreads] = useState(threads);

  useEffect(() => {
    setResolvedThreads(mergeChatThreadPreviews(threads, readLocalChatThreads()));
  }, [threads]);

  return (
    <ListSection itemsClassName="space-y-7">
      {resolvedThreads.map((thread) => (
        <ChatThreadRow key={thread.id} thread={thread} />
      ))}
    </ListSection>
  );
}
