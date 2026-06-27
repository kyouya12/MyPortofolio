'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/context/SidebarContext';
import { 
  LayoutDashboard, 
  FolderGit2, 
  Code, 
  User, 
  ArrowLeft,
  Globe,
  Briefcase
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleMobileSidebar } = useSidebar();

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      name: 'Projects',
      href: '/admin/projects',
      icon: FolderGit2,
    },
    {
      name: 'Experiences',
      href: '/admin/experiences',
      icon: Briefcase,
    },
    {
      name: 'Skills',
      href: '/admin/skills',
      icon: Code,
    },
    {
      name: 'About Me',
      href: '/admin/about',
      icon: User,
    },
    {
      name: 'Contact Settings',
      href: '/admin/contact',
      icon: Globe,
    },
  ];

  const isSidebarVisible = isExpanded || isHovered || isMobileOpen;

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col h-screen bg-gray-900 border-r border-gray-800 transition-all duration-300 ease-in-out ${
        isSidebarVisible ? 'w-[310px]' : 'w-[100px]'
      } ${
        isMobileOpen 
          ? 'translate-x-0' 
          : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* SIDEBAR HEADER */}
      <div className={`flex items-center justify-between gap-2 px-6 py-6.5 border-b border-gray-800 ${
        isSidebarVisible ? '' : 'lg:justify-center lg:px-4'
      }`}>
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-brand flex items-center justify-center text-black font-black text-xl shadow-[0_0_15px_rgba(140,255,0,0.25)]">
            A
          </div>
          {isSidebarVisible && (
            <span className="text-2xl font-black tracking-wider text-white select-none">
              Azmi<span className="text-brand">Admin</span>
            </span>
          )}
        </Link>

        {/* Hamburger close button (mobile only) */}
        <button
          onClick={toggleMobileSidebar}
          className="block lg:hidden text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-800 cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {/* SIDEBAR BODY */}
      <div className="no-scrollbar flex flex-col overflow-y-auto flex-grow p-5">
        {/* Navigation Group */}
        <nav className="mt-4 px-1">
          <div>
            {isSidebarVisible ? (
              <h3 className="mb-4.5 ml-4 text-[11px] font-mono tracking-widest text-gray-400 uppercase font-semibold">
                Menu
              </h3>
            ) : (
              <div className="w-full h-px bg-gray-800 mb-6 mt-2" />
            )}

            <ul className="flex flex-col gap-2.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                
                // Active matching including sub-routes (e.g. /admin/projects/new matches /admin/projects)
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`menu-item group ${
                        isActive ? 'menu-item-active' : 'menu-item-inactive'
                      } ${!isSidebarVisible ? 'lg:justify-center px-2' : ''}`}
                      title={!isSidebarVisible ? item.name : undefined}
                    >
                      <Icon className={`w-6 h-6 flex-shrink-0 ${
                        isActive ? 'menu-item-icon-active' : 'menu-item-icon-inactive'
                      }`} />
                      {isSidebarVisible && <span className="text-[15px] font-semibold">{item.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </div>
      
      {/* Sidebar Footer Link back to main site */}
      <div className="p-5 border-t border-gray-800">
        <Link
          href="/"
          className={`flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-base font-semibold text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-300 ${
            !isSidebarVisible ? 'lg:justify-center px-2' : ''
          }`}
          title={!isSidebarVisible ? 'Lihat Website Utama' : undefined}
        >
          <Globe className="w-6 h-6 flex-shrink-0 text-gray-400 group-hover:text-white" />
          {isSidebarVisible && <span className="text-[15px]">Lihat Website</span>}
        </Link>
      </div>
    </aside>
  );
}
