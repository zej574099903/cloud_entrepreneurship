'use client';

import React from 'react';
import { ArrowUpRight, Star } from 'lucide-react';
import Link from 'next/link';

interface CategoryCardProps {
  title: string;
  minCapital: number;
  recommendationScore: number;
  image: string;
  slug: string;
  isDeveloped?: boolean;
}

export default function CategoryCard({ title, minCapital, recommendationScore, image, slug, isDeveloped = true }: CategoryCardProps) {
  return (
    <div className={`glass group relative overflow-hidden rounded-[32px] transition-all duration-500 ${
      isDeveloped 
        ? 'hover:-translate-y-2 hover:bg-white/80 hover:shadow-xl hover:shadow-orange-200/30' 
        : 'opacity-60 grayscale cursor-not-allowed'
    }`}>
      {/* Cover Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className={`h-full w-full object-cover transition-transform duration-700 ${isDeveloped ? 'group-hover:scale-110' : ''}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 transition-opacity"></div>
        
        {/* Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-orange-600 shadow-sm">
          <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
          <span className="text-xs font-black">{recommendationScore.toFixed(1)}</span>
        </div>

        {!isDeveloped && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <span className="rounded-full bg-white/20 px-4 py-1.5 text-xs font-black text-white outline outline-1 outline-white/30 backdrop-blur-md">
              研发中...
            </span>
          </div>
        )}
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h4 className="text-xl font-black text-gray-900">{title}</h4>
          <p className="mt-1 text-sm font-medium text-gray-400">起步预算：<span className="text-gray-900">¥{minCapital.toLocaleString()}</span></p>
        </div>

        {isDeveloped ? (
          <Link 
            href={`/simulation/${slug}`}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 py-3.5 text-sm font-black text-white transition-all hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-200"
          >
            立即进行仿真
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        ) : (
          <div className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-100 py-3.5 text-sm font-black text-gray-400">
            暂未开放
          </div>
        )}
      </div>

      {/* Hover Background Accent */}
      {isDeveloped && (
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-orange-400 to-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      )}
    </div>
  );
}
