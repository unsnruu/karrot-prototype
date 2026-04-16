import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { HomeNavigationHistoryProvider } from "@/features/home/components/home-navigation-history-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Karrot Prototype",
  description: "당근 스타일 프로토타입으로 홈, 커뮤니티, 상세, 채팅 흐름을 탐색합니다.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <Script
          id="useberry-snippet"
          src="https://api.useberry.com/integrations/liveUrl/scripts/useberryScript.js"
          strategy="afterInteractive"
        />
        <Suspense fallback={children}>
          <AnalyticsProvider />
          <HomeNavigationHistoryProvider>{children}</HomeNavigationHistoryProvider>
        </Suspense>
      </body>
    </html>
  );
}
