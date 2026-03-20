'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/dashboard/Header';
import CategoryTabs from '@/components/dashboard/CategoryTabs';
import CategoryCard from '@/components/dashboard/CategoryCard';
import { Sparkles, Compass } from 'lucide-react';

const ALL_CATEGORIES = [
  { title: '淀粉肠摆摊', type: 'STALL', minCapital: 1800, rec: 4.9, image: '/thumbnails/starch_sausage_cover_1773987973087.png', slug: 'starch-sausage', isDeveloped: true },
  { title: '精品移动咖啡', type: 'MOBILE', minCapital: 35000, rec: 4.5, image: '/thumbnails/mobile_coffee_cover_1773988038295.png', slug: 'mobile-coffee', isDeveloped: false },
  { title: '特色煎饼果子', type: 'STALL', minCapital: 5000, rec: 4.7, image: '/thumbnails/pancake_stall_cover_1773988103430.png', slug: 'pancake-stall', isDeveloped: false },
  { title: '手办潮玩具集合店', type: 'STORE', minCapital: 15000, rec: 4.2, image: '/thumbnails/toy_store_cover_1773988182298.png', slug: 'toy-store', isDeveloped: false },
  { title: '手机贴膜/周边', type: 'TECH', minCapital: 1200, rec: 4.8, image: '/thumbnails/phone_acc_cover_1773988258046.png', slug: 'phone-acc', isDeveloped: false },
  { title: '社区自助洗衣店', type: 'STORE', minCapital: 450000, rec: 4.0, image: '/thumbnails/laundry_self_cover_1773988339800.png', slug: 'laundry-self', isDeveloped: false },
];

export default function Home() {
  const [activeType, setActiveType] = useState('ALL');

  // Filter categories based on selected type
  const filtered = activeType === 'ALL' 
    ? ALL_CATEGORIES 
    : ALL_CATEGORIES.filter(cat => cat.type === activeType);

  return (
    <div className="min-h-screen">
      <Sidebar />
      
      <main className="ml-64 p-10 lg:p-14">
        <Header />

        <div className="space-y-12 transition-all duration-700 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {/* Hero Section */}
          <section className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-gray-900 to-black p-12 text-white">
            <div className="relative z-10 space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-md">
                <Compass className="h-4 w-4 text-orange-400" />
                <span className="text-xs font-black uppercase tracking-widest">赛道探索计划</span>
              </div>
              <h1 className="text-5xl font-black leading-tight">
                找到最适合您的<br />
                <span className="bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">云创业赛道</span>
              </h1>
              <p className="text-lg font-medium text-gray-400 leading-relaxed">
                先锁定兴趣赛道，再进行 AI 多维度成本估算。每一个伟大的企业，都始于一次理性的仿真实验。
              </p>
            </div>
            
            {/* Background Accent */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-orange-400/20 blur-[120px]"></div>
          </section>

          <section className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <CategoryTabs activeType={activeType} onTypeChange={setActiveType} />
              <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                <Sparkles className="h-4 w-4 text-orange-400" />
                <span>实时更新：6 个深度仿真项目可用</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((cat) => (
                <CategoryCard
                  key={cat.slug}
                  title={cat.title}
                  minCapital={cat.minCapital}
                  recommendationScore={cat.rec}
                  image={cat.image}
                  slug={cat.slug}
                  isDeveloped={cat.isDeveloped}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
