import React, { useState } from 'react';
import { calculateTreeInfo, TREE_STAGES } from '../../utils/carbonCalculator';
import { ChevronRight, Sparkles, TreePine, Leaf, X } from 'lucide-react';
import type { TreeStage } from '../../utils/carbonCalculator';

interface VirtualTreeProps {
  totalCarbon: number;
}

const TreeArtwork: React.FC<{ treeStage: TreeStage; sizeClass: string }> = ({ treeStage, sizeClass }) => (
  <span className={`relative inline-flex items-center justify-center ${sizeClass}`} aria-label={treeStage.fruitBearing ? '열매가 열린 나무' : treeStage.name}>
    <span>{treeStage.emoji}</span>
    {treeStage.fruitBearing && <>
      <span aria-hidden="true" className="absolute left-[18%] top-[27%] text-[0.28em]">🍎</span>
      <span aria-hidden="true" className="absolute right-[18%] top-[38%] text-[0.28em]">🍊</span>
      <span aria-hidden="true" className="absolute left-[42%] top-[52%] text-[0.26em]">🍎</span>
    </>}
  </span>
);

export const VirtualTree: React.FC<VirtualTreeProps> = ({ totalCarbon }) => {
  const treeInfo = calculateTreeInfo(totalCarbon);
  const { level, stage, progressPercent, remainingCarbon } = treeInfo;
  const [isGrowthGuideOpen, setIsGrowthGuideOpen] = useState(false);
  const [selectedStageLevel, setSelectedStageLevel] = useState(stage.level);
  const selectedStage = TREE_STAGES.find((item) => item.level === selectedStageLevel) ?? stage;
  const treeSize = ['text-6xl', 'text-7xl', 'text-8xl', 'text-9xl'][selectedStage.level - 1];
  const currentTreeSize = ['text-6xl', 'text-7xl', 'text-8xl', 'text-9xl'][stage.level - 1];

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
          <button
            type="button"
            onClick={() => { setSelectedStageLevel(stage.level); setIsGrowthGuideOpen(true); }}
            aria-label="탄소나무 레벨별 성장 모습 보기"
            className="relative z-10 flex flex-col items-center transition-transform duration-500 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300"
          >
            <span className={`drop-shadow-[0_10px_20px_rgba(16,185,129,0.5)] ${stage.level <= 2 ? 'animate-pulse' : ''} ${stage.level >= 4 ? 'animate-bounce' : ''}`}>
              <TreeArtwork treeStage={stage} sizeClass={currentTreeSize} />
            </span>
            <span className="mt-1 rounded-full bg-emerald-900/60 px-2 py-0.5 text-[11px] font-medium text-emerald-200">Lv.{stage.minLevel}~{stage.maxLevel} {stage.name}</span>
          </button>
        </div>

        <p className="text-xs text-center text-emerald-200/90 font-light mt-1 max-w-xs">
          "{stage.description}"
        </p>
        <button type="button" onClick={() => { setSelectedStageLevel(stage.level); setIsGrowthGuideOpen(true); }} className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-200/80 hover:text-white">
          레벨별 나무 성장 보기 <ChevronRight className="h-3.5 w-3.5" />
        </button>
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

      {isGrowthGuideOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm" onClick={() => setIsGrowthGuideOpen(false)}>
          <section role="dialog" aria-modal="true" aria-labelledby="tree-growth-title" onClick={(event) => event.stopPropagation()} className="relative max-h-[85vh] w-full max-w-sm space-y-4 overflow-y-auto rounded-3xl bg-white p-5 text-slate-900 shadow-2xl">
            <button type="button" onClick={() => setIsGrowthGuideOpen(false)} aria-label="닫기" className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            <div>
              <h3 id="tree-growth-title" className="text-base font-extrabold">나의 탄소나무 성장 단계</h3>
              <p className="mt-1 text-xs text-slate-500">실천이 쌓일수록 나무의 모습이 달라져요.</p>
            </div>

            <div className="space-y-2">
              {TREE_STAGES.map((growthStage) => {
                const isCurrent = growthStage.level === stage.level;
                const isSelected = growthStage.level === selectedStage.level;
                return (
                  <button key={growthStage.level} type="button" onClick={() => setSelectedStageLevel(growthStage.level)} className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${isSelected ? 'border-emerald-400 bg-emerald-50' : 'border-slate-100 bg-slate-50 hover:bg-slate-100'}`}>
                    <TreeArtwork treeStage={growthStage} sizeClass="text-3xl" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-extrabold text-slate-800">Lv.{growthStage.minLevel}~{growthStage.maxLevel} · {growthStage.name}</span>
                      <span className="mt-0.5 block text-[10px] text-slate-500">누적 {growthStage.minCarbon}kg 이상 실천</span>
                    </span>
                    {isCurrent && <span className="rounded-full bg-emerald-600 px-2 py-1 text-[9px] font-extrabold text-white">현재 Lv.{level}</span>}
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 p-4 text-center">
              <span className="drop-shadow-sm"><TreeArtwork treeStage={selectedStage} sizeClass={treeSize} /></span>
              <p className="mt-1 text-sm font-extrabold text-emerald-900">Lv.{selectedStage.minLevel}~{selectedStage.maxLevel} {selectedStage.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{selectedStage.description}</p>
              {selectedStage.level === stage.level && <p className="mt-2 text-[11px] font-bold text-emerald-700">현재 나무 · Lv.{level}</p>}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
