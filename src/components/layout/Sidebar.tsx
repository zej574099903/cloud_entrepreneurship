'use client';

import React from 'react';
import { Home, PlayCircle, FolderKanban, User, Settings, LogOut, CloudSun } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { icon: Home, label: '首页中心', href: '/' },
  { icon: PlayCircle, label: '仿真实验', href: '/simulation' },
  { icon: FolderKanban, label: '我的项目', href: '/projects' },
  { icon: User, label: '个人中心', href: '/profile' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-white/5 backdrop-blur-2xl">
      <div className="flex h-full flex-col p-6">
        {/* Logo */}
        <div className="mb-10 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-yellow-300 shadow-lg shadow-orange-200/50">
            <CloudSun className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-gray-900">云创业</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-300 ${
                  isActive
                    ? 'bg-gray-900 text-white shadow-lg shadow-gray-200'
                    : 'text-gray-500 hover:bg-white/50 hover:text-gray-900'
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-orange-400' : ''}`} />
                <span className="font-bold">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="space-y-2 pt-6 border-t border-gray-100">
          <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-gray-500 transition-all hover:bg-red-50 hover:text-red-500">
            <LogOut className="h-5 w-5" />
            <span className="font-bold">退出登录</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
