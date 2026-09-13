import React from 'react';
import { calculateTreeInfo } from '../../utils/carbonCalculator';
import { Sparkles, TreePine, Leaf } from 'lucide-react';

interface VirtualTreeProps {
  totalCarbon: number;
}

export const VirtualTree: React.FC<VirtualTreeProps> = ({ totalCarbon }) => {
  const treeInfo = calculateTreeInfo(totalCarbon);
  const { level, stage, progressPercent, remainingCarbon } = treeInfo;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-emerald-800 via-teal-900 to-slate-900 text-white p-5 shadow-xl border border-emerald-700/50">
      {/* Background Ambient Lighting & Sunbeam Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />

      {/* Floating Eco Particles */}
      <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
        <Leaf className="absolute top-4 left-6 w-4 h-4 text-emerald-300 animate-bounce duration-1000" />
        <Sparkles className="absolute top-10 right-8 w-4 h-4 text-amber-200 animate-pulse" />
        <Leaf className="absolute bottom-8 right-12 w-3 h-3 text-teal-200 animate-pulse duration-700" />
      </div>

      {/* Header Info */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-emerald-700/60 backdrop-blur-md rounded-2xl border border-emerald-500/40">
            <TreePine className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-emerald-100 flex items-center gap-1.5">
              <span>나의 탄소나무</span>
              <span className="text-xs font-normal text-emerald-300/80">({stage.name})</span>
            </h3>
            <p className="text-xs text-emerald-200/90 font-mono">
              누적 절감 {totalCarbon.toFixed(1)}kg CO₂e
            </p>
          </div>
        </div>

        {/* Level Badge Pill */}
        <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-full shadow-lg shadow-amber-500/25 flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
          <span>현재 Lv.{level}</span>
        </div>
      </div>

      {/* Center Animated Tree Illustration Container */}
      <div className="relative z-10 my-4 flex flex-col items-center justify-center py-2">
        <div className="relative flex items-center justify-center w-36 h-36">
          {/* Ground Aura Ring */}
          <div className="absolute bottom-1 w-28 h-6 bg-emerald-950/80 rounded-full blur-md border border-emerald-600/30" />

          {/* Dynamic SVG Tree depending on stage */}
          <div className="relative z-10 transition-transform duration-500 hover:scale-105 cursor-pointer">
            {stage.level === 1 && (
              <div className="flex flex-col items-center">
                <span className="text-7xl drop-shadow-[0_10px_20px_rgba(16,185,129,0.5)] animate-bounce">🌱</span>
                <span className="text-[11px] text-emerald-200 mt-1 font-medium bg-emerald-900/60 px-2 py-0.5 rounded-full">
                  Lv.1~4 새싹 싹트기
                </span>
              </div>
            )}
            {stage.level === 2 && (
              <div className="flex flex-col items-center">
                <span className="text-7xl drop-shadow-[0_10px_20px_rgba(16,185,129,0.5)] animate-pulse">🌿</span>
                <span className="text-[11px] text-emerald-200 mt-1 font-medium bg-emerald-900/60 px-2 py-0.5 rounded-full">
                  Lv.5~8 파릇파릇 어린줄기
                </span>
              </div>
            )}
            {stage.level === 3 && (
              <div className="flex flex-col items-center">
                <span className="text-7xl drop-shadow-[0_10px_20px_rgba(16,185,129,0.5)]">🪴</span>
                <span className="text-[11px] text-emerald-200 mt-1 font-medium bg-emerald-900/60 px-2 py-0.5 rounded-full">
                  Lv.9~11 튼튼한 어린나무
                </span>
              </div>
            )}
            {stage.level === 4 && (
              <div className="flex flex-col items-center">
                <span className="text-8xl drop-shadow-[0_12px_24px_rgba(16,185,129,0.6)]">🌳</span>
                <span className="text-[11px] text-emerald-200 mt-1 font-medium bg-emerald-900/60 px-2 py-0.5 rounded-full">
                  Lv.12~18 푸르른 싱싱한 나무
                </span>
              </div>
            )}
            {stage.level >= 5 && (
              <div className="flex flex-col items-center">
                <span className="text-8xl drop-shadow-[0_15px_30px_rgba(16,185,129,0.7)] animate-pulse">🌲</span>
                <span className="text-[11px] text-emerald-200 mt-1 font-medium bg-emerald-900/60 px-2 py-0.5 rounded-full">
                  Lv.19~20 거대한 탄소보호숲
                </span>
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-center text-emerald-200/90 font-light mt-1 max-w-xs">
          "{stage.description}"
        </p>
      </div>

      {/* Progress Bar Footer */}
      <div className="relative z-10 bg-emerald-950/60 border border-emerald-800/80 rounded-2xl p-3">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-emerald-300 font-medium">다음 단계 성장 진행률</span>
          <span className="font-mono text-emerald-100 font-bold">{progressPercent}%</span>
        </div>

        <div className="w-full bg-slate-800/90 rounded-full h-3 overflow-hidden p-0.5 border border-emerald-900">
          <div
            className="bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-300 h-full rounded-full transition-all duration-700 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[11px] text-emerald-300/80 mt-1.5 font-light">
          <span>다음 단계까지</span>
          <span className="font-semibold text-emerald-200">
            {remainingCarbon > 0 ? `${remainingCarbon}kg CO₂e 남음` : '최고 단계 달성! 🎉'}
          </span>
        </div>
      </div>
    </div>
  );
};
