function SkeletonBlock({ className }: { className: string }) {
  return <div aria-hidden="true" className={`rounded-full bg-[#eef2f6] ${className}`} />;
}

function HomeFeedSkeletonItem() {
  return (
    <article className="mb-4 border-b border-[#eceef2] pb-4">
      <div className="flex items-start gap-[21px]">
        <div
          aria-hidden="true"
          className="h-[120px] w-[120px] shrink-0 rounded-[8px] bg-[#eef2f6]"
        />

        <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch">
          <div className="flex items-start">
            <div className="min-w-0 flex-1">
              <div aria-hidden="true" className="h-5 w-[78%] rounded-full bg-[#eef2f6]" />
              <div aria-hidden="true" className="mt-2 h-5 w-[54%] rounded-full bg-[#f4f7fa]" />

              <div className="mt-3 flex items-center gap-2">
                <SkeletonBlock className="h-4 w-12" />
                <SkeletonBlock className="h-4 w-16" />
                <SkeletonBlock className="h-4 w-14" />
              </div>

              <div aria-hidden="true" className="mt-3 h-5 w-24 rounded-full bg-[#e5ebf1]" />
            </div>

            <div aria-hidden="true" className="ml-2 h-6 w-6 shrink-0 rounded-full bg-[#f1f5f9]" />
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <SkeletonBlock className="h-4 w-10" />
            <SkeletonBlock className="h-4 w-10" />
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#111827]">
      <div className="min-h-screen animate-pulse bg-white pb-[84px]">
        <header className="sticky top-0 z-20 border-b border-black/5 bg-white/95 backdrop-blur">
          <div className="mobile-shell-wide bg-white/95 px-4 pt-5 sm:px-6">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-2">
                <div aria-hidden="true" className="h-8 w-20 rounded-full bg-[#eef2f6]" />
                <div aria-hidden="true" className="h-6 w-6 rounded-full bg-[#f1f5f9]" />
              </div>

              <div className="flex items-center gap-3">
                <div aria-hidden="true" className="h-8 w-8 rounded-full bg-[#eef2f6]" />
                <div aria-hidden="true" className="h-8 w-8 rounded-full bg-[#eef2f6]" />
                <div aria-hidden="true" className="h-8 w-8 rounded-full bg-[#eef2f6]" />
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-hidden py-1">
              <SkeletonBlock className="h-9 w-14" />
              <SkeletonBlock className="h-9 w-20" />
              <SkeletonBlock className="h-9 w-16" />
              <SkeletonBlock className="h-9 w-24" />
              <SkeletonBlock className="h-9 w-[4.5rem]" />
            </div>
          </div>
        </header>

        <section className="mobile-shell-wide px-4 pb-6 pt-4 sm:px-6">
          <div className="rounded-[28px] bg-white lg:px-2">
            <HomeFeedSkeletonItem />
            <HomeFeedSkeletonItem />
            <HomeFeedSkeletonItem />
            <HomeFeedSkeletonItem />
          </div>
        </section>
      </div>
    </main>
  );
}
