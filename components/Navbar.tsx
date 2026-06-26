"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // Jangan tampilkan navbar di halaman admin dan login
  if (pathname.startsWith('/login') || pathname.startsWith('/admin')) {
    return null;
  }

  const tabs = [
    { id: "home", label: "Home", href: "/" },
    { id: "about", label: "About", href: "/about" },
    { id: "services", label: "Service/Experience", href: "/services" },
    { id: "project", label: "Project", href: "/project" },
    { id: "contact", label: "Contact", href: "/contact" },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-[95%] md:max-w-3xl px-4">
      {/* Outer navbar container: transparent background with no blur, matching user sketch */}
      <nav className="relative flex items-center justify-start md:justify-between gap-1.5 p-2.5 md:p-3 overflow-x-auto scrollbar-none bg-transparent border border-white/15 rounded-[1.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`relative flex-shrink-0 min-w-max md:flex-1 py-3 md:py-3.5 px-4 md:px-5 text-base md:text-[1.05rem] font-semibold tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand z-10 cursor-pointer ${
                isActive ? "text-brand" : "text-text-secondary hover:text-white"
              }`}
            >
              {/* Sliding Outline Border Indicator from Image 2 */}
              {isActive && (
                <motion.div
                  layoutId="active-outline"
                  className="absolute inset-0 border-2 border-brand rounded-2xl bg-brand/5 shadow-[0_0_18px_rgba(140,255,0,0.2)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10 block text-center">{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
