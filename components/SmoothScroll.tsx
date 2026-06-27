'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Disable Lenis smooth scroll on admin dashboard & login page
    // to avoid scroll conflicts with full-screen dynamic layouts.
    if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Cleanup function when leaving the page or changing routes
    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, [pathname]);

  return <>{children}</>;
}
