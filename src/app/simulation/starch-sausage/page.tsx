'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/dashboard/Header';
import {
  ArrowLeft,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Play,
  ShoppingCart,
  Wrench,
  MapPin,
  Plus,
  Trash2,
  Calculator,
  Target,
  Info,
  Zap,
  CloudRain,
  ShieldAlert,
  Users,
  Box,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine
} from 'recharts';

// --- Type Definitions ---
interface CostItem {
  name: string;
  cost: number;
}

export default function StarchSausageSimulationV2() {
  const [fixedAssets, setFixedAssets] = useState<CostItem[]>([
    { name: '自动旋转烤肠机/卡式炉', cost: 350 },
    { name: '折叠式摆摊车', cost: 200 },
    { name: '户外动力电源/气罐', cost: 120 },
    { name: '灯牌与宣传物料', cost: 80 },
  ]);

  const [dailyRent, setDailyRent] = useState(20);
  const [dailyTraffic, setDailyTraffic] = useState(2000);
  const [price, setPrice] = useState(4);
  const [conversionRate, setConversionRate] = useState(0.08);

  // --- Realism Refinements ---
  const [unitSausageCost, setUnitSausageCost] = useState(1.2);
  const [unitOtherCost, setUnitOtherCost] = useState(0.3); // sticks, bags, sauce
  const [wastageRate, setWastageRate] = useState(0.05); // 5% wastage
  const [isRainy, setIsRainy] = useState(false);
  const [riskLevel, setRiskLevel] = useState<'LOW' | 'HIGH'>('LOW');

  // --- New Investment Details ---
  const [initialStockCost, setInitialStockCost] = useState(200); // 首次备货
  const [cashReserve, setCashReserve] = useState(100); // 零钱/备用金
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  // --- V2.4 Advanced Strategy States ---
  const [operatingHours, setOperatingHours] = useState(4); // 核心营业时长
  const [maxHourlyOutput, setMaxHourlyOutput] = useState(40); // 每小时出餐上限
  const [comboEnabled, setComboEnabled] = useState(false); // 是否开启套餐
  const [comboRate, setComboRate] = useState(0.3); // 套餐转化率
  const [comboProfit, setComboProfit] = useState(2); // 套餐额外利润

  const applyScenario = (scenario: any) => {
    setDailyTraffic(scenario.data.traffic);
    setConversionRate(scenario.data.conversion);
    setPrice(scenario.data.price);
    setDailyRent(scenario.data.dataRent || scenario.data.rent);
    setRiskLevel(scenario.data.risk);
    setActiveScenario(scenario.id);
  };

  const SCENARIOS = [
    {
      name: '校门口',
      id: 'school',
      icon: <Users className="h-4 w-4" />,
      desc: '高流量、高转化、低客单',
      color: 'bg-orange-600',
      activeColor: 'bg-orange-100/20',
      data: { traffic: 3500, conversion: 0.12, price: 3, rent: 15, risk: 'LOW' as const }
    },
    {
      name: '地铁口',
      id: 'subway',
      icon: <Zap className="h-4 w-4" />,
      desc: '节奏快、高租金、高风险',
      color: 'bg-gray-900',
      activeColor: 'bg-white/20',
      data: { traffic: 8000, conversion: 0.05, price: 5, rent: 80, risk: 'HIGH' as const }
    },
    {
      name: '网红夜市',
      id: 'night',
      icon: <Sparkles className="h-4 w-4" />,
      desc: '下午出摊、高租金、正规化',
      color: 'bg-indigo-600',
      activeColor: 'bg-indigo-100/20',
      data: { traffic: 6000, conversion: 0.10, price: 4, rent: 150, risk: 'LOW' as const }
    },
    {
      name: '大型社区',
      id: 'community',
      icon: <Box className="h-4 w-4" />,
      desc: '流量稳定、极高转化、亲民',
      color: 'bg-emerald-600',
      activeColor: 'bg-emerald-100/20',
      data: { traffic: 1500, conversion: 0.18, price: 4, rent: 10, risk: 'LOW' as const }
    }
  ];

  const [isSimulating, setIsSimulating] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [aiAdvice, setAiAdvice] = useState<string>('');

  const addAsset = () => setFixedAssets([...fixedAssets, { name: '新增条目', cost: 0 }]);
  const updateAsset = (index: number, key: keyof CostItem, value: any) => {
    const newAssets = [...fixedAssets];
    // If it's a number field and the value is empty string, we can temporarily allow it or use 0
    // But for the input to FEEL right, we handle it in the component level mostly
    newAssets[index] = { ...newAssets[index], [key]: value };
    setFixedAssets(newAssets);
  };
  const removeAsset = (index: number) => setFixedAssets(fixedAssets.filter((_, i) => i !== index));

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const totalFixed = fixedAssets.reduce((sum, item) => sum + item.cost, 0);
      const initialInvestment = totalFixed + initialStockCost + cashReserve;

      const totalUnitCost = unitSausageCost + unitOtherCost;
      const dailyData = [];
      let cumulativeCash = -initialInvestment;
      let totalRevenueAccum = 0;
      let totalProfitAccum = 0;
      let totalLostRevenue = 0;

      for (let i = 1; i <= 30; i++) {
        // Vary traffic slightly (+/- 15%)
        const dayTrafficBase = isRainy ? dailyTraffic * 0.3 : dailyTraffic;
        const dayTraffic = dayTrafficBase * (0.85 + Math.random() * 0.3);
        const potentialSales = Math.floor(dayTraffic * conversionRate);

        // Capacity Constraint
        const dailyCapacity = operatingHours * maxHourlyOutput;
        const actualSales = Math.min(potentialSales, dailyCapacity);
        const lostSales = Math.max(0, potentialSales - actualSales);
        totalLostRevenue += lostSales * price;

        // Strategy: Combo upsell
        const extraComboProfit = actualSales * (comboEnabled ? (comboRate * comboProfit) : 0);

        // Wastage
        const producedVolume = Math.ceil(actualSales * (1 + wastageRate));
        const dailyMaterialCost = producedVolume * totalUnitCost;

        const dailyRevenue = actualSales * price + extraComboProfit;
        const dailyNetProfit = dailyRevenue - dailyMaterialCost - dailyRent;

        cumulativeCash += dailyNetProfit;
        totalRevenueAccum += dailyRevenue;
        totalProfitAccum += dailyNetProfit;

        dailyData.push({
          day: i,
          profit: Math.floor(dailyNetProfit),
          revenue: Math.floor(dailyRevenue),
          lostRevenue: Math.floor(lostSales * price),
          cashFlow: Math.floor(cumulativeCash)
        });
      }

      const avgDailyProfit = Math.floor(totalProfitAccum / 30);
      const avgDailyRevenue = Math.floor(totalRevenueAccum / 30);
      const avgDailySales = Math.floor(totalRevenueAccum / price / 30);
      const roiDays = avgDailyProfit > 0 ? Math.ceil(initialInvestment / avgDailyProfit) : -1;

      let riskScore = 25;
      if (riskLevel === 'HIGH') riskScore += 40;
      if (avgDailyProfit < 50) riskScore += 25;
      if (wastageRate > 0.1) riskScore += 10;

      const risks = [];
      if (riskLevel === 'HIGH') risks.push({ type: '避雷：执法风险', level: '高', desc: '流动摊位随时面临城管巡查，不仅影响生意，还有没收工具风险。' });
      if (isRainy) risks.push({ type: '提示：天气亏损', level: '中', desc: '雨天会导致客流量暴跌 70%，建议休息或准备外送。' });
      if (wastageRate > 0.1) risks.push({ type: '改进：损耗预警', level: '中', desc: '损耗率超过 10%，请检查烤制温度或备货模式。' });
      if (conversionRate < 0.05) risks.push({ type: '避雷：选址风险', level: '中', desc: '转化率偏低，建议更换地段或调整口味。' });

      setReport({
        initialInvestment,
        monthlyNetProfit: Math.floor(totalProfitAccum),
        avgDailyProfit,
        roiDays,
        riskScore: Math.min(riskScore, 100),
        risks,
        totalRevenue: Math.floor(totalRevenueAccum),
        totalLostRevenue: Math.floor(totalLostRevenue),
        chartData: dailyData,
        breakEvenSales: Math.ceil((dailyRent + (totalFixed / 30)) / (price - totalUnitCost * (1 + wastageRate))),
        wastageCost: Math.ceil(avgDailySales * wastageRate * totalUnitCost)
      });

      // Fetch Real AI Advice
      setAiAdvice('AI 正在深度分析经营模型...');
      fetch('/api/simulation/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: '淀粉肠摆摊',
          results: {
            netProfit: avgDailyProfit,
            roi: avgDailyProfit > 0 ? (avgDailyProfit * 30 / initialInvestment) : 0,
            revenue: avgDailyRevenue,
            salesVolume: avgDailySales,
            wastage: wastageRate,
            lostRevenue: totalLostRevenue
          },
          scenario: `${activeScenario || '自定义'} ${isRainy ? '雨天模拟' : '常规天气'}, ${riskLevel === 'HIGH' ? '无证流动模式' : '正规合规模式'}, 套餐策略: ${comboEnabled ? '开启' : '关闭'}`
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.advice) setAiAdvice(data.advice);
          else setAiAdvice('根据数据，建议您关注人流转化。保持稳定的口味是回头客的关键。');
        })
        .catch(() => setAiAdvice('AI 连接超时。建议：初期通过低价引流，后期靠秘制蘸料建立护城河。'));

      setIsSimulating(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <main className="ml-64 p-10 lg:p-14">
        <Header />

        <div className="mx-auto max-w-[1600px]">
          <div className="mb-14 flex items-end justify-between border-b border-gray-100 pb-10">
            <div className="flex items-center gap-8">
              <Link href="/" className="group flex h-16 w-16 items-center justify-center rounded-[24px] bg-white shadow-xl shadow-gray-100 transition-all hover:scale-110 active:scale-95">
                <ArrowLeft className="h-7 w-7 text-gray-400 group-hover:text-gray-900 transition-colors" />
              </Link>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-widest">Enterprise Edition</span>
                  <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Starch Sausage Simulation v2.2</span>
                </div>
                <h2 className="text-5xl font-black text-gray-900 tracking-tightest">创业盈利仿真实验室</h2>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Last Update</p>
              <p className="text-lg font-black text-gray-900">2026.03.20</p>
            </div>
          </div>

          <div className="space-y-16">
            {/* SCENARIO SELECTOR: ONE-CLICK PRESETS */}
            <div className="bg-white/50 backdrop-blur-sm p-4 rounded-[32px] border border-gray-100/50 shadow-sm flex items-center gap-6 overflow-x-auto no-scrollbar">
              <div className="flex-shrink-0 flex items-center gap-3 pl-2">
                <div className="h-10 w-10 rounded-2xl bg-gray-900 flex items-center justify-center text-white shadow-lg">
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="text-sm font-black text-gray-900 uppercase tracking-widest whitespace-nowrap">场景预设</span>
              </div>
              <div className="h-8 w-px bg-gray-200"></div>
              <div className="flex items-center gap-3">
                {SCENARIOS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => applyScenario(s)}
                    className={`px-6 py-4 rounded-2xl flex items-center gap-3 transition-all border whitespace-nowrap ${activeScenario === s.id ? `${s.color} text-white border-transparent shadow-xl -translate-y-1` : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200 hover:text-gray-600'}`}
                  >
                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${activeScenario === s.id ? s.activeColor : 'bg-gray-50'}`}>
                      {s.icon}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-black leading-none mb-1">{s.name}</p>
                      <p className={`text-[10px] ${activeScenario === s.id ? 'text-white/60' : 'text-gray-400'} font-bold`}>{s.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex-1"></div>
              <p className="hidden xl:block text-[11px] font-bold text-gray-300 italic pr-4">提示：点击预设可自动填充真实地段的人流与经营数据</p>
            </div>

            {/* STAGE A: CONFIGURATION - HORIZONTAL STEPS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">

              {/* Step 1: Investment */}
              <div className="glass rounded-[48px] p-8 lg:p-10 space-y-10 shadow-xl shadow-gray-100/50 flex flex-col h-full">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-3xl bg-orange-50 flex items-center justify-center text-orange-600 font-black text-xl flex-shrink-0">1</div>
                  <div>
                    <h3 className="text-xl xl:text-2xl font-black text-gray-900 leading-tight">第一步：启动投入筹备</h3>
                    <p className="text-xs font-bold text-gray-400">设备、备货与应急金</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {fixedAssets.map((asset, i) => (
                    <div key={i} className="flex gap-4 items-center animate-in fade-in slide-in-from-left-4 duration-300">
                      <div className="flex-1">
                        <input
                          className="w-full bg-white border border-gray-100 px-3 xl:px-5 py-4 rounded-2xl text-xs xl:text-sm font-bold text-gray-700 text-center focus:ring-2 focus:ring-orange-200 outline-none transition-all truncate"
                          placeholder="设备名称"
                          value={asset.name} onChange={(e) => updateAsset(i, 'name', e.target.value)}
                        />
                      </div>
                      <div className="relative w-36 flex items-center">
                        <span className="absolute left-6 text-sm font-bold text-orange-600 z-10 select-none">¥</span>
                        <input
                          className="w-full bg-white border border-gray-100 px-5 py-4 rounded-2xl text-sm font-black text-gray-900 text-center pl-10 [appearance:textfield] focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                          type="number" value={asset.cost} onChange={(e) => updateAsset(i, 'cost', Number(e.target.value))}
                        />
                      </div>
                      <button onClick={() => removeAsset(i)} className="flex items-center justify-center h-12 w-12 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 pt-6 border-t border-gray-50">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">首次备货费</p>
                      <div className="relative flex items-center">
                        <span className="absolute left-4 text-xs font-bold text-orange-400 z-10 select-none">¥</span>
                        <input type="number" placeholder="0" value={initialStockCost || ''} onChange={e => setInitialStockCost(Number(e.target.value))} className="w-full bg-gray-50 border-none pl-8 pr-4 py-4 rounded-2xl text-[11px] xl:text-sm font-black focus:ring-2 focus:ring-orange-100 outline-none transition-all placeholder:text-gray-300 text-center" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">备用金</p>
                      <div className="relative flex items-center">
                        <span className="absolute left-4 text-xs font-bold text-orange-400 z-10 select-none">¥</span>
                        <input type="number" placeholder="0" value={cashReserve || ''} onChange={e => setCashReserve(Number(e.target.value))} className="w-full bg-gray-50 border-none pl-8 pr-4 py-4 rounded-2xl text-[11px] xl:text-sm font-black focus:ring-2 focus:ring-orange-100 outline-none transition-all placeholder:text-gray-300 text-center" />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={addAsset}
                    className="w-full py-4 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400 text-sm font-bold hover:border-orange-200 hover:text-orange-500 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" /> 添加经营设备
                  </button>
                </div>
              </div>

              {/* Step 2: Operations */}
              <div className="glass rounded-[48px] p-8 lg:p-10 space-y-10 shadow-xl shadow-gray-100/50 flex flex-col h-full">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-3xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-black text-xl flex-shrink-0">2</div>
                  <div>
                    <h3 className="text-xl xl:text-2xl font-black text-gray-900 leading-tight">第二步：核算成本与定价</h3>
                    <p className="text-xs font-bold text-gray-400">单件利润控制与摊位租金</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-between">
                      淀粉肠成本 <span className="text-emerald-500 font-black">¥{unitSausageCost}</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-6 text-sm font-bold text-emerald-600 z-10 select-none">¥</span>
                      <input
                        type="number" value={unitSausageCost} onChange={(e) => setUnitSausageCost(Number(e.target.value))}
                        className="w-full bg-white border border-gray-100 px-5 py-4 rounded-2xl text-xs xl:text-sm font-black text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all text-center pl-10 [appearance:textfield]"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-between">
                      建议零售价 <span className="text-orange-500 font-black">¥{price}</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-6 text-sm font-bold text-orange-600 z-10 select-none">¥</span>
                      <input
                        type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full bg-white border border-gray-100 px-5 py-4 rounded-2xl text-xs xl:text-sm font-black text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all text-center pl-10 [appearance:textfield]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">调料辅材/件</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-6 text-sm font-bold text-emerald-600 z-10 select-none">¥</span>
                      <input
                        type="number" value={unitOtherCost} onChange={(e) => setUnitOtherCost(Number(e.target.value))}
                        className="w-full bg-white border border-gray-100 px-5 py-4 rounded-2xl text-xs xl:text-sm font-black text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all text-center pl-10 [appearance:textfield]"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">每日摊位租金</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-6 text-sm font-bold text-blue-600 z-10 select-none">¥</span>
                      <input
                        type="number" value={dailyRent} onChange={(e) => setDailyRent(Number(e.target.value))}
                        className="w-full bg-white border border-gray-100 px-5 py-4 rounded-2xl text-xs xl:text-sm font-black text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all text-center pl-10 [appearance:textfield]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-between">
                      加餐策略 (提升客单价) <span className={`text-[10px] ${comboEnabled ? 'text-emerald-500' : 'text-gray-300'}`}>{comboEnabled ? '已开启' : '已关闭'}</span>
                    </label>
                    <button
                      onClick={() => setComboEnabled(!comboEnabled)}
                      className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all border-2 ${comboEnabled ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                    >
                      <Sparkles className={`h-4 w-4 ${comboEnabled ? 'text-emerald-500' : 'text-gray-300'}`} />
                      <span className="text-sm font-black">开启饮品套餐 (+¥2 利润)</span>
                    </button>
                    <p className="text-[10px] text-gray-400 font-bold pl-1 italic">30% 的顾客会顺便买瓶水或冷饮</p>
                  </div>
                  <div className="space-y-3 pt-1">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">核心营业时长 ({operatingHours}小时)</label>
                      <span className="text-[10px] font-black text-blue-500">{operatingHours}h</span>
                    </div>
                    <input
                      type="range" min="1" max="14" step="1"
                      value={operatingHours} onChange={(e) => setOperatingHours(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <p className="text-[10px] text-gray-400 font-bold pl-1 italic">高峰期是出摊的关键，其余时间通常人流稀疏</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-50">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      高峰期出餐上限 ({maxHourlyOutput}根/小时)
                      <Info className="h-3 w-3 text-gray-300 cursor-help" />
                    </label>
                    <span className="text-[10px] font-black text-orange-500">{maxHourlyOutput}根/h</span>
                  </div>
                  <input
                    type="range" min="10" max="100" step="5"
                    value={maxHourlyOutput} onChange={(e) => setMaxHourlyOutput(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                  <p className="text-[10px] text-gray-400 font-bold pl-1 italic">出餐速度决定了你在高峰期能接下多少单</p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                      预估损耗率: <span className="text-emerald-600 text-sm">{(wastageRate * 100).toFixed(0)}%</span>
                      <span title="损耗率：原材料变不成收入的比例（如烤糊、爆开、掉地上的损耗）。通常摆摊控制在 5%-10% 比较理想。">
                        <Info className="h-3 w-3 cursor-help text-gray-300" />
                      </span>
                    </span>
                  </div>
                  <input
                    type="range" min="0" max="0.3" step="0.01"
                    value={wastageRate} onChange={(e) => setWastageRate(Number(e.target.value))}
                    className="w-full h-2.5 rounded-full bg-gray-100 appearance-none accent-emerald-500 cursor-pointer"
                  />
                  <p className="text-[11px] font-bold text-gray-400 bg-emerald-50/50 p-3 rounded-xl leading-relaxed">
                    <span className="text-emerald-600 mr-1">💡 小白看这里：</span>
                    是由于操作失误或不可控因素（如烤糊、掉地上）导致的原材料损耗。
                  </p>
                </div>
              </div>

              {/* Step 3: Environment */}
              <div className="glass rounded-[48px] p-8 lg:p-10 space-y-10 shadow-xl shadow-gray-100/50 flex flex-col h-full">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xl flex-shrink-0">3</div>
                  <div>
                    <h3 className="text-xl xl:text-2xl font-black text-gray-900 leading-tight">第三步：选址与经营环境</h3>
                    <p className="text-xs font-bold text-gray-400">人流量、转化率与外部干扰因素</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        每日经停人流: <span className="text-blue-600 text-sm font-black">{dailyTraffic} 人</span>
                        <span title="指经过你摊位并可能看到你产品的总人数。">
                          <Info className="h-3 w-3 cursor-help text-gray-300" />
                        </span>
                      </span>
                    </div>
                    <input
                      type="range" min="100" max="10000" step="100"
                      value={dailyTraffic} onChange={(e) => setDailyTraffic(Number(e.target.value))}
                      className="w-full h-2.5 rounded-full bg-gray-100 appearance-none accent-blue-500 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        预估转化率: <span className="text-blue-600 text-sm font-black">{(conversionRate * 100).toFixed(0)}%</span>
                        <span title="转化率：路过摊位的人中，最终会有多少比例的人正式下单购买。">
                          <Info className="h-3 w-3 cursor-help text-gray-300" />
                        </span>
                      </span>
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-tighter bg-gray-100 px-2 py-0.5 rounded-md">
                        {conversionRate < 0.05 ? '路人属性' : conversionRate < 0.12 ? '主流商圈' : '超级旺铺'}
                      </span>
                    </div>
                    <input
                      type="range" min="0.01" max="0.30" step="0.01"
                      value={conversionRate} onChange={(e) => setConversionRate(Number(e.target.value))}
                      className="w-full h-2.5 rounded-full bg-gray-100 appearance-none accent-blue-500 cursor-pointer"
                    />
                    <p className="text-[11px] font-bold text-gray-400 bg-blue-50/50 p-3 rounded-xl leading-relaxed">
                      <span className="text-blue-600 mr-1">💡 小白看这里：</span>
                      是指路过摊位的人中，最终会有多少比例的人下单购买。
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setIsRainy(!isRainy)}
                      className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[24px] font-black text-sm transition-all shadow-sm ${isRainy ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                    >
                      <CloudRain className="h-5 w-5" /> 下雨天模拟
                    </button>
                    <button
                      onClick={() => setRiskLevel(riskLevel === 'LOW' ? 'HIGH' : 'LOW')}
                      className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[24px] font-black text-sm transition-all shadow-sm ${riskLevel === 'HIGH' ? 'bg-red-600 text-white shadow-red-200' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                    >
                      <ShieldAlert className="h-5 w-5" /> 流动摊位模式
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* STAGE B: ACTION AREA */}
            <div className="flex flex-col items-center py-10 gap-6">
              <button
                onClick={runSimulation}
                disabled={isSimulating}
                className="w-full max-w-2xl flex items-center justify-center gap-4 rounded-[40px] bg-gray-900 py-8 text-xl font-black text-white shadow-3xl shadow-gray-200/50 transition-all hover:bg-orange-600 hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50"
              >
                {isSimulating ? (
                  <span className="flex items-center gap-3">
                    <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    AI 专家正在演算盈利真相...
                  </span>
                ) : (
                  <>开始生成深度经营报告 <Play className="h-6 w-6 fill-white ml-2" /></>
                )}
              </button>
              <p className="text-sm font-bold text-gray-400 italic">点击按钮，为您揭秘摊位背后的经济逻辑</p>
            </div>

            {/* STAGE C: RESULTS - FULL WIDTH */}
            <div className="pt-8">
              {report ? (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
                  {/* KPI Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    <div className="glass rounded-[32px] p-6 xl:p-8 space-y-2 border-t-4 border-gray-900">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">初始投入</p>
                      <p className="text-2xl xl:text-3xl font-black text-gray-900">¥{report.initialInvestment.toLocaleString()}</p>
                    </div>
                    <div className="glass rounded-[32px] p-6 xl:p-8 space-y-2 border-t-4 border-green-500">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">30天纯利润</p>
                      <p className="text-2xl xl:text-3xl font-black text-green-600">¥{report.monthlyNetProfit.toLocaleString()}</p>
                    </div>
                    <div className="glass rounded-[32px] p-6 xl:p-8 space-y-2 border-t-4 border-orange-500">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">回本周期</p>
                      <p className="text-2xl xl:text-3xl font-black text-orange-500">{report.roiDays > 0 ? report.roiDays : '∞'}天</p>
                    </div>
                    <div className="glass rounded-[32px] p-6 xl:p-8 space-y-2 border-t-4 border-red-500">
                      <p className="text-[10px] font-black text-red-400 uppercase tracking-widest flex items-center gap-1">丢单损失 <Info className="h-3 w-3" /></p>
                      <p className="text-2xl xl:text-3xl font-black text-red-600">¥{report.totalLostRevenue.toLocaleString()}</p>
                    </div>
                    <div className="glass rounded-[32px] p-6 xl:p-8 space-y-2 border-t-4 border-blue-500">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">日均盈利</p>
                      <p className="text-2xl xl:text-3xl font-black text-blue-600">¥{report.avgDailyProfit.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Profit Analysis */}
                  <div className="glass rounded-[48px] p-12 space-y-10 shadow-xl shadow-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-3xl bg-green-50 flex items-center justify-center text-green-600">
                        <TrendingUp className="h-8 w-8" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-gray-900">经营收益深度剖析</h4>
                        <p className="text-sm font-bold text-gray-400">基于您设置的 ¥{price}/根 零售价格</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                      {/* Analysis Left: Progress Bars & Meta */}
                      <div className="lg:col-span-4 space-y-8">
                        <div className="space-y-6 bg-gray-50/50 p-8 rounded-[40px]">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-bold text-gray-500 flex flex-col">
                              <span>盈亏平衡点 (每日销量)</span>
                              <span className="text-[10px] font-medium text-gray-400">每天卖够多少根才不亏本</span>
                            </span>
                            <span className="font-black text-gray-900 text-xl">{report.breakEvenSales} 根</span>
                          </div>
                          <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-4">
                            <span className="font-bold text-gray-500">预估每日销量</span>
                            <span className="font-black text-gray-900 text-xl">{report.salesVolume} 根</span>
                          </div>
                          <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-4">
                            <span className="font-bold text-gray-500">材料损耗成本</span>
                            <span className="font-black text-red-500 text-xl">¥{report.wastageCost}</span>
                          </div>
                          <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden mt-6 shadow-inner">
                            <div
                              className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-1000 shadow-sm shadow-green-200"
                              style={{ width: `${Math.min((report.salesVolume / report.breakEvenSales) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <p className="text-[10px] font-bold text-gray-400 text-center uppercase tracking-widest">
                            {report.salesVolume >= report.breakEvenSales ? '💪 已达盈利门槛' : '⚖️ 尚未覆盖固定成本'}
                          </p>
                        </div>
                      </div>

                      {/* Analysis Right: Featured AI Advice */}
                      <div className="lg:col-span-8">
                        <div className="h-full rounded-[48px] bg-gradient-to-br from-indigo-50 to-blue-50/50 p-10 border border-white shadow-xl shadow-indigo-100/20">
                          <div className="flex items-center gap-4 text-xs font-black text-indigo-600 uppercase tracking-widest mb-8">
                            <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center shadow-md">
                              <Sparkles className="h-5 w-5" />
                            </div>
                            <span className="text-sm">AI 创业导师深度研判</span>
                          </div>
                          <div className="text-sm font-medium text-gray-700 leading-relaxed space-y-4">
                            {aiAdvice ? (
                              aiAdvice.split('\n').filter(l => l.trim() !== '').map((line, i) => {
                                const isHeader = line.startsWith('#') || line.match(/^\d\./);

                                if (isHeader) {
                                  return (
                                    <div key={i} className="mt-8 mb-4 flex items-center gap-3">
                                      <div className="h-8 w-1.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-200"></div>
                                      <h4 className="text-lg font-black text-gray-900 tracking-tight leading-none">
                                        {line.replace(/^#+\s*|\d\.\s*/, '').replace(/\*\*/g, '')}
                                      </h4>
                                    </div>
                                  );
                                }

                                return (
                                  <p key={i} className="text-gray-600 mb-3 pl-6 border-l-2 border-indigo-100/50 ml-1 py-1 text-[15px] font-medium leading-loose">
                                    {line.replace(/\*\*/g, '')}
                                  </p>
                                );
                              })
                            ) : (
                              <div className="flex flex-col gap-4 py-10">
                                <div className="h-4 w-full bg-indigo-100/50 animate-pulse rounded-full"></div>
                                <div className="h-4 w-[90%] bg-indigo-100/50 animate-pulse rounded-full"></div>
                                <div className="h-4 w-[75%] bg-indigo-100/50 animate-pulse rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Projection Chart */}
                  <div className="glass rounded-[48px] p-12 space-y-8 shadow-xl shadow-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600">
                          <TrendingUp className="h-8 w-8" />
                        </div>
                        <div>
                          <h4 className="text-2xl font-black text-gray-900">现金流累积曲线 (30天)</h4>
                          <p className="text-sm font-bold text-gray-400">展示从初始投资到回本盈利的财务轨迹</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full bg-blue-500 shadow-sm shadow-blue-200"></span>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">累计净现金流</span>
                        </div>
                      </div>
                    </div>

                    <div className="h-[400px] w-full mt-10">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={report.chartData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                          <defs>
                            <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                          <XAxis
                            dataKey="day"
                            fontSize={10}
                            fontWeight={900}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: '#94A3B8' }}
                            tickFormatter={(v) => `D${v}`}
                            label={{ value: '模拟经营周期 (天)', position: 'insideBottom', offset: -15, fontSize: 10, fontWeight: 900, fill: '#CBD5E1' }}
                          />
                          <YAxis
                            fontSize={10}
                            fontWeight={900}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: '#94A3B8' }}
                            tickFormatter={(v) => `¥${v}`}
                          />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-gray-100 shadow-2xl flex flex-col gap-3 min-w-[200px]">
                                    <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">第 {payload[0].payload.day} 天</p>
                                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${Number(payload[0].value) >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {Number(payload[0].value) >= 0 ? '盈利状态' : '回本中'}
                                      </span>
                                    </div>
                                    <p className={`text-2xl font-black ${Number(payload[0].value) >= 0 ? 'text-emerald-500' : 'text-orange-500'} tracking-tighter`}>
                                      ¥{Number(payload[0].value).toLocaleString()}
                                    </p>
                                    <div className="space-y-1.5">
                                      <div className="flex justify-between items-center bg-gray-50 p-2 rounded-xl">
                                        <span className="text-[10px] font-bold text-gray-500">当日真实收入</span>
                                        <span className="text-[10px] font-black text-gray-900">¥{payload[0].payload.revenue}</span>
                                      </div>
                                      <div className="flex justify-between items-center bg-red-50/50 p-2 rounded-xl">
                                        <span className="text-[10px] font-bold text-red-400">物理产量丢单</span>
                                        <span className="text-[10px] font-black text-red-600">-¥{payload[0].payload.lostRevenue}</span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <ReferenceLine y={0} stroke="#E2E8F0" strokeWidth={2} strokeDasharray="5 5" />
                          <Area
                            type="monotone"
                            dataKey="cashFlow"
                            stroke="#3b82f6"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorCash)"
                            animationDuration={2000}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Risks */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-6 w-6 text-red-500" />
                      <h4 className="text-2xl font-black text-gray-900">潜在经营风险</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {report.risks.map((risk: any, i: number) => (
                        <div key={i} className="glass rounded-3xl p-6 border-l-4 border-red-500 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-gray-900">{risk.type}</span>
                            <span className="text-[10px] font-black text-red-600 uppercase">危险</span>
                          </div>
                          <p className="text-xs font-medium text-gray-500 leading-relaxed font-sans">{risk.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center glass rounded-[64px] border-dashed border-2 border-gray-100 min-h-[500px] bg-gray-50/20">
                  <div className="mb-8 relative">
                    <div className="h-28 w-28 rounded-full bg-white shadow-xl shadow-gray-200/50 flex items-center justify-center animate-bounce duration-[2000ms]">
                      <Calculator className="h-12 w-12 text-gray-200" />
                    </div>
                    <div className="absolute -top-3 -right-3 h-10 w-10 rounded-full bg-gray-900 shadow-lg flex items-center justify-center text-orange-400">
                      <Zap className="h-5 w-5 fill-orange-400" />
                    </div>
                  </div>
                  <h4 className="text-3xl font-black text-gray-900 tracking-tight italic opacity-10">DESIGN BY ANTIGRAVITY</h4>
                  <p className="text-lg font-bold text-gray-400 mt-6 max-w-sm text-center leading-relaxed">
                    万事已成，静待东风<br />
                    点击上方按钮，开启属于您的模拟经营报告
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
