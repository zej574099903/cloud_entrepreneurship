'use client';

import React from 'react';
import { Bell, Search } from 'lucide-react';

import Link from 'next/link';

export default function Header() {
  const [nickname, setNickname] = React.useState('');
  const [avatar, setAvatar] = React.useState('https://api.dicebear.com/7.x/avataaars/svg?seed=Felix');

  React.useEffect(() => {
    const fetchProfile = () => {
      const currentUser = localStorage.getItem('currentUser') || 'admin';
      fetch(`/api/profile?username=${currentUser}`, { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            if (data.nickname) setNickname(data.nickname);
            if (data.avatar) setAvatar(data.avatar);
          }
        });
    };

    fetchProfile();

    // Listen for custom event from ProfilePage
    window.addEventListener('profile-updated', fetchProfile);
    return () => window.removeEventListener('profile-updated', fetchProfile);
  }, []);

  return (
    <header className="mb-10 flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-black text-gray-900">
          {nickname ? `${nickname}，下午好` : '下午好'}，开启您的梦想之旅 ✨
        </h2>
        <p className="mt-2 font-medium text-gray-400 uppercase tracking-widest text-xs">
          准备好开启您的云创业之旅了吗？
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center h-12 w-64 rounded-2xl bg-white/60 px-4 ring-1 ring-gray-100 transition-all focus-within:ring-2 focus-within:ring-orange-200 shadow-sm group">
          <Search className="h-4 w-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
          <input
            type="text"
            placeholder="搜索创业类目..."
            className="flex-1 bg-transparent border-none py-3 pl-2 text-sm font-medium outline-none placeholder:text-gray-400"
          />
        </div>
        <button className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/60 shadow-sm ring-1 ring-gray-100 transition-all hover:scale-105 active:scale-95">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
        <Link href="/profile" className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 p-0.5 shadow-lg hover:scale-110 transition-transform">
          <div className="h-full w-full rounded-[14px] bg-white p-0.5">
            <img
              src={avatar}
              alt="Avatar"
              className="h-full w-full rounded-[12px] object-cover"
            />
          </div>
        </Link>
      </div>
    </header>
  );
}
