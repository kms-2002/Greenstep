import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, CheckCircle2, Sparkles, TreePine, Zap } from 'lucide-react';

export const SuccessModal: React.FC = () => {
  const { isSuccessModalOpen, setIsSuccessModalOpen, completionResult } = useApp();

  if (!isSuccessModalOpen || !completionResult) return null;

  const { challengeTitle, carbonSaved, pointsEarned, unlockedBadge, leveledUp, newLevel } = completionResult;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-slate-100 p-6 text-center animate-scaleUp relative">
        {/* Top Glow Background */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-emerald-100 to-transparent pointer-events-none" />

        {/* Success Icon */}
        <div className="relative z-10 w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full mx-auto flex items-center justify-center shadow-xl shadow-emerald-500/40 mb-4 animate-bounce">
          <CheckCircle2 className="w-12 h-12 text-white stroke-[2.5]" />
        </div>

        <h3 className="text-2xl font-black text-slate-800 tracking-tight font-sans">
          🎉 {challengeTitle} 성공!
        </h3>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          "오늘도 지구를 위한 한 걸음을 실천했어요."
        </p>

        {/* Reward Summary Pill Container */}
        <div className="my-5 p-4 bg-emerald-50 rounded-2xl border border-emerald-200/80 space-y-2">
          <div className="flex items-center justify-between text-emerald-900 font-bold text-sm">
            <span className="flex items-center gap-1.5 text-xs text-emerald-700">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              획득 포인트
            </span>
            <span className="text-base text-amber-600 font-extrabold">+{pointsEarned}P</span>
          </div>

          <div className="h-px bg-emerald-200/60" />

          <div className="flex items-center justify-between text-emerald-900 font-bold text-sm">
            <span className="flex items-center gap-1.5 text-xs text-emerald-700">
              <TreePine className="w-4 h-4 text-emerald-600" />
              탄소절감량
            </span>
            <span className="text-base text-emerald-700 font-extrabold">
              +{carbonSaved.toFixed(1)}kg CO₂e
            </span>
          </div>
        </div>

        {/* Level Up Notification if triggered */}
        {leveledUp && (
          <div className="mb-3 p-3 bg-amber-500/10 border border-amber-400 rounded-2xl flex items-center space-x-2 text-left animate-pulse">
            <div className="p-2 bg-amber-400 rounded-xl text-slate-950 font-bold">
              <TreePine className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-amber-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                탄소나무 성장의 신호!
              </span>
              <p className="text-[11px] text-amber-800 font-medium">
                축하합니다! 나의 나무가 <b>Lv.{newLevel}</b>로 성장했어요!
              </p>
            </div>
          </div>
        )}

        {/* Unlocked Badge Alert if triggered */}
        {unlockedBadge && (
          <div className="mb-3 p-3 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center space-x-3 text-left">
            <span className="text-3xl">{unlockedBadge.icon}</span>
            <div>
              <span className="text-xs font-bold text-indigo-900 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-indigo-600" />
                신규 배지 획득!
              </span>
              <p className="text-xs font-black text-indigo-950">{unlockedBadge.name}</p>
            </div>
          </div>
        )}

        {/* Confirm Button */}
        <button
          onClick={() => setIsSuccessModalOpen(false)}
          className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
        >
          확인
        </button>
      </div>
    </div>
  );
};
