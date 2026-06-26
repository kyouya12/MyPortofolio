'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSidebar } from '@/context/SidebarContext';
import { 
  Menu, 
  ChevronDown, 
  LogOut, 
  Settings
} from 'lucide-react';
import { logout } from '@/app/login/actions';
import Link from 'next/link';

interface HeaderProps {
  userEmail?: string | null;
}

export default function Header({ userEmail }: HeaderProps) {
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownOpen || dropdownRef.current.contains(target as Node)) return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [dropdownOpen]);



  return (
    <header className="sticky top-0 z-40 flex w-full bg-gray-900 border-b border-gray-800 transition-all duration-300">
      <div className="flex flex-grow items-center justify-between px-6 py-4.5 md:px-8">
        
        {/* Toggle & Search Area */}
        <div className="flex items-center gap-5">
          {/* Sidebar Toggle Button */}
          <button
            onClick={handleToggle}
            className="flex items-center justify-center w-12 h-12 border border-gray-800 rounded-xl bg-gray-950/40 text-gray-400 hover:text-white cursor-pointer transition-colors"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>


        </div>

        {/* Action Widgets / Profile Menu */}
        <div className="flex items-center gap-5">
          {/* User Profile Dropdown Menu */}
          <div className="relative animate-fade-in" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-4 text-left cursor-pointer"
            >
              {/* Profile Details */}
              <div className="hidden text-right md:block">
                <span className="block text-base font-bold text-white leading-none select-none">
                  Administrator
                </span>
                <span className="block text-xs font-semibold text-gray-400 mt-1 select-none">
                  {userEmail}
                </span>
              </div>

              {/* User Avatar Circle */}
              <div className="w-12 h-12 rounded-full border border-brand-500/25 bg-brand-500/10 text-brand-500 flex items-center justify-center font-black font-mono text-base shadow-[0_0_15px_rgba(70,95,255,0.2)] select-none">
                {userEmail ? userEmail.charAt(0).toUpperCase() : 'A'}
              </div>

              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-250 ${
                dropdownOpen ? 'rotate-180' : ''
              }`} />
            </button>

            {/* Dropdown Box */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-3.5 flex w-[280px] flex-col rounded-2xl border border-gray-800 bg-gray-900 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-200">
                <div className="px-3 py-2.5 border-b border-gray-800 pb-3.5">
                  <span className="block font-bold text-white text-base">
                    Administrator
                  </span>
                  <span className="mt-1 block text-xs font-semibold text-gray-400 truncate">
                    {userEmail}
                  </span>
                </div>

                <ul className="flex flex-col gap-1.5 pt-3.5 pb-2.5 border-b border-gray-800">
                  <li>
                    <Link
                      href="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3.5 px-3 py-2.5 font-semibold text-gray-400 rounded-xl text-[15px] hover:bg-gray-800 hover:text-white transition-colors"
                    >
                      <Settings className="w-5 h-5 text-gray-500" />
                      <span>Account Settings</span>
                    </Link>
                  </li>
                </ul>

                {/* Sign Out Trigger Action */}
                <form action={logout}>
                  <button
                    type="submit"
                    className="flex items-center gap-3.5 w-full text-left px-3 py-2.5 mt-2.5 font-semibold text-gray-400 rounded-xl text-[15px] hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-5 h-5 text-gray-500" />
                    <span>Sign Out</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
