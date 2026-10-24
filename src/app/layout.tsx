import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { KawaiiSkyBackground } from "@/components/KawaiiSkyBackground";

export const metadata: Metadata = {
  title: "Don't Block Me — Find Your Fake Friends | LoveMatch Quiz",
  description: "Find friends you can't trust with Don't Block Me! Create your quiz, test your friends, reveal fake friends, and see who gets blocked!",
  keywords: ["dont block me", "fake friends quiz", "block you test me", "who knows me best", "friendship quiz", "love match"],
  authors: [{ name: "YouTest / LoveMatch" }],
  openGraph: {
    title: "Find Friends you can't trust — Don't Block Me",
    description: "Create your quiz and find friends who you can't trust!",
    url: "https://love2match.vercel.app",
    siteName: "Don't Block Me",
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Don't Block Me — Find Your Fake Friends",
    description: "Create your custom test, share on WhatsApp/Snapchat, and see who gets blocked!"
  },
  icons: {
    icon: "/favicon.ico"
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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#8AC0EF] text-[#1E293B] selection:bg-pink-400 selection:text-white">
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
