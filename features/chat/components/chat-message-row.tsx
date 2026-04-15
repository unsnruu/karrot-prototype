"use client";

import Link from "next/link";
import { AppImage } from "@/components/ui/app-image";
import { type ChatMessage } from "@/lib/marketplace";

export function ChatMessageRow({
  message,
  sellerAvatar,
}: {
  message: ChatMessage;
  sellerAvatar?: string;
}) {
  if (message.type === "system-date") {
    return <p className="pt-1 text-center text-sm text-[#8d8f95]">{message.text}</p>;
  }

  if (message.type === "system-notice") {
    return <p className="text-center text-[13px] text-[#a3a7b0]">{message.text}</p>;
  }

  if (message.type === "appointment-card") {
    return (
      <div className="flex items-end justify-end gap-2">
        <p className="text-[11px] text-[#adb1ba]">{message.createdAt}</p>
        <div className="w-[288px] rounded-[14px] border border-[#eeeeee] bg-white px-4 py-5 shadow-[0_1px_0_rgba(17,17,17,0.02)]">
          <div className="space-y-1 text-[16px] leading-[1.4] text-[#111111]">
            <p className="font-bold">약속을 만들었어요.</p>
            <p>날짜: {message.date}</p>
            <p>시간: {message.time}</p>
            <p>장소: {message.location}</p>
          </div>
          <Link
            className="mt-2 flex h-9 items-center justify-center rounded-[4px] bg-[#f2f4f5] text-[16px] font-medium text-black"
            href={message.viewHref}
          >
            약속 보기
          </Link>
        </div>
      </div>
    );
  }

  if (message.type !== "buyer" && message.type !== "seller") {
    return null;
  }

  const isBuyer = message.type === "buyer";

  return (
    <div className={`flex items-end gap-2 ${isBuyer ? "justify-end" : "justify-start"}`}>
      {!isBuyer ? (
        sellerAvatar ? (
          <AppImage alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" height={32} src={sellerAvatar} width={32} />
        ) : (
          <div className="h-8 w-8 shrink-0 rounded-full bg-[#eef1f4]" />
        )
      ) : null}
      <div
        className={`max-w-[78%] rounded-[18px] px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[65%] ${
          isBuyer ? "order-2 bg-[#ff6f0f] text-white" : "bg-[#f2f3f6] text-[#111827]"
        }`}
      >
        <p>{message.text}</p>
      </div>
      <p className={`text-[11px] text-[#adb1ba] ${isBuyer ? "order-1" : ""}`}>{message.time}</p>
    </div>
  );
}
