import Link from "next/link";
import { AppImage } from "@/components/ui/app-image";
import { type ChatPreview, type MarketplaceItem, type SellerProfile } from "@/lib/marketplace";

export function ChatScreen({
  item,
  seller,
  chat,
  itemId,
  source,
}: {
  item?: MarketplaceItem | null;
  seller?: SellerProfile | null;
  chat?: ChatPreview | null;
  itemId: string;
  source?: string;
}) {
  if (!item || !seller) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#eef2f6] p-6 text-center">
        <div className="rounded-[24px] bg-white p-8 shadow-lg">
          <p className="text-lg font-semibold text-[#111827]">채팅 정보를 찾을 수 없어요.</p>
          <Link className="mt-4 inline-block text-sm font-semibold text-[#ff6f0f]" href="/">
            피드로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  const resolvedChat = chat ?? {
    id: `fallback-${itemId}`,
    itemId,
    buyerName: "새싹님",
    lastSeen: "방금",
    messages: [],
  };
  const detailHref = `/home/items/${item.slug ?? item.id}`;

  return (
    <main className="min-h-screen bg-[#eef2f6]">
      <div className="min-h-screen bg-white">
        <header className="border-b border-black/5 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link className="text-sm font-semibold text-[#111827]" href={detailHref}>
              상세로
            </Link>
            <div className="text-right">
              <p className="text-sm font-bold text-[#111827]">{seller.name}</p>
              <p className="text-xs text-[#64748b]">{seller.town} · 마지막 접속 {resolvedChat.lastSeen}</p>
            </div>
          </div>
        </header>

        <section className="border-b border-[#f1f5f9] bg-[#fffaf5]">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
            <AppImage alt={item.title} className="h-16 w-16 rounded-2xl object-cover" height={64} src={item.image} width={64} />
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-sm font-semibold text-[#111827]">{item.title}</p>
              <p className="mt-1 text-sm text-[#64748b]">{item.priceLabel ?? "가격 문의"}</p>
            </div>
          </div>
        </section>

        <section className="bg-[#f8fafc] py-5">
          <div className="mx-auto max-w-4xl space-y-3 px-4 sm:px-6 lg:px-8">
            {resolvedChat.messages.map((message) => (
              <div className={`flex ${message.from === "seller" ? "justify-end" : "justify-start"}`} key={message.id}>
                <div
                  className={`max-w-[78%] rounded-[22px] px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[65%] ${
                    message.from === "seller" ? "bg-[#111827] text-white" : "bg-white text-[#111827]"
                  }`}
                >
                  <p>{message.text}</p>
                  <p className={`mt-1 text-[11px] ${message.from === "seller" ? "text-white/70" : "text-[#94a3b8]"}`}>
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="border-t border-black/5 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="rounded-[24px] bg-[#f8fafc] px-4 py-4">
              <p className="text-sm font-semibold text-[#111827]">거래 전 메시지 맥락을 빠르게 확인할 수 있는 채팅 화면입니다.</p>
              <p className="mt-1 text-sm text-[#64748b]">
                {source === "detail" ? "상품 상세에서 바로 이어진 대화를 확인하고 있어요." : "최근 대화를 자연스럽게 이어볼 수 있어요."}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
