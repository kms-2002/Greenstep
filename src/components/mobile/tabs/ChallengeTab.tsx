import React, { useState } from 'react';
import type { ChallengeCategory } from '../../../types';
import { useApp } from '../../../context/AppContext';
import { Search, Sparkles, Users, Zap, CheckCircle, MapPin } from 'lucide-react';

export const ChallengeTab: React.FC = () => {
  const { challenges, participations, setSelectedChallenge } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categoryTabs: { id: ChallengeCategory; label: string; icon: string }[] = [
    { id: 'all', label: '전체', icon: '🌟' },
    { id: 'transport', label: '이동', icon: '🚍' },
    { id: 'life', label: '생활', icon: '🥤' },
    { id: 'food', label: '음식', icon: '🍚' },
    { id: 'resource', label: '자원', icon: '♻️' },
  ];

  const filteredChallenges = challenges.filter((c) => {
    if (!c.active) return false;
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 space-y-4 pb-24 animate-fadeIn">
      {/* Header Banner for Jinju City x GNU */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-slate-900 text-white p-5 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center space-x-1 bg-emerald-700/80 border border-emerald-500/50 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-200">
            <MapPin className="w-3 h-3 text-emerald-300" />
            <span>진주시 × 경상국립대학교 탄소중립 실천</span>
          </div>

          <h2 className="text-xl font-extrabold tracking-tight pt-1">
            친환경 챌린지 🎯
          </h2>
          <p className="text-xs text-emerald-200">
            진주시 대표 환경 운동과 가좌캠퍼스 실천으로 탄소를 절감해보세요!
          </p>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="진주, 남강, 텀블러, 시내버스 챌린지 검색..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm transition-all"
        />
      </div>

      {/* Category Pills Slider */}
      <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
        {categoryTabs.map((tab) => {
          const isActive = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 flex items-center space-x-1.5 transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-105'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Challenge Cards Grid */}
      <div className="space-y-3">
        {filteredChallenges.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 text-slate-400">
            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs font-bold">검색 조건에 맞는 챌린지가 없습니다.</p>
          </div>
        ) : (
          filteredChallenges.map((ch) => {
            const isJoined = participations.some(
              (p) => p.challengeId === ch.id && p.status === 'in_progress'
            );
            const isCompleted = participations.some(
              (p) => p.challengeId === ch.id && p.status === 'completed'
            );

            return (
              <div
                key={ch.id}
                onClick={() => setSelectedChallenge(ch)}
                className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-slate-100 relative">
                    <img src={ch.imageUrl} alt={ch.title} className="w-full h-full object-cover" />
                    {ch.isPopular && (
                      <span className="absolute top-1 left-1 text-[9px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded-md">
                        진주 HOT
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {ch.categoryIcon} {ch.categoryName}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-slate-800 tracking-tight mt-1 truncate">
                      {ch.title}
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{ch.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center space-x-2 text-[11px]">
                    <span className="font-mono text-emerald-700 font-bold">
                      {(ch.carbonReduction).toFixed(1)}kg CO₂e
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="font-mono text-amber-600 font-bold flex items-center gap-0.5">
                      <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                      +{ch.rewardPoints}P
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-400 flex items-center gap-0.5">
                      <Users className="w-3 h-3" />
                      {ch.participantsCount}명
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedChallenge(ch);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-md transition-transform active:scale-95 ${
                      isCompleted
                        ? 'bg-slate-100 text-slate-600 border border-slate-200'
                        : isJoined
                        ? 'bg-amber-500 text-slate-950 shadow-amber-500/20'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                    }`}
                  >
                    {isCompleted ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        인증완료
                      </span>
                    ) : isJoined ? (
                      '인증하기'
                    ) : (
                      '도전하기'
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
