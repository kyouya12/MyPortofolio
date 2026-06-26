'use client';

import React from 'react';
import { SidebarProvider, useSidebar } from '@/context/SidebarContext';
import Sidebar from './Sidebar';
import Header from './Header';
import Backdrop from './Backdrop';

interface AdminLayoutClientProps {
  children: React.ReactNode;
  userEmail: string | null | undefined;
}

function LayoutContent({ children, userEmail }: AdminLayoutClientProps) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic margin-left for desktop based on Sidebar width (290px or 90px)
  const mainContentMargin = isMobileOpen
    ? 'ml-0'
    : isExpanded || isHovered
    ? 'lg:ml-[290px]'
    : 'lg:ml-[90px]';

  return (
    <div className="fixed inset-0 z-[100] flex bg-gray-950 text-gray-200 font-sans antialiased overflow-hidden dark">
      {/* Sidebar and Backdrop overlay */}
      <Sidebar />
      <Backdrop />

      {/* Main Content Area */}
      <div className={`flex-grow h-full flex flex-col overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out ${mainContentMargin}`}>
        {/* Top Header */}
        <Header userEmail={userEmail} />

        {/* Inner page content */}
        <main className="p-6 md:p-8 flex-grow">
          <div className="mx-auto max-w-screen-2xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayoutClient({ children, userEmail }: AdminLayoutClientProps) {
  return (
    <SidebarProvider>
      <LayoutContent userEmail={userEmail}>
        {children}
      </LayoutContent>
    </SidebarProvider>
  );
}
