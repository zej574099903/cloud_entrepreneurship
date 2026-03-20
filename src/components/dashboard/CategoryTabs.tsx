'use client';

import React from 'react';
import { ShoppingBag, Store, Truck, Cpu, LayoutGrid } from 'lucide-react';

export const CATEGORY_TYPES = [
  { id: 'ALL', label: '全部项目', icon: LayoutGrid },
  { id: 'STALL', label: '精选摊位', icon: ShoppingBag },
  { id: 'STORE', label: '实体门店', icon: Store },
  { id: 'MOBILE', label: '移动商业', icon: Truck },
  { id: 'TECH', label: '数字服务', icon: Cpu },
];

interface CategoryTabsProps {
  activeType: string;
  onTypeChange: (type: string) => void;
}

export default function CategoryTabs({ activeType, onTypeChange }: CategoryTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 py-2 overflow-x-auto no-scrollbar">
      {CATEGORY_TYPES.map((type) => {
        const isActive = activeType === type.id;
        const Icon = type.icon;
        return (
          <button
            key={type.id}
            onClick={() => onTypeChange(type.id)}
            className={`flex items-center gap-2.5 rounded-2xl px-6 py-3.5 transition-all duration-300 whitespace-nowrap ${
              isActive
                ? 'bg-gray-900 text-white shadow-xl shadow-gray-200'
                : 'glass text-gray-500 hover:bg-white/80 hover:text-gray-900'
            }`}
          >
            <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-orange-400' : ''}`} />
            <span className="text-sm font-black tracking-wide">{type.label}</span>
          </button>
        );
      })}
    </div>
  );
}
