import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { KawaiiSkyBackground } from "@/components/KawaiiSkyBackground";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap"
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dontblockme2.vercel.app"),
  title: "Find Friends you can't trust - Don't Block Me 2",
  description: "Find friends you shouldn't trust with Don't Block Me 2. Create your quiz and find friends who you can't trust!",
  keywords: ["dontblockme2", "dont block me 2", "find friends you cant trust", "fake friends quiz", "block you test me", "who knows me best"],
  authors: [{ name: "Don't Block Me 2" }],
  openGraph: {
    title: "Find Friends you can't trust - Don't Block Me 2",
    description: "Find friends you shouldn't trust with Don't Block Me 2. Create your quiz and find friends who you can't trust!",
    url: "https://dontblockme2.vercel.app",
    siteName: "Don't Block Me 2",
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Friends you can't trust - Don't Block Me 2",
    description: "Create your quiz and find friends who you can't trust!"
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    apple: "/apple-icon.svg",
    shortcut: "/favicon.svg"
  }
};

export const viewport: Viewport = {
  themeColor: "#8AC0EF",
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
    <html lang="en" className={`${fredoka.variable} ${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#8AC0EF] text-[#1E293B] selection:bg-pink-400 selection:text-white font-sans">
        <KawaiiSkyBackground />
        <Navbar />
        <main className="flex-1 flex flex-col relative z-10 w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
