import { BottomNav } from "@/components/navigation/bottom-nav";

// TODO: 각 탭 기능이 구현되면 이 컴포넌트 대신 실제 Screen으로 교체
export function TabPlaceholderScreen({ title }: { title: string }) {
  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <div className="mx-auto min-h-screen max-w-6xl pb-24">
        <h1 className="sr-only">{title}</h1>
        <BottomNav />
      </div>
    </main>
  );
}
