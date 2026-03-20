'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/dashboard/Header';
import { User, Mail, ShieldCheck, PenLine, Save, CheckCircle } from 'lucide-react';

const AVATAR_OPTIONS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aria',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Buster',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Coco',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Olive',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Peanut',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha',
];

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    username: '',
    nickname: '',
    bio: '',
    avatar: AVATAR_OPTIONS[0],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAvatarGallery, setShowAvatarGallery] = useState(false);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser') || 'admin'; // Default fallback
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/profile?username=${currentUser}`, { cache: 'no-store' });
        const data = await res.json();
        if (data && !data.error) {
          setProfile({
            username: data.username || currentUser,
            nickname: data.nickname || '',
            bio: data.bio || '',
            avatar: data.avatar || AVATAR_OPTIONS[0],
          });
        } else {
          setProfile(prev => ({ ...prev, username: currentUser }));
        }
      } catch (e) {
        console.error('Failed to load profile');
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        setShowSuccess(true);
        // Notify other components (like Header) to refresh
        window.dispatchEvent(new Event('profile-updated'));
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (e) {
      alert('保存失败');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="ml-64 p-10 lg:p-14">
        <Header />

        <div className="max-w-4xl mx-auto space-y-10">
          <section className="glass rounded-[40px] p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-orange-100/30 blur-3xl opacity-50"></div>
            
            <div className="relative z-10 flex flex-col items-center md:flex-row md:items-start gap-10">
              {/* Left: Avatar Section */}
              <div className="space-y-6 flex flex-col items-center">
                <div className="relative group">
                  <div className="h-40 w-40 rounded-[48px] bg-gradient-to-br from-orange-400 to-yellow-300 p-1 shadow-2xl shadow-orange-200">
                    <div className="h-full w-full rounded-[44px] bg-white p-1">
                      <img
                        src={profile.avatar}
                        alt="Avatar"
                        className="h-full w-full rounded-[40px] object-cover"
                      />
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAvatarGallery(!showAvatarGallery)}
                  type="button"
                  className="text-sm font-bold text-gray-400 hover:text-orange-500 transition-colors uppercase tracking-widest"
                >
                  {showAvatarGallery ? '关闭预设库' : '更换头像'}
                </button>

                {showAvatarGallery && (
                  <div className="glass absolute top-20 left-0 md:left-24 z-50 mt-10 w-[300px] md:w-[460px] rounded-[32px] p-6 grid grid-cols-5 gap-4 animate-in zoom-in-95 fade-in duration-300">
                    <h6 className="col-span-full text-xs font-black uppercase text-gray-400 tracking-widest mb-2 px-1">头像库预览</h6>
                    {AVATAR_OPTIONS.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setProfile({ ...profile, avatar: url });
                          setShowAvatarGallery(false);
                        }}
                        className={`h-12 w-12 rounded-xl overflow-hidden border-2 transition-all hover:scale-110 active:scale-95 ${
                          profile.avatar === url ? 'border-orange-400 shadow-lg' : 'border-transparent'
                        }`}
                      >
                        <img src={url} alt={`Avatar ${idx}`} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Form Section */}
              <form onSubmit={handleSave} className="flex-1 space-y-8 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">登录账号</label>
                    <div className="flex items-center h-16 rounded-2xl bg-gray-50 px-5 text-gray-400 font-bold border border-transparent cursor-not-allowed">
                      <User className="h-5 w-5 mr-3 opacity-50" />
                      {profile.username}
                    </div>
                    <p className="text-[10px] text-gray-300 ml-1">账号不可修改</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">创业昵称</label>
                    <div className="relative group">
                      <PenLine className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-400 transition-colors" />
                      <input
                        type="text"
                        value={profile.nickname}
                        onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
                        placeholder="想一个响亮的名号"
                        className="w-full h-16 rounded-2xl border-2 border-transparent bg-white py-2 pl-14 pr-4 transition-all focus:border-orange-200 shadow-sm outline-none group-hover:bg-gray-50 font-bold text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">创业宣言 / 简介</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={4}
                    placeholder="简单介绍下您的创业梦想..."
                    className="w-full rounded-3xl border-2 border-transparent bg-white p-6 transition-all focus:border-orange-200 shadow-sm outline-none font-bold text-gray-900"
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-2 text-green-500 font-bold text-sm">
                    {showSuccess && (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        信息已保存到云端数据库
                      </>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 rounded-2xl bg-gray-900 px-10 py-4 text-sm font-bold text-white transition-all hover:bg-black active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-gray-200"
                  >
                    {isSaving ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        保存个人信息
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
