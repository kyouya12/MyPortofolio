'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SiteHeader() {
  const pathname = usePathname();

  // Hide the global website header on admin dashboard and login pages
  if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full px-6 md:px-12 py-8 flex justify-between items-center bg-gradient-to-b from-bg-main/80 to-transparent backdrop-blur-[2px]">
      <Link 
        href="/"
        className="text-2xl md:text-3xl font-bold tracking-widest text-white hover:text-brand transition-colors cursor-pointer"
      >
        Kyouya
      </Link>
      <Link 
        href="/"
        className="text-2xl md:text-3xl font-bold tracking-widest text-white hover:text-brand transition-colors cursor-pointer"
      >
        Reazmi
      </Link>
    </header>
  );
}
