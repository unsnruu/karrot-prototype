import { AppImage } from "@/components/ui/app-image";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { chatCategories, chatThreadPreviews } from "@/lib/chat";
import { ChatCategoryChip } from "@/features/chat/components/chat-category-chip";
import { ChatThreadRow } from "@/features/chat/components/chat-thread-row";

const iconBell = "/icons/bell.svg";

export function ChatLandingScreen() {
  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <div className="mx-auto min-h-screen max-w-3xl bg-white pb-24">
        <header className="sticky top-0 z-20 bg-white">
          <div className="mx-auto max-w-3xl px-4 pb-3 pt-5 sm:px-6">
            <div className="flex items-center justify-between py-4">
              <h1 className="text-[22px] font-bold tracking-[-0.03em] text-black">채팅</h1>

              <div className="flex items-center gap-3">
                <button aria-label="알림" className="relative" type="button">
                  <AppImage alt="" className="h-8 w-8" height={32} src={iconBell} width={32} />
                  <span className="absolute right-[5px] top-[5px] h-[6px] w-[6px] rounded-full bg-[#ff6f0f]" />
                </button>
                <button aria-label="저장한 채팅" className="flex h-8 w-8 items-center justify-center" type="button">
                  <BookmarkIcon />
                </button>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {chatCategories.map((category) => (
                <ChatCategoryChip category={category} key={`${category.icon ?? "label"}-${category.label}`} />
              ))}
            </div>
          </div>
        </header>

        <section className="px-4 pb-24 pt-8 sm:px-6">
          <div className="space-y-7">
            {chatThreadPreviews.map((thread) => (
              <ChatThreadRow key={thread.id} thread={thread} />
            ))}
          </div>
        </section>

        <BottomNav />
      </div>
    </main>
  );
}

function BookmarkIcon() {
  return (
    <svg aria-hidden="true" className="h-8 w-8 text-black" fill="none" viewBox="0 0 32 32">
      <path
        d="M11.5 6.75H20.5C21.7426 6.75 22.75 7.75736 22.75 9V25.0198C22.75 25.417 22.2929 25.6416 21.9779 25.3987L16.7636 21.3765C16.3266 21.0394 15.7176 21.0394 15.2806 21.3765L10.0221 25.4326C9.70715 25.6755 9.25 25.4509 9.25 25.0537V9C9.25 7.75736 10.2574 6.75 11.5 6.75Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}
