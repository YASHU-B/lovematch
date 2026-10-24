import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeartBackground } from "@/components/HeartBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LoveMatch — Who Knows Who Better? | Couples & Friends Quiz",
  description: "The modern, mobile-first couples multiplayer quiz. Answer privately, reveal simultaneously, and discover your Love Sync Score!",
  keywords: ["couples quiz", "who knows who better", "relationship game", "love match", "two player game", "dating quiz"],
  authors: [{ name: "LoveMatch Team" }],
  openGraph: {
    title: "LoveMatch — Who Knows Who Better?",
    description: "Answer. Reveal. Discover how in sync you really are.",
    url: "https://lovematch.app",
    siteName: "LoveMatch",
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "LoveMatch — Who Knows Who Better?",
    description: "The real two-player couples quiz. Answer privately, reveal simultaneously!"
  },
  icons: {
    icon: "/favicon.ico"
  }
};

export const viewport: Viewport = {
  themeColor: "#25112F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#25112F] text-[#FFF8FC] selection:bg-pink-500 selection:text-white">
        <HeartBackground />
        <Navbar />
        <main className="flex-1 flex flex-col relative z-10 w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
