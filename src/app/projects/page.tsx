'use client';

import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/dashboard/Header';
import { useProjects } from '@/context/ProjectContext';
import CategoryCard from '@/components/dashboard/CategoryCard';
import { FolderKanban, Plus } from 'lucide-react';
import Link from 'next/link';

export default function MyProjectsPage() {
    const { joinedProjects } = useProjects();

    return (
        <div className="min-h-screen">
            <Sidebar />

            <main className="ml-64 p-10 lg:p-14">
                <Header />

                <div className="space-y-12">
                    {/* Hero Section */}
                    <section className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-gray-900 to-black p-12 text-white">
                        <div className="relative z-10 space-y-6 max-w-2xl">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-md">
                                <FolderKanban className="h-4 w-4 text-orange-400" />
                                <span className="text-xs font-black uppercase tracking-widest">我的创业蓝图</span>
                            </div>
                            <h1 className="text-5xl font-black leading-tight">
                                已加入的<br />
                                <span className="bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">仿真实验项目</span>
                            </h1>
                            <p className="text-lg font-medium text-gray-400 leading-relaxed">
                                在这里管理您所有感兴趣的项目，快速开启深度仿真实验，早日实现创业梦想。
                            </p>
                        </div>

                        {/* Background Accent */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-orange-400/20 blur-[120px]"></div>
                    </section>

                    {/* Projects Grid */}
                    <section className="space-y-10">
                        {joinedProjects.length > 0 ? (
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {joinedProjects.map((project) => (
                                    <CategoryCard
                                        key={project.slug}
                                        title={project.title}
                                        minCapital={project.minCapital}
                                        recommendationScore={project.recommendationScore}
                                        image={project.image}
                                        slug={project.slug}
                                        isDeveloped={true}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 space-y-6 rounded-[48px] bg-gray-50/50 border-2 border-dashed border-gray-100">
                                <div className="h-20 w-20 rounded-3xl bg-white shadow-xl flex items-center justify-center text-gray-300">
                                    <Plus className="h-10 w-10" />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-black text-gray-900">暂无加入的项目</h3>
                                    <p className="text-sm font-medium text-gray-400 mt-2">去首页发现更多精彩赛道吧</p>
                                </div>
                                <Link
                                    href="/"
                                    className="px-8 py-3.5 bg-gray-900 text-white font-black rounded-2xl transition-all hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-200"
                                >
                                    返回首页
                                </Link>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}
