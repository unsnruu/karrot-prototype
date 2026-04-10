import Link from "next/link";
import { HeartIcon } from "@/features/home/components/item-detail-icons";

export function ItemDetailBottomBar({ chatHref }: { chatHref: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-black/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-screen-sm items-center gap-3 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 sm:px-5">
        <button aria-label="관심 상품 추가" className="flex h-[52px] w-9 items-center justify-center text-[#d6d7dc]" type="button">
          <HeartIcon />
        </button>
        <Link
          className="flex h-[52px] flex-1 items-center justify-center rounded-[8px] bg-[#ff6f0f] text-[18px] font-semibold text-white"
          href={chatHref}
        >
          채팅하기
        </Link>
      </div>
    </div>
  );
}
