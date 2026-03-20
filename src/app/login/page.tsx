'use client';

import React, { useState } from 'react';
import { User, Lock, ArrowRight, Sun, LayoutGrid } from 'lucide-react';

export default function LoginPage() {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: account, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        // Simulating session
        localStorage.setItem('currentUser', account);
        setTimeout(() => {
          window.location.href = '/'; 
        }, 1500);
      } else {
        setMessage({ type: 'error', text: data.error || '登录失败' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '连接服务器失败，请检查网络' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-6 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-orange-400/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-blue-400/10 blur-[120px]" />

      <div className="glass relative z-10 w-full max-w-[480px] overflow-hidden rounded-[40px] p-10 md:p-14 transition-all duration-700 hover:shadow-cyan-500/5">
        <div className="mb-12 flex flex-col items-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-400 to-yellow-300 shadow-xl shadow-orange-200/50">
            <Sun className="h-10 w-10 text-white animate-pulse" />
          </div>
          <h1 className="bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-4xl font-black tracking-tight text-transparent">云创业</h1>
          <p className="mt-3 text-base font-medium text-gray-500/80 uppercase tracking-[0.2em]">Cloud Entrepreneurship</p>
          <div className="mt-2 h-1 w-8 rounded-full bg-orange-400/50" />
        </div>

        {message && (
          <div className={`mb-6 rounded-2xl p-4 text-sm font-medium animate-in fade-in slide-in-from-top-2 ${
            message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">账户账号</label>
            </div>
            <div className="relative group">
              <User className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-orange-400" />
              <input
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="请输入您的账号"
                className="w-full rounded-2xl border-2 border-transparent bg-gray-50/50 py-5 pl-14 pr-6 text-gray-900 outline-none transition-all focus:border-orange-200 focus:bg-white shadow-sm placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">身份密码</label>
              <a href="#" className="text-xs font-semibold text-sky-500 hover:text-sky-600 transition-colors">忘记密码?</a>
            </div>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-orange-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border-2 border-transparent bg-gray-50/50 py-5 pl-14 pr-6 text-gray-900 outline-none transition-all focus:border-orange-200 focus:bg-white shadow-sm placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full overflow-hidden rounded-[24px] bg-gray-900 py-5 font-bold text-white transition-all hover:bg-black active:scale-[0.98] disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            {isLoading ? (
              <span className="flex items-center justify-center">
                <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                正在进入蓝图...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                开启梦想之旅 <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            )}
          </button>
        </form>

        <div className="mt-12 text-center border-t border-gray-100 pt-8">
          <p className="text-sm font-medium text-gray-400">
            新创业者？{' '}
            <a href="#" className="text-gray-900 hover:text-orange-500 underline underline-offset-4 transition-colors">
              立即创建通行证
            </a>
          </p>
        </div>
      </div>
      
      {/* Footer Decoration */}
      <div className="absolute bottom-8 text-xs font-bold text-gray-400/40 uppercase tracking-[0.4em] flex items-center gap-4">
        <span>Precision Algorithm</span>
        <div className="h-1 w-1 rounded-full bg-gray-400/30" />
        <span>Professional Insight</span>
      </div>
    </div>
  );
}
