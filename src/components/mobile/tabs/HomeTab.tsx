import React from 'react';
import { useApp } from '../../../context/AppContext';
import { generateRecommendation } from '../../../utils/carbonCalculator';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Sparkles, Flame, Zap, TreePine, ChevronRight, ArrowUpRight } from 'lucide-react';

export const HomeTab: React.FC = () => {
  const { user, challenges, participations, setSelectedChallenge, setActiveTab } = useApp();

  const recommendationInfo = generateRecommendation(participations, challenges);
  const recommendedList = challenges.filter((c) => c.isRecommended || c.isPopular).slice(0, 2);

  const weeklyData = [
    { day: '월', carbon: 0.8 },
    { day: '화', carbon: 1.4 },
    { day: '수', carbon: 2.1 },
    { day: '목', carbon: 1.1 },
    { day: '금', carbon: user.todayCarbonReduction },
    { day: '토', carbon: 0.0 },
    { day: '일', carbon: 0.0 },
  ];

  return (
    <div className="p-4 space-y-5 pb-24 animate-fadeIn">
      {/* Welcome Greeting Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-5 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight">
              안녕하세요, <span className="text-amber-300">{user.nickname}</span>님!
            </h2>
            <p className="text-xs text-emerald-100/90 font-medium mt-1 flex items-center gap-1">
              <span>오늘도 지구를 위한 한 걸음</span>
              <span className="text-sm">🌱</span>
            </p>
          </div>

          <button
            onClick={() => setActiveTab('my')}
            className="w-11 h-11 rounded-2xl bg-emerald-700/60 border border-emerald-500/40 overflow-hidden shadow-inner flex items-center justify-center"
          >
            {user.profileImage ? (
              <img src={user.profileImage} alt={user.nickname} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl">🌿</span>
            )}
          </button>
        </div>

        <div className="mt-3 text-[11px] bg-emerald-950/40 text-emerald-200 px-3 py-1 rounded-xl inline-flex items-center gap-1.5 border border-emerald-700/50">
          <span className="font-bold">{user.university}</span>
          <span>•</span>
          <span>{user.department} ({user.grade})</span>
        </div>
      </div>

      {/* User Status Card Grid (4 Items) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Today Carbon */}
        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">오늘 탄소절감량</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-100 flex items-center justify-center">
              <TreePine className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl font-black text-slate-800 font-mono">
              {user.todayCarbonReduction.toFixed(1)}
            </span>
            <span className="text-xs font-bold text-emerald-600 ml-1">kg CO₂e</span>
          </div>
        </div>

        {/* Week Carbon */}
        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">이번 주 탄소절감</span>
            <div className="w-7 h-7 rounded-xl bg-teal-100 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-teal-600" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl font-black text-slate-800 font-mono">
              {user.weekCarbonReduction.toFixed(1)}
            </span>
            <span className="text-xs font-bold text-teal-600 ml-1">kg CO₂e</span>
          </div>
        </div>

        {/* Consecutive Streak */}
        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">연속 실천일</span>
            <div className="w-7 h-7 rounded-xl bg-amber-100 flex items-center justify-center">
              <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl font-black text-slate-800 font-mono">
              {user.consecutiveDays}
            </span>
            <span className="text-xs font-bold text-amber-600 ml-1">일 연속</span>
          </div>
        </div>

        {/* Points */}
        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">보유 포인트</span>
            <div className="w-7 h-7 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Zap className="w-4 h-4 text-indigo-600 fill-indigo-500" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl font-black text-slate-800 font-mono">
              {user.points.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-indigo-600 ml-1">P</span>
          </div>
        </div>
      </div>

      {/* Personalized AI Recommendation Callout */}
      <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200/80 flex items-start space-x-3 shadow-sm">
        <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-md shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex-1 text-xs">
          <span className="font-bold text-emerald-950 block">맞춤형 챌린지 추천</span>
          <p className="text-emerald-800 text-[11px] mt-0.5">
            "{user.nickname}님은 {recommendationInfo.reason}"
          </p>
        </div>
      </div>

      {/* Today's Recommended Challenges */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
            <span>오늘의 추천 챌린지</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              HOT
            </span>
          </h3>
          <button
            onClick={() => setActiveTab('challenge')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center"
          >
            <span>전체보기</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {recommendedList.map((ch) => (
            <div
              key={ch.id}
              onClick={() => setSelectedChallenge(ch)}
              className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                    <img src={ch.imageUrl} alt={ch.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1">
                      <span>{ch.categoryIcon}</span>
                      <span>{ch.title}</span>
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{ch.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center space-x-3 font-mono font-medium">
                  <span className="text-emerald-700">
                    예상 절감: <b>{ch.carbonReduction.toFixed(1)}kg CO₂e</b>
                  </span>
                  <span className="text-amber-600">
                    보상: <b>+{ch.rewardPoints}P</b>
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedChallenge(ch);
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-transform active:scale-95"
                >
                  도전하기
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Activity Graph */}
      <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-800">이번 주 나의 활동</h3>
          <span className="text-[11px] text-slate-400 font-medium">요일별 탄소절감량</span>
        </div>

        <div className="h-44 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value: any) => [`${value ?? 0}kg CO₂e`, '탄소절감량']}
              />
              <Bar dataKey="carbon" fill="#10B981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
