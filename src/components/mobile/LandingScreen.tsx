import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Leaf, Trophy, TreePine, Zap } from 'lucide-react';

export const LandingScreen: React.FC = () => {
  const { setIsAuthModalOpen, login } = useApp();

  const handleStart = () => {
    setIsAuthModalOpen(true);
  };

  const handleQuickDemo = () => {
    login('지구지키미', '경상국립대학교', '경영정보학과', '3학년');
  };

  return (
    <div className="h-full bg-[#E5F5FA] flex flex-col justify-between animate-fadeIn relative overflow-hidden select-none">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#D4F0FA] to-transparent pointer-events-none" />

      {/* Main Image Container - Perfectly Ratioed without Cropping */}
      <div className="relative flex-1 w-full flex items-center justify-center p-3 pt-1 overflow-hidden">
        {/* Exact User Artwork with Perfect Aspect Ratio */}
        <div className="relative w-full max-w-full h-full flex items-center justify-center">
          <img
            src="/jinu_hero.jpg"
            alt="GreenStep 시작 화면"
            className="max-w-full max-h-full w-auto h-auto object-contain rounded-3xl shadow-sm drop-shadow-md"
          />

          {/* ======================================================== */}
          {/* 4 LIVELY FLOATING ECO MOTION BUBBLES (User Favorite!)     */}
          {/* ======================================================== */}

          {/* Floating Icon 1: Top-Left Leaf (Bounce motion) */}
          <div className="absolute top-4 left-3 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl shadow-lg border border-emerald-200/90 flex items-center justify-center animate-bounce duration-1000 z-20">
            <Leaf className="w-5 h-5 text-emerald-600" />
          </div>

          {/* Floating Icon 2: Top-Right Trophy (Pulse motion) */}
          <div className="absolute top-6 right-3 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl shadow-lg border border-amber-200/90 flex items-center justify-center animate-pulse z-20">
            <Trophy className="w-5 h-5 text-amber-500 fill-amber-400" />
          </div>

          {/* Floating Icon 3: Mid-Left Virtual Tree */}
          <div className="absolute bottom-16 left-3 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl shadow-lg border border-teal-200/90 flex items-center justify-center z-20">
            <TreePine className="w-5 h-5 text-teal-600" />
          </div>

          {/* Floating Icon 4: Mid-Right Points Zap */}
          <div className="absolute bottom-14 right-3 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl shadow-lg border border-amber-200/90 flex items-center justify-center z-20">
            <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
        </div>
      </div>

      {/* Bottom Action Drawer Container */}
      <div className="bg-white/95 backdrop-blur-md p-4 pt-3 space-y-2 border-t border-sky-100/80 relative z-30 shadow-lg shrink-0">
        <button
          onClick={handleStart}
          className="w-full py-3.5 bg-gradient-to-r from-sky-500 via-emerald-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-sky-500/25 flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer"
        >
          <span>시작하기</span>
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </div>
        </button>

        <button
          onClick={handleQuickDemo}
          className="w-full py-1.5 text-center text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
        >
          경상국립대 학생으로 바로 체험하기
        </button>
      </div>
    </div>
  );
};
