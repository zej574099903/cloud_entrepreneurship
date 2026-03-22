'use client';

import React, { useState, useMemo } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/dashboard/Header';
import {
    TrendingUp,
    Settings2,
    ShoppingBag,
    Info,
    Layers,
    Sun,
    Coffee,
    Store,
    Wallet,
    PieChart as PieChartIcon,
    ArrowRight,
    ChevronDown,
    Layout
} from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend
} from 'recharts';

// --- Scenarios ---
const SCENARIOS = [
    { id: 'SUMMER_NIGHT', name: '酷夏人气夜市', baseFlow: 150, temp: 35, avgPrice: 15, description: '环境炎热，出汗多，对冰爽冷饮需求极大。虽然竞争多，但流量稳。' },
    { id: 'CAMPUS_GATE', name: '大学城门口', baseFlow: 80, temp: 28, avgPrice: 12, description: '学生群体对价格敏感，追求性价比，流量集中在放学和晚自习。' },
    { id: 'OFFICE_PARK', name: '写字楼下午茶', baseFlow: 45, temp: 26, avgPrice: 18, description: '白领追求品质和颜值，不差钱，但对出餐速度和外卖包材有要求。' }
];

export default function LemonTeaSimulation() {
    // --- Core States ---
    const [selectedScenarioId, setSelectedScenarioId] = useState('SUMMER_NIGHT');
    const [unitPrice, setUnitPrice] = useState(15);

    // --- Editable Costs (V4.2 New Feature) ---
    const [lemonCostPerKg, setLemonCostPerKg] = useState(12);
    const [iceCostPerKg, setIceCostPerKg] = useState(2);
    const [teaBasePerCup, setTeaBasePerCup] = useState(1.2);
    const [packagingPerCup, setPackagingPerCup] = useState(1.5);
    const [dailyRent, setDailyRent] = useState(50);

    // --- Derived Scenario ---
    const scenario = useMemo(() => SCENARIOS.find(s => s.id === selectedScenarioId) || SCENARIOS[0], [selectedScenarioId]);

    // --- Deterministic Logic ---
    const financialResult = useMemo(() => {
        // 1. Calculate Estimated Sales Volume based on Price Elasticity
        // Formula: Volume = BaseFlow * (AvgPrice / UserPrice)^1.5
        // Adjusted for a "Sweet Spot"
        const priceRatio = scenario.avgPrice / unitPrice;
        const volumeIndex = Math.pow(priceRatio, 1.3);
        const estimatedDailySales = Math.floor(scenario.baseFlow * volumeIndex);

        // 2. Constants for usage
        const LEMONS_PER_CUP = 0.15; // kg
        const ICE_PER_CUP = 0.3; // kg (including waste)

        // 3. Daily P&L Calculation
        const revenue = estimatedDailySales * unitPrice;

        const totalLemonCost = estimatedDailySales * LEMONS_PER_CUP * lemonCostPerKg;
        const totalIceCost = estimatedDailySales * ICE_PER_CUP * iceCostPerKg;
        const totalTeaCost = estimatedDailySales * teaBasePerCup;
        const totalPackagingCost = estimatedDailySales * packagingPerCup;

        const variableCostTotal = totalLemonCost + totalIceCost + totalTeaCost + totalPackagingCost;
        const totalCost = variableCostTotal + dailyRent;

        const profit = revenue - totalCost;
        const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
        const unitProfit = unitPrice - (variableCostTotal / estimatedDailySales);

        return {
            sales: estimatedDailySales,
            revenue,
            totalCost,
            profit,
            margin,
            unitProfit,
            lemonCost: totalLemonCost,
            iceCost: totalIceCost,
            teaCost: totalTeaCost,
            packagingCost: totalPackagingCost,
            fixedCost: dailyRent,
            breakeven: Math.ceil(dailyRent / (unitPrice - (variableCostTotal / estimatedDailySales)))
        };
    }, [scenario, unitPrice, lemonCostPerKg, iceCostPerKg, teaBasePerCup, packagingPerCup, dailyRent]);

    // --- Visual Data ---
    const costData = [
        { name: '柠檬', value: financialResult.lemonCost, color: '#f59e0b' },
        { name: '冰块', value: financialResult.iceCost, color: '#0ea5e9' },
        { name: '茶底/辅料', value: financialResult.teaCost, color: '#10b981' },
        { name: '包材', value: financialResult.packagingCost, color: '#8b5cf6' },
        { name: '场地费', value: financialResult.fixedCost, color: '#64748b' }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Sidebar />
            <main className="ml-64 p-8 lg:p-12">
                <Header />

                <div className="mt-8 flex flex-col gap-8 lg:flex-row">
                    {/* Left: Configuration Panel */}
                    <div className="w-full lg:w-[420px] space-y-8">
                        {/* Scenario Selector */}
                        <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-gray-100">
                            <div className="mb-6 flex items-center gap-3">
                                <Layout className="h-5 w-5 text-cyan-500" />
                                <h3 className="text-lg font-black text-gray-900">经营场景预设</h3>
                            </div>
                            <div className="space-y-3">
                                {SCENARIOS.map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => setSelectedScenarioId(s.id)}
                                        className={`group relative w-full overflow-hidden rounded-[24px] border-2 p-5 text-left transition-all ${selectedScenarioId === s.id
                                            ? 'border-cyan-500 bg-cyan-50/50 shadow-md ring-4 ring-cyan-50/20'
                                            : 'border-gray-50 bg-gray-50/30 hover:border-gray-200'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${selectedScenarioId === s.id ? 'text-cyan-600' : 'text-gray-400'}`}>
                                                Scenario Preset
                                            </span>
                                            {selectedScenarioId === s.id && <div className="h-2 w-2 rounded-full bg-cyan-500" />}
                                        </div>
                                        <p className={`text-base font-black ${selectedScenarioId === s.id ? 'text-gray-900' : 'text-gray-500'}`}>{s.name}</p>
                                        <p className="mt-1 text-[11px] font-medium text-gray-400 leading-relaxed">{s.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Core Strategy */}
                        <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-gray-100">
                            <div className="mb-8 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Sun className="h-5 w-5 text-orange-400" />
                                    <h3 className="text-lg font-black text-gray-900">定价策略</h3>
                                </div>
                                <span className="text-2xl font-black text-cyan-500 tracking-tighter">¥{unitPrice}</span>
                            </div>
                            <div className="space-y-6">
                                <input
                                    type="range" min="8" max="25" step="0.5"
                                    value={unitPrice} onChange={(e) => setUnitPrice(Number(e.target.value))}
                                    className="w-full accent-cyan-500"
                                />
                                <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <span>Low Price</span>
                                    <span>High Price</span>
                                </div>

                                <div className="rounded-2xl bg-cyan-50/50 p-4 border border-cyan-100/50">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-cyan-600">当前价格对应预估日销量</span>
                                        <span className="text-lg font-black text-cyan-700">{financialResult.sales} 杯</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Editable Cost Panel (V4.2 Key Feature) */}
                        <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-gray-100">
                            <div className="mb-6 flex items-center gap-3">
                                <Settings2 className="h-5 w-5 text-gray-400" />
                                <h3 className="text-lg font-black text-gray-900">单位成本配置 (可微调)</h3>
                            </div>
                            <div className="space-y-5">
                                {[
                                    { label: '香水柠檬 (¥/kg)', val: lemonCostPerKg, set: setLemonCostPerKg, min: 5, max: 25 },
                                    { label: '冰块采购 (¥/kg)', val: iceCostPerKg, set: setIceCostPerKg, min: 1, max: 10 },
                                    { label: '茶底辅料 (¥/杯)', val: teaBasePerCup, set: setTeaBasePerCup, min: 0.5, max: 5 },
                                    { label: '包材支出 (¥/杯)', val: packagingPerCup, set: setPackagingPerCup, min: 1, max: 4 },
                                    { label: '场地租金 (¥/天)', val: dailyRent, set: setDailyRent, min: 20, max: 200 }
                                ].map((c) => (
                                    <div key={c.label}>
                                        <div className="flex justify-between items-center mb-1.5 px-1">
                                            <label className="text-xs font-bold text-gray-400">{c.label}</label>
                                            <span className="text-xs font-black text-gray-900">¥{c.val}</span>
                                        </div>
                                        <input
                                            type="range" min={c.min} max={c.max} step="0.5"
                                            value={c.val} onChange={(e) => c.set(Number(e.target.value))}
                                            className="w-full accent-gray-400 h-1"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Analysis Dashboard */}
                    <div className="flex-1 space-y-8">
                        {/* Main Result Card */}
                        <div className="rounded-[40px] bg-gray-900 p-10 text-white shadow-2xl shadow-gray-200">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div className="space-y-2">
                                    <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400">Daily Predicted Profit</p>
                                    <h2 className={`text-6xl font-black tracking-tighter ${financialResult.profit >= 0 ? 'text-white' : 'text-red-400'}`}>
                                        ¥{financialResult.profit.toFixed(0)}
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        <span className={`rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-widest ${financialResult.margin >= 25 ? 'bg-green-500' : 'bg-orange-500'}`}>
                                            Margin: {financialResult.margin.toFixed(1)}%
                                        </span>
                                        <span className="text-xs font-bold text-gray-400">ROI: {((financialResult.profit / financialResult.totalCost) * 100).toFixed(1)}%</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <div className="rounded-2xl bg-white/5 p-4 border border-white/10 backdrop-blur-sm">
                                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Break-even Point</p>
                                        <p className="text-xl font-black text-white">卖出 <span className="text-cyan-400">{financialResult.breakeven}杯</span> 回本</p>
                                    </div>
                                    <div className="rounded-2xl bg-white/5 p-4 border border-white/10 backdrop-blur-sm">
                                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Unit Net Profit</p>
                                        <p className="text-xl font-black text-white">单客净赚 <span className="text-green-400">¥{financialResult.unitProfit.toFixed(1)}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cost Breakdown & Revenue Bar */}
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            <div className="rounded-[40px] bg-white p-8 shadow-sm ring-1 ring-gray-100">
                                <div className="mb-8 flex items-center justify-between px-2">
                                    <h3 className="text-xl font-black text-gray-900">成本构成分析</h3>
                                    <PieChartIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={costData}
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {costData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                                formatter={(value: any) => `¥${Number(value).toFixed(1)}`}
                                            />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="rounded-[40px] bg-white p-10 shadow-sm ring-1 ring-gray-100 flex flex-col justify-center">
                                <h3 className="text-xl font-black text-gray-900 mb-8">盈亏平衡分析 (日收支)</h3>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-widest">
                                            <span>Material & Ops Cost</span>
                                            <span className="text-orange-500">¥{financialResult.totalCost.toFixed(0)}</span>
                                        </div>
                                        <div className="h-4 w-full rounded-full bg-gray-50 overflow-hidden">
                                            <div className="h-full bg-orange-400 rounded-full" style={{ width: '40%' }}></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center p-4">
                                        <div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center">
                                            <ArrowRight className="h-6 w-6 text-cyan-600" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-widest">
                                            <span>Daily Expected Revenue</span>
                                            <span className="text-green-500">¥{financialResult.revenue.toFixed(0)}</span>
                                        </div>
                                        <div className="h-4 w-full rounded-full bg-gray-50 overflow-hidden">
                                            <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }}></div>
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-8 text-[11px] font-medium text-gray-400 leading-relaxed text-center">
                                    在当前的配置下，每小时平均预计可出餐 <span className="text-gray-900 font-black">{Math.floor(financialResult.sales / 8)}杯</span>。
                                </p>
                            </div>
                        </div>

                        {/* Deterministic Breakdown Table */}
                        <div className="rounded-[40px] bg-white p-10 shadow-sm ring-1 ring-gray-100">
                            <h3 className="text-xl font-black text-gray-900 mb-8">单日经营财务明细 (预估)</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                            <th className="pb-4">项目名称</th>
                                            <th className="pb-4 text-right">单位成本/价格</th>
                                            <th className="pb-4 text-right">数量/权重</th>
                                            <th className="pb-4 text-right">合计金额</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        <tr className="text-sm">
                                            <td className="py-4 font-bold text-gray-900">柠檬鲜果</td>
                                            <td className="py-4 text-right text-gray-500">¥{lemonCostPerKg}/kg</td>
                                            <td className="py-4 text-right text-gray-500">{(financialResult.sales * 0.15).toFixed(1)} kg</td>
                                            <td className="py-4 text-right font-black text-orange-600">¥{financialResult.lemonCost.toFixed(1)}</td>
                                        </tr>
                                        <tr className="text-sm">
                                            <td className="py-4 font-bold text-gray-900">饮用冰块</td>
                                            <td className="py-4 text-right text-gray-500">¥{iceCostPerKg}/kg</td>
                                            <td className="py-4 text-right text-gray-500">{(financialResult.sales * 0.3).toFixed(1)} kg</td>
                                            <td className="py-4 text-right font-black text-blue-500">¥{financialResult.iceCost.toFixed(1)}</td>
                                        </tr>
                                        <tr className="text-sm">
                                            <td className="py-4 font-bold text-gray-900">茶底及包材</td>
                                            <td className="py-4 text-right text-gray-500">¥{(teaBasePerCup + packagingPerCup).toFixed(1)}/杯</td>
                                            <td className="py-4 text-right text-gray-500">{financialResult.sales} 杯</td>
                                            <td className="py-4 text-right font-black text-green-600">¥{(financialResult.teaCost + financialResult.packagingCost).toFixed(1)}</td>
                                        </tr>
                                        <tr className="text-sm bg-gray-50/50">
                                            <td className="py-4 font-black text-gray-900">单日毛利润</td>
                                            <td className="py-4 text-right font-bold text-gray-500">销售额 - 物料</td>
                                            <td className="py-4 text-right text-gray-500">---</td>
                                            <td className="py-4 text-right font-black text-gray-900">¥{(financialResult.revenue - (financialResult.lemonCost + financialResult.iceCost + financialResult.teaCost + financialResult.packagingCost)).toFixed(0)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
