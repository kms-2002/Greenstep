import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Leaf, Trophy, TreePine, Zap, RotateCcw, Sparkles } from 'lucide-react';

export const LandingScreen: React.FC = () => {
  const { openAuthModal, login } = useApp();

  const handleQuickDemo = () => {
    login('지구지키미', '경상국립대학교', '경영정보학과', '3학년', '20230101');
  };

  const handleReset = () => {
    window.location.reload();
  };

  return (
    <div className="h-full bg-gradient-to-b from-[#E8F6FA] via-[#F3FAFC] to-emerald-50/70 p-5 flex flex-col justify-between animate-fadeIn relative overflow-hidden select-none">
      {/* Top Ambient Light Glow */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#D2F0FA] via-sky-100/40 to-transparent pointer-events-none" />

      {/* Top Header Bar: Logo & Image 1 Style [ ↻ 처음으로 ] Pill Button */}
      <div className="flex items-center justify-between relative z-20 pt-1 pb-1">
        {/* Sub-Brand Label (Image 2 ALIO Style Header) */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-300 flex items-center justify-center shadow-xs">
            <Leaf className="w-4.5 h-4.5 text-emerald-950 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold tracking-widest text-slate-400 uppercase block font-mono">
              GNU · GREENSTEP ECO APP
            </span>
          </div>
        </div>

        {/* Image 1 "처음으로" Pill Button */}
        <button
          onClick={handleReset}
          className="px-3.5 py-1.5 bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-full shadow-xs flex items-center space-x-1.5 text-xs font-bold text-slate-700 hover:bg-white hover:border-slate-300 transition-all cursor-pointer active:scale-95"
          title="처음 시작화면으로 초기화"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>처음으로</span>
        </button>
      </div>

      {/* Main Headline Section (Image 2 Reference Style: ALIO Headline Format) */}
      <div className="pt-2 space-y-3 relative z-10">
        {/* Main Title lines matching Image 2 typography */}
        <h1 className="text-[25px] font-bold text-slate-900 tracking-tight leading-[1.25]">
          탄소 절감은 <span className="text-emerald-600 font-extrabold">GreenStep이,</span> <br />
          환경 관리는 <span className="text-sky-600 font-extrabold">지구지키미가.</span>
        </h1>

        {/* Sub-Headline matching Image 2 */}
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
            <span>놓치는 실천 혜택 없이</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              GNU 경영대
            </span>
          </h2>

          <p className="text-xs text-slate-600 font-normal leading-relaxed">
            경상국립대 경영대학과 진주시가 함께하는 친환경 실천을 자동으로 인증하고 탄소 포인트와 학과 랭킹 혜택까지 한번에 정리해드려요.
          </p>
        </div>
      </div>

      {/* Center Section: Mascot Jinu with Cleaned Background (Eliminating Checkerboard Grid) */}
      <div className="my-2 relative flex items-center justify-center flex-1">
        {/* Soft Ambient Backdrop Circle */}
        <div className="w-60 h-60 rounded-full bg-gradient-to-tr from-[#DBF3FA] via-emerald-100/50 to-white flex items-center justify-center shadow-inner relative border border-emerald-100/70">

          {/* 4 LIVELY FLOATING ECO MOTION BUBBLES */}
          <div className="absolute top-2 left-1 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl shadow-md border border-emerald-200 flex items-center justify-center animate-bounce duration-1000 z-20">
            <Leaf className="w-4.5 h-4.5 text-emerald-600" />
          </div>

          <div className="absolute top-3 right-1 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl shadow-md border border-amber-200 flex items-center justify-center animate-pulse z-20">
            <Trophy className="w-4.5 h-4.5 text-amber-500 fill-amber-400" />
          </div>

          <div className="absolute bottom-3 left-2 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl shadow-md border border-teal-200 flex items-center justify-center z-20">
            <TreePine className="w-4.5 h-4.5 text-teal-600" />
          </div>

          <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl shadow-md border border-amber-200 flex items-center justify-center z-20">
            <Zap className="w-4.5 h-4.5 text-amber-500 fill-amber-500" />
          </div>

          {/* 
            Center Jinu Mascot Image 
            Pure transparent PNG with zero background grid artifacts (Full body uncropped)
          */}
          <div className="relative z-10 w-52 h-52 flex items-center justify-center">
            <img
              src="/jinu_clean.png"
              alt="GreenStep 마스코트 지누"
              className="w-full h-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>

      {/* Bottom Section - Login & Signup Buttons */}
      <div className="space-y-2 relative z-30 pt-1">
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => openAuthModal('login')}
            className="py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-2xl shadow-md shadow-emerald-600/25 flex items-center justify-center space-x-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <span>로그인</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => openAuthModal('signup')}
            className="py-3.5 bg-white hover:bg-slate-50 text-emerald-700 font-bold text-sm rounded-2xl shadow-xs border border-emerald-200 flex items-center justify-center space-x-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <span>회원가입</span>
          </button>
        </div>

        <button
          onClick={handleQuickDemo}
          className="w-full py-2 text-center text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors flex items-center justify-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>경상국립대 학생으로 바로 체험하기</span>
        </button>
      </div>
    </div>
  );
};
