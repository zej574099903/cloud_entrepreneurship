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
  Zap
} from 'lucide-react';
import Link from 'next/link';

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

  const [isSimulating, setIsSimulating] = useState(false);
  const [report, setReport] = useState<any>(null);

  const addAsset = () => setFixedAssets([...fixedAssets, { name: '新增条目', cost: 0 }]);
  const updateAsset = (index: number, key: keyof CostItem, value: any) => {
    const newAssets = [...fixedAssets];
    newAssets[index] = { ...newAssets[index], [key]: value };
    setFixedAssets(newAssets);
  };
  const removeAsset = (index: number) => setFixedAssets(fixedAssets.filter((_, i) => i !== index));

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const totalFixed = fixedAssets.reduce((sum, item) => sum + item.cost, 0);
      const initialInvestment = totalFixed + 150; // +150 for first batch of materials
      
      const unitCost = 1.1; 
      const salesVolume = Math.floor(dailyTraffic * conversionRate);
      const dailyRevenue = salesVolume * price;
      const dailyVariableCost = salesVolume * unitCost;
      const dailyNetProfit = dailyRevenue - dailyVariableCost - dailyRent;

      const roiDays = dailyNetProfit > 0 ? Math.ceil(initialInvestment / dailyNetProfit) : -1;

      let riskScore = 25;
      if (dailyRent < 10) riskScore += 30;
      if (dailyNetProfit < 50) riskScore += 25;
      
      const risks = [];
      if (dailyRent < 10) risks.push({ type: '避雷：合规风险', level: '高', desc: '低租金意味着非正规摊位，时刻面临城管巡查风险。' });
      if (conversionRate < 0.05) risks.push({ type: '避雷：选址风险', level: '中', desc: '转化率低于行业均值，该地段人流质量对小吃需求较弱。' });
      if (dailyNetProfit > 400) risks.push({ type: '提示：竞争风险', level: '中', desc: '收益过高会迅速招来同行竞争，建议提前准备差异化口味。' });

      setReport({
        initialInvestment,
        salesVolume,
        dailyNetProfit,
        roiDays,
        riskScore: Math.min(riskScore, 100),
        risks,
        breakEvenSales: Math.ceil((dailyRent + (totalFixed / 30)) / (price - unitCost))
      });
      setIsSimulating(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <main className="ml-64 p-10 lg:p-14">
        <Header />

        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <Link href="/" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm hover:shadow-md transition-all">
                <ArrowLeft className="h-6 w-6 text-gray-400" />
              </Link>
              <div>
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">淀粉肠摆摊 · V2 仿真实验室</h2>
                <p className="mt-1 text-sm font-bold text-gray-400">正在为您模拟真实世界的每一笔开支与风险</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10 xl:grid-cols-12 items-start">
            {/* LEFT COLUMN: CONFIG */}
            <div className="xl:col-span-5 space-y-8">
              
              {/* Asset Configuration */}
              <div className="glass rounded-[40px] p-10 shadow-sm border border-white/50 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-100">
                      <Wrench className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900">固定配置清单</h3>
                  </div>
                  <button onClick={addAsset} className="group flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-orange-600 hover:text-white transition-all">
                    <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
                  </button>
                </div>

                <div className="space-y-4">
                  {fixedAssets.map((asset, i) => (
                    <div key={i} className="flex gap-4 items-center animate-in fade-in slide-in-from-left-4 duration-300">
                      <div className="flex-1">
                        <input 
                          className="w-full bg-white border border-gray-100 px-5 py-4 rounded-2xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all" 
                          placeholder="设备名称"
                          value={asset.name} onChange={(e) => updateAsset(i, 'name', e.target.value)}
                        />
                      </div>
                      <div className="relative w-36">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-orange-600">¥</span>
                        <input 
                          className="w-full bg-white border border-gray-100 pl-8 pr-5 py-4 rounded-2xl text-sm font-black text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all" 
                          type="number"
                          value={asset.cost} onChange={(e) => updateAsset(i, 'cost', Number(e.target.value))}
                        />
                      </div>
                      <button onClick={() => removeAsset(i)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between rounded-3xl bg-gray-50 p-6">
                  <span className="text-sm font-black text-gray-400 uppercase tracking-widest">设备总投入</span>
                  <span className="text-2xl font-black text-gray-900">¥{fixedAssets.reduce((s, a) => s + a.cost, 0)}</span>
                </div>
              </div>

              {/* Environment Input */}
              <div className="glass rounded-[40px] p-10 shadow-sm border border-white/50 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900">经营环境输入</h3>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                       每日租金 <Info className="h-3 w-3" />
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-blue-600">¥</span>
                      <input 
                        type="number" value={dailyRent} onChange={(e) => setDailyRent(Number(e.target.value))}
                        className="w-full bg-white border border-gray-100 pl-8 pr-5 py-4 rounded-2xl text-sm font-black text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      预估人流量 <Info className="h-3 w-3" />
                    </label>
                    <div className="relative">
                      <input 
                        type="number" value={dailyTraffic} onChange={(e) => setDailyTraffic(Number(e.target.value))}
                        className="w-full bg-white border border-gray-100 px-5 py-4 rounded-2xl text-sm font-black text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">预估转化率: <span className="text-blue-600 text-sm">{(conversionRate * 100).toFixed(0)}%</span></span>
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-tighter bg-gray-100 px-2 py-0.5 rounded-md">
                      {conversionRate < 0.05 ? '路人属性' : conversionRate < 0.12 ? '主流商圈' : '超级旺铺'}
                    </span>
                  </div>
                  <input 
                    type="range" min="0.01" max="0.30" step="0.01" 
                    value={conversionRate} onChange={(e) => setConversionRate(Number(e.target.value))}
                    className="w-full h-2.5 rounded-full bg-gray-100 appearance-none accent-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Action Button - Centered in column */}
              <button 
                onClick={runSimulation}
                disabled={isSimulating}
                className="w-full flex items-center justify-center gap-4 rounded-[32px] bg-gray-900 py-6 text-lg font-black text-white shadow-2xl shadow-gray-200 transition-all hover:bg-orange-600 active:scale-[0.98] disabled:opacity-50"
              >
                {isSimulating ? (
                  <span className="flex items-center gap-2">
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    AI 正在推算真实收益...
                  </span>
                ) : (
                  <>生成真实经营报告 <Play className="h-5 w-5 fill-white" /></>
                )}
              </button>
            </div>

            {/* RIGHT COLUMN: RESULTS */}
            <div className="xl:col-span-7 h-full">
              {report ? (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
                  {/* KPI Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="glass rounded-[32px] p-8 space-y-2 border-t-4 border-gray-900">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">初始投入</p>
                      <p className="text-3xl font-black text-gray-900">¥{report.initialInvestment}</p>
                    </div>
                    <div className="glass rounded-[32px] p-8 space-y-2 border-t-4 border-green-500">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">预估日利润</p>
                      <p className="text-3xl font-black text-green-600">¥{report.dailyNetProfit}</p>
                    </div>
                    <div className="glass rounded-[32px] p-8 space-y-2 border-t-4 border-orange-500">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">回本周期</p>
                      <p className="text-3xl font-black text-orange-500">{report.roiDays > 0 ? report.roiDays : '∞'}天</p>
                    </div>
                    <div className="glass rounded-[32px] p-8 space-y-2 border-t-4 border-red-500">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">风险评分</p>
                      <p className="text-3xl font-black text-red-500">{report.riskScore}%</p>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-bold text-gray-500">盈亏平衡点 (每日销量)</span>
                          <span className="font-black text-gray-900 text-lg">{report.breakEvenSales} 根</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-bold text-gray-500">预估每日销量</span>
                          <span className="font-black text-gray-900 text-lg">{report.salesVolume} 根</span>
                        </div>
                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 transition-all duration-1000" 
                            style={{ width: `${Math.min((report.salesVolume / report.breakEvenSales) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-4 rounded-3xl bg-gray-50 p-6">
                        <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                          <Target className="h-4 w-4" /> 核心避坑建议
                        </div>
                        <p className="text-sm font-bold text-gray-600 leading-relaxed">
                          当前地段流量虽好，但日净利处于 <span className="text-green-600">¥{report.dailyNetProfit}</span> 水平。建议将
                          <span className="text-gray-900 mx-1">价格设为 ¥4</span> 反而是利润最优解，盲目低价会由于原材料成本占比过高导致回本周期被极度拉长。
                        </p>
                      </div>
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
                <div className="h-full flex flex-col items-center justify-center glass rounded-[48px] border-dashed border-2 border-gray-200 min-h-[700px]">
                  <div className="mb-6 relative">
                    <div className="h-24 w-24 rounded-full bg-gray-50 flex items-center justify-center animate-pulse">
                      <Calculator className="h-10 w-10 text-gray-200" />
                    </div>
                    <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center text-orange-400">
                      <Zap className="h-4 w-4 fill-orange-400" />
                    </div>
                  </div>
                  <h4 className="text-2xl font-black text-gray-300">坐而言，不如起而行</h4>
                  <p className="text-sm font-bold text-gray-300 mt-2 max-w-[280px] text-center leading-relaxed">
                    点击左侧“生成真实经营报告”<br />
                    AI 专家将立刻为您揭开摊位后的盈利真相
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
