import { useSidebar } from '@/context/SidebarContext';
import React from 'react';

const Backdrop: React.FC = () => {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();

  if (!isMobileOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99] bg-gray-950/60 lg:hidden backdrop-blur-sm"
      onClick={toggleMobileSidebar}
    />
  );
};

export default Backdrop;
