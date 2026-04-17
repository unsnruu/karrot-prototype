"use client";

import { ActionButton } from "@/components/ui/action-button";
import { UserAvatar } from "@/components/ui/user-avatar";
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
          <ActionButton className="mt-2 rounded-[4px] text-[16px] font-medium" href={message.viewHref} size="small" variant="neutralWeak">
            약속 보기
          </ActionButton>
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
        <UserAvatar alt="판매자 프로필" className="shrink-0 bg-[#eef1f4]" size="sm" src={sellerAvatar} />
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
