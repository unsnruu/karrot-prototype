"use client";

import { useEffect, useState } from "react";
import { ChatThreadRow } from "@/features/chat/components/chat-thread-row";
import { mergeChatThreadPreviews, readLocalChatThreads } from "@/lib/local-chat-storage";
import type { ChatThreadPreview } from "@/lib/chat";

export function ChatThreadListClient({ threads }: { threads: ChatThreadPreview[] }) {
  const [resolvedThreads, setResolvedThreads] = useState(threads);

  useEffect(() => {
    setResolvedThreads(mergeChatThreadPreviews(threads, readLocalChatThreads()));
  }, [threads]);

  return (
    <div className="space-y-7">
      {resolvedThreads.map((thread) => (
        <ChatThreadRow key={thread.id} thread={thread} />
      ))}
    </div>
  );
}
