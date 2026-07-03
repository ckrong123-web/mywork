import type { Metadata } from "next";
import { Libre_Caslon_Text, Hanken_Grotesk } from "next/font/google";
import "../styles/globals.scss";

// 제목 폰트 — Libre Caslon Text (400/700, italic 사용)
const libreCaslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display-src",
});

// 본문 폰트 — Hanken Grotesk (가변 폰트, 300~900)
const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body-src",
});

export const metadata: Metadata = {
  title: "STAGEHUB | Premium Performance Booking",
  description:
    "프리미엄 공연 예매 플랫폼 STAGEHUB. 뮤지컬·연극·콘서트의 감동을 가장 특별하게 전달합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${libreCaslon.variable} ${hankenGrotesk.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Material Symbols 는 next/font 미지원 케이스가 많아 stylesheet 로 로드.
            App Router 루트 레이아웃에서의 폰트 stylesheet 링크는 의도된 방식이므로
            Pages Router 전용 lint 규칙(no-page-custom-font)을 비활성화한다. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
