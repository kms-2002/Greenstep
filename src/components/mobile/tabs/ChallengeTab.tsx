import React, { useRef, useState } from 'react';
import type { ChallengeCategory } from '../../../types';
import { useApp } from '../../../context/AppContext';
import { Search, Sparkles, Users, Zap, RotateCcw, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

export const ChallengeTab: React.FC = () => {
  const { challenges, participations, setSelectedChallenge, setChallengeToVerify, setIsVerificationOpen } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentRecIndex, setCurrentRecIndex] = useState(0);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const categoryTabs: { id: ChallengeCategory; label: string; icon: string }[] = [
    { id: 'all', label: '전체', icon: '🌟' },
    { id: 'transport', label: '이동', icon: '🚍' },
    { id: 'life', label: '생활', icon: '🥤' },
    { id: 'food', label: '음식', icon: '🍚' },
    { id: 'resource', label: '자원', icon: '♻️' },
  ];

  // Top 3 Recommended Challenges
  const recommendedTop3 = challenges
    .filter((c) => c.isRecommended || c.isPopular)
    .slice(0, 3);

  const filteredChallenges = challenges.filter((c) => {
    if (!c.active) return false;
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenVerifyDirectly = (ch: typeof challenges[0], e: React.MouseEvent) => {
    e.stopPropagation();
    setChallengeToVerify(ch);
    setIsVerificationOpen(true);
  };

  return (
    <div className="p-4 space-y-4 pb-24 animate-fadeIn select-none">
      {/* 오늘의 추천 챌린지 TOP 3 Banner Carousel Section */}
      {recommendedTop3.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>오늘의 추천 챌린지 TOP 3</span>
              <span className="text-[10px] font-extrabold text-white bg-amber-500 px-2 py-0.5 rounded-full shadow-xs">
                HOT
              </span>
            </h3>

            {/* Banner Index Switcher */}
            <div className="flex items-center space-x-1 text-[11px] font-bold text-slate-500">
              <button
                onClick={() => setCurrentRecIndex((prev) => (prev + 1) % recommendedTop3.length)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
              >
                {currentRecIndex + 1} / {recommendedTop3.length} {'>'}
              </button>
            </div>
          </div>

          {/* Active Banner Card */}
          {(() => {
            const ch = recommendedTop3[currentRecIndex];
            const completedCount = participations.filter(
              (p) => p.challengeId === ch.id && p.status === 'completed'
            ).length;
            const isJoined = participations.some(
              (p) => p.challengeId === ch.id && p.status === 'in_progress'
            );

            return (
              <div
                key={ch.id}
                onClick={() => setSelectedChallenge(ch)}
                className="p-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl shadow-md hover:shadow-lg transition-all cursor-pointer relative overflow-hidden space-y-3"
              >
                <div className="flex items-start space-x-3 relative z-10">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 bg-white/20 backdrop-blur-xs border border-white/30 p-0.5">
                    <img src={ch.imageUrl} alt={ch.title} className="w-full h-full object-cover rounded-xl" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] font-extrabold bg-white/20 backdrop-blur-xs text-emerald-100 px-2 py-0.5 rounded-full border border-white/20">
                        {ch.categoryIcon} {ch.categoryName}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-base text-white tracking-tight mt-1 truncate">
                      {ch.title}
                    </h4>

                    <p className="text-xs text-emerald-100 line-clamp-1 mt-0.5 opacity-90">{ch.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/20 text-xs relative z-10">
                  <div className="flex items-center space-x-2.5 font-mono font-medium text-emerald-100">
                    <span>
                      절감: <b>{ch.carbonReduction.toFixed(1)}kg</b>
                    </span>
                    <span>•</span>
                    <span className="text-amber-300 font-bold flex items-center gap-0.5">
                      <Zap className="w-3 h-3 fill-amber-300" />
                      +{ch.rewardPoints}P
                    </span>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={(e) => {
                      if (completedCount > 0 || isJoined) {
                        handleOpenVerifyDirectly(ch, e);
                      } else {
                        e.stopPropagation();
                        setSelectedChallenge(ch);
                      }
                    }}
                    className="px-4 py-2 bg-white hover:bg-emerald-50 text-emerald-900 font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    {completedCount > 0 ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5 text-emerald-700" />
                        <span>다시 도전 (총 {completedCount}회)</span>
                      </>
                    ) : isJoined ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>인증하기</span>
                      </>
                    ) : (
                      <>
                        <span>도전하기</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 3. Search Input Bar */}
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

      {/* 4. Category Pills Slider */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label="이전 카테고리 보기"
          onClick={() => categoryScrollRef.current?.scrollBy({ left: -160, behavior: 'smooth' })}
          className="w-7 h-7 shrink-0 rounded-full bg-white border border-slate-200 text-slate-600 shadow-xs flex items-center justify-center hover:bg-slate-50 active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div ref={categoryScrollRef} className="flex flex-1 min-w-0 space-x-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
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
        <button
          type="button"
          aria-label="다음 카테고리 보기"
          onClick={() => categoryScrollRef.current?.scrollBy({ left: 160, behavior: 'smooth' })}
          className="w-7 h-7 shrink-0 rounded-full bg-white border border-slate-200 text-slate-600 shadow-xs flex items-center justify-center hover:bg-slate-50 active:scale-95"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 5. Main Challenge Cards Grid */}
      <div className="space-y-3">
        {filteredChallenges.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 text-slate-400">
            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs font-bold">검색 조건에 맞는 챌린지가 없습니다.</p>
          </div>
        ) : (
          filteredChallenges.map((ch) => {
            const completedCount = participations.filter(
              (p) => p.challengeId === ch.id && p.status === 'completed'
            ).length;
            const isJoined = participations.some(
              (p) => p.challengeId === ch.id && p.status === 'in_progress'
            );

            return (
              <div
                key={ch.id}
                onClick={() => setSelectedChallenge(ch)}
                className="p-4 bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3"
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

                      {/* Completed Badge Indicator */}
                      {completedCount > 0 && (
                        <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100/90 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{completedCount}회 실천</span>
                        </span>
                      )}
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

                  {/* Redesigned Button State */}
                  <button
                    onClick={(e) => {
                      if (completedCount > 0 || isJoined) {
                        handleOpenVerifyDirectly(ch, e);
                      } else {
                        e.stopPropagation();
                        setSelectedChallenge(ch);
                      }
                    }}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1 ${
                      completedCount > 0
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/20'
                        : isJoined
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                    }`}
                  >
                    {completedCount > 0 ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>다시 도전 ↻</span>
                      </>
                    ) : isJoined ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>인증하기</span>
                      </>
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
