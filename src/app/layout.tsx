import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ChannelTalk } from "@/components/ChannelTalk";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Deadline Fairy | 마감 요정",
  description: "당신의 마감을 지켜드립니다. 무자비한 AI 매니저와 함께 목표를 달성하세요.",
  metadataBase: new URL("https://deadline-fairy.kr"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "https://deadline-fairy.kr",
    siteName: "마감 요정",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <ChannelTalk />
        <main className="min-h-screen flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
