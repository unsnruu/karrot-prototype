import type { Metadata } from "next";
import { HomeNavigationHistoryProvider } from "@/features/home/components/home-navigation-history-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Karrot Prototype",
  description: "당근 스타일 프로토타입으로 홈, 커뮤니티, 상세, 채팅 흐름을 탐색합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <HomeNavigationHistoryProvider>{children}</HomeNavigationHistoryProvider>
      </body>
    </html>
  );
}
