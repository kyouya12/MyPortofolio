import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import InteractiveBackground from "../components/InteractiveBackground";
import Navbar from "../components/Navbar";
import SiteHeader from "../components/SiteHeader";
import SmoothScroll from "../components/SmoothScroll";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Azmi | Web Developer Portfolio",
  description: "Creative Web Developer building high-performance, beautiful, and user-centric digital experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased font-sans`}
      suppressHydrationWarning
    >
      <body 
        className="min-h-full bg-bg-main text-text-primary flex flex-col selection:bg-brand selection:text-black relative overflow-x-hidden font-sans"
        suppressHydrationWarning
      >
        <SmoothScroll>
          {/* FIXED BACKGROUND CANVAS (So scrolling text glides on top of it) */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            {/* Interactive particles background */}
            <InteractiveBackground />
            
            {/* Linear fade mask to transition the background smoothly */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-main/15 to-bg-main/80" />
          </div>

          {/* Dynamic Website Header */}
          <SiteHeader />

          {/* MAIN PAGE CONTENT WRAPPER */}
          <main className="relative z-10 w-full max-w-[98rem] mx-auto px-6 md:px-12 flex-1 flex flex-col">
            {children}
          </main>

          {/* Floating Bottom Navbar */}
          <Navbar />
        </SmoothScroll>
      </body>
    </html>
  );
}
