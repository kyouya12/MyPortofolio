"use client";

import Link from "next/link";
import ScrollReveal from "../components/ScrollReveal";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <section 
      id="home" 
      className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center py-12"
    >
      <div className="flex flex-col items-center text-center space-y-10 py-12">
        {/* Hero Title: [Web] Developer */}
        <ScrollReveal delay={0.1} direction="up" trigger="mount">
          <h1 className="flex flex-wrap items-center justify-center gap-3 md:gap-5 text-4xl sm:text-6xl md:text-8xl font-black tracking-tight text-white select-none">
            <span className="border-3 md:border-4 border-white px-5 py-1 md:px-7 md:py-2 rounded-[2.5rem] inline-flex items-center justify-center transition-all duration-300 hover:border-brand hover:text-brand hover:scale-105 shadow-[0_4px_20px_rgba(255,255,255,0.05)]">
              Web
            </span>
            <span className="text-brand">Developer</span>
          </h1>
        </ScrollReveal>

        {/* Subtitle */}
        <ScrollReveal delay={0.25} direction="up" trigger="mount">
          <p className="text-3xl sm:text-4xl md:text-5xl text-text-secondary font-medium tracking-wide max-w-2xl px-4 pt-6">
            Hii I'am Azmi Wanna know about me?
          </p>
        </ScrollReveal>

        {/* CTA Button: Let's Go */}
        <ScrollReveal delay={0.4} direction="up" trigger="mount">
          <div className="pt-4">
            <Link
              href="/about"
              className="group relative border-2 border-white hover:border-brand px-10 py-3.5 rounded-[1.25rem] text-xl font-bold tracking-wide text-white hover:text-black hover:bg-brand transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.02)] hover:shadow-[0_0_30px_rgba(140,255,0,0.3)] flex items-center gap-3 overflow-hidden cursor-pointer"
            >
              <span>Let's Go</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
