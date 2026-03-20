'use client';

import React, { useState } from 'react';
import { Coins } from 'lucide-react';

interface CapitalSliderProps {
  onValueChange: (value: number) => void;
}

export default function CapitalSlider({ onValueChange }: CapitalSliderProps) {
  const [value, setValue] = useState(5000);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setValue(newValue);
    onValueChange(newValue);
  };

  return (
    <section className="glass relative overflow-hidden rounded-[32px] p-8 md:p-10 transition-all duration-500 hover:shadow-orange-200/20">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-orange-500">
            <Coins className="h-5 w-5" />
            <span className="text-sm font-black uppercase tracking-[0.2em]">资金匹配</span>
          </div>
          <h3 className="text-2xl font-black text-gray-900">预算拨盘</h3>
          <p className="text-sm font-medium text-gray-400">滑动匹配符合您启动资金的创业项目</p>
        </div>

        <div className="flex-1 max-w-2xl px-4">
          <div className="mb-6 flex items-end justify-between px-2">
            <span className="text-xs font-bold text-gray-300">¥1,000</span>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-black tracking-tighter text-gray-900">
                ¥{value >= 10000 ? `${(value / 10000).toFixed(1)}w` : value.toLocaleString()}
              </span>
              <div className="h-1 w-12 rounded-full bg-orange-400 mt-1 shadow-lg shadow-orange-200"></div>
            </div>
            <span className="text-xs font-bold text-gray-300">¥500,000+</span>
          </div>
          
          <input
            type="range"
            min="1000"
            max="500000"
            step={value < 20000 ? 500 : 5000}
            value={value}
            onChange={handleChange}
            className="h-3 w-full cursor-pointer appearance-none rounded-full bg-gray-100 accent-orange-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Background Decorative */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-orange-100/30 blur-3xl opacity-50"></div>
    </section>
  );
}
