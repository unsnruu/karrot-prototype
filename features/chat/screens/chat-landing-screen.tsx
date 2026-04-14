import { AppImage } from "@/components/ui/app-image";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { chatCategories, chatThreadPreviews, type ChatThreadPreview } from "@/lib/chat";
import { ChatCategoryChip } from "@/features/chat/components/chat-category-chip";
import { ChatThreadListClient } from "@/features/chat/components/chat-thread-list-client";

const iconBell = "/icons/bell.svg";

export function ChatLandingScreen({ threads = chatThreadPreviews }: { threads?: ChatThreadPreview[] }) {
  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <div className="mobile-shell min-h-screen bg-white pb-24">
        <header className="sticky top-0 z-20 bg-white">
          <div className="px-4 pb-3 pt-5">
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

        <section className="px-4 pb-24 pt-8">
          <ChatThreadListClient threads={threads} />
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
        d="M11.5 6.75H20.5C21.7426 6.75 22.75 7.75736 22.75 9V24.949C22.75 25.3593 22.2782 25.5915 21.9531 25.3407L16.7636 21.336C16.3266 20.9989 15.7176 20.9989 15.2806 21.336L10.0469 25.3745C9.72185 25.6253 9.25 25.3931 9.25 24.9828V9C9.25 7.75736 10.2574 6.75 11.5 6.75Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}
