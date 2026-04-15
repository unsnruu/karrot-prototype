import { HeartIcon } from "@/features/home/components/item-detail-icons";

export function SellPreviewBottomBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-black/10 bg-white">
      <div className="mobile-shell flex items-center gap-3 px-4 pb-[calc(42px+env(safe-area-inset-bottom))] pt-3 sm:px-5">
        <button
          aria-label="관심 상품"
          className="flex h-6 w-6 shrink-0 items-center justify-center text-[#d1d5db]"
          type="button"
        >
          <HeartIcon />
        </button>
        <div className="flex h-[52px] flex-1 items-center justify-center rounded-[8px] bg-[#e5e7eb] px-4">
          <span className="text-[18px] font-semibold text-[#111111]">대화중인 채팅 0</span>
        </div>
      </div>
    </div>
  );
}
