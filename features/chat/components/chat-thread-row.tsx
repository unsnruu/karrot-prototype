"use client";

import Link from "next/link";
import { AppImage } from "@/components/ui/app-image";
import { trackEvent } from "@/lib/analytics/amplitude";
import { type ChatThreadPreview } from "@/lib/chat";

export function ChatThreadRow({ thread }: { thread: ChatThreadPreview }) {
  const content = (
    <div className="flex items-center gap-[6px]">
      <div className="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-full bg-[#e5e7eb]">
        {thread.avatarImage ? <AppImage alt="" className="object-cover" fill sizes="52px" src={thread.avatarImage} /> : null}
      </div>

      <div className="min-w-0 max-w-[calc(100%-58px)] flex-1">
        <div className="flex items-center gap-1 whitespace-nowrap leading-none">
          <span className="shrink-0 text-base font-medium tracking-[-0.02em] text-black">{thread.name}</span>
          <span className="text-[13px] text-[#858b95]">{thread.town}</span>
          <span className="text-[13px] text-[#868b94]">·</span>
          <span className="text-[13px] text-[#858b95]">{thread.updatedAt}</span>
        </div>
        <p className="mt-1 text-sm leading-[1.35] text-[#858b95]">{thread.lastMessage}</p>
      </div>
    </div>
  );

  if (!thread.href) {
    return <article>{content}</article>;
  }

  return (
    <article>
      <Link
        className="block"
        href={thread.href}
        onClick={() => {
          trackEvent("chat_thread_opened", {
            counterparty_name: thread.name,
            source: "chat_list",
            thread_id: thread.id,
            town: thread.town,
          });
        }}
      >
        {content}
      </Link>
    </article>
  );
}
