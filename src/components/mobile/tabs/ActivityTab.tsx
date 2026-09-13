import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { VirtualTree } from '../VirtualTree';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Award, Flame, Zap, CheckCircle2 } from 'lucide-react';

export const ActivityTab: React.FC = () => {
  const { user, participations } = useApp();
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('week');

  const totalSuccessCount = participations.filter((p) => p.status === 'completed').length;

  const topActions = [
    { name: '텀블러 사용', icon: '🥤', count: 12, carbon: 1.2 },
    { name: '대중교통 이용', icon: '🚍', count: 8, carbon: 9.6 },
    { name: '올바른 분리배출', icon: '♻️', count: 6, carbon: 1.8 },
    { name: '잔반 남기지 않기', icon: '🍚', count: 4, carbon: 2.0 },
  ];

  const graphData =
    period === 'week'
      ? [
          { name: '월', carbon: 0.8 },
          { name: '화', carbon: 1.4 },
          { name: '수', carbon: 2.1 },
          { name: '목', carbon: 1.1 },
          { name: '금', carbon: user.todayCarbonReduction },
          { name: '토', carbon: 0.0 },
          { name: '일', carbon: 0.0 },
        ]
      : period === 'month'
      ? [
          { name: '1주차', carbon: 8.5 },
          { name: '2주차', carbon: 11.2 },
          { name: '3주차', carbon: 14.7 },
          { name: '4주차', carbon: user.weekCarbonReduction },
        ]
      : [
          { name: '6월', carbon: 5.2 },
          { name: '7월', carbon: 12.4 },
          { name: '8월', carbon: 16.8 },
          { name: '9월', carbon: user.totalCarbonReduction },
        ];

  return (
    <div className="p-4 space-y-5 pb-24 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-5 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-300 font-bold tracking-wide uppercase block mb-0.5">
              My Green Step
            </span>
            <h2 className="text-xl font-black tracking-tight">나의 활동 리포트 📊</h2>
          </div>
          <Activity className="w-8 h-8 text-emerald-400 opacity-80" />
        </div>
      </div>

      {/* 4 Summary Stats Card Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-xs text-slate-500 font-bold block mb-1">누적 탄소절감량</span>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-black text-emerald-700 font-mono">
              {user.totalCarbonReduction.toFixed(1)}
            </span>
            <span className="text-xs font-bold text-slate-500">kg CO₂e</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-xs text-slate-500 font-bold block mb-1 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            연속 실천
          </span>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-black text-amber-600 font-mono">{user.consecutiveDays}</span>
            <span className="text-xs font-bold text-slate-500">일째</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-xs text-slate-500 font-bold block mb-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
            챌린지 성공
          </span>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-black text-teal-700 font-mono">{totalSuccessCount}</span>
            <span className="text-xs font-bold text-slate-500">회</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-xs text-slate-500 font-bold block mb-1 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-indigo-600 fill-indigo-500" />
            포인트
          </span>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-black text-indigo-700 font-mono">
              {user.points.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-500">P</span>
          </div>
        </div>
      </div>

      {/* Virtual Tree Section */}
      <VirtualTree totalCarbon={user.totalCarbonReduction} />

      {/* Period Carbon Graph */}
      <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-800">기간별 탄소절감량</h3>

          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(['week', 'month', 'all'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  period === p ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500'
                }`}
              >
                {p === 'week' ? '이번 주' : p === 'month' ? '이번 달' : '전체'}
              </button>
            ))}
          </div>
        </div>

        <div className="h-48 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={graphData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(val: any) => [`${val ?? 0}kg CO₂e`, '탄소절감량']}
              />
              <Bar dataKey="carbon" fill="#059669" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Practiced Eco Behaviors */}
      <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
          <span>가장 많이 실천한 행동 TOP 4</span>
          <Award className="w-4 h-4 text-amber-500" />
        </h3>

        <div className="space-y-2.5">
          {topActions.map((act, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{act.icon}</span>
                <div>
                  <span className="font-bold text-slate-800 block">{act.name}</span>
                  <span className="text-[10px] text-slate-400">총 절감 {act.carbon}kg CO₂e</span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono font-extrabold text-emerald-700 text-sm">{act.count}회</span>
                <span className="text-[10px] text-slate-400 block font-medium">인증완료</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
