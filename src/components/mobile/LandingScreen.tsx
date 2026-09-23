import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Leaf, Trophy, TreePine, Zap, RotateCcw } from 'lucide-react';

export const LandingScreen: React.FC = () => {
  const { openAuthModal } = useApp();

  const handleReset = () => {
    window.location.reload();
  };

  return (
    <div className="h-full bg-gradient-to-b from-[#F3FAF8] via-white to-[#EBF7F4] p-5 flex flex-col justify-between animate-fadeIn relative overflow-hidden select-none">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 inset-x-0 h-44 bg-gradient-to-b from-[#D4F2FA]/60 via-[#EAF7FA]/30 to-transparent pointer-events-none" />

      {/* 1. Header Bar: Logo & ALIO / Image 1 Style [ ↻ 처음으로 ] Button */}
      <div className="flex items-center justify-between relative z-20 pt-1 pb-1">
        {/* Eyebrow / Brand Tag */}
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

        {/* "처음으로" Reset Button */}
        <button
          onClick={handleReset}
          className="px-3.5 py-1.5 bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-full shadow-xs flex items-center space-x-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer active:scale-95"
          title="처음 시작화면으로 초기화"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>처음으로</span>
        </button>
      </div>

      {/* 2. ALIO Style Hero Headline & Copy */}
      <div className="pt-2 space-y-2.5 relative z-10">
        <h1 className="text-[26px] font-bold text-slate-900 tracking-tight leading-[1.22] font-sans">
          <span>탄소 절감은 </span>
          <span className="text-emerald-600 font-extrabold">GreenStep이,</span> <br />
          <span>환경 관리는 </span>
          <span className="text-sky-600 font-extrabold">지구지키미가.</span>
        </h1>

        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-800 tracking-tight">
            놓치는 실천 혜택 없이
          </h2>

          <p className="text-xs text-slate-600 font-normal leading-relaxed">
            경상국립대 경영대학과 진주시가 함께하는 친환경 실천을 자동으로 인증하고 탄소 포인트와 학과 랭킹 혜택까지 정리해드려요.
          </p>
        </div>
      </div>

      {/* 3. Center Section: Mascot Jinu & Floating Eco Chips */}
      <div className="my-1 relative flex items-center justify-center flex-1">
        {/* Soft Glowing Ambient Backdrop Circle */}
        <div className="w-64 h-64 rounded-full bg-gradient-to-tr from-[#DBF3FA]/70 via-emerald-100/50 to-white flex items-center justify-center shadow-inner relative border border-emerald-100/60">

          {/* 4 LIVELY FLOATING ECO MOTION CHIPS */}
          <div className="absolute top-2 left-0 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-2xl shadow-xs border border-emerald-200/80 flex items-center space-x-1.5 animate-bounce duration-1000 z-20">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] font-bold text-emerald-900">친환경 실천</span>
          </div>

          <div className="absolute top-3 right-0 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-2xl shadow-xs border border-amber-200/80 flex items-center space-x-1.5 animate-pulse z-20">
            <Trophy className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span className="text-[10px] font-bold text-amber-900">탄소 포인트</span>
          </div>

          <div className="absolute bottom-3 left-1 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-2xl shadow-xs border border-teal-200/80 flex items-center space-x-1.5 z-20">
            <TreePine className="w-4 h-4 text-teal-600" />
            <span className="text-[10px] font-bold text-teal-900">나무 가꾸기</span>
          </div>

          <div className="absolute bottom-2 right-1 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-2xl shadow-xs border border-sky-200/80 flex items-center space-x-1.5 z-20">
            <Zap className="w-4 h-4 text-sky-500 fill-sky-500" />
            <span className="text-[10px] font-bold text-sky-900">에너지 절약</span>
          </div>

          {/* Center Mascot Image (Full uncropped transparent PNG) */}
          <div className="relative z-10 w-52 h-52 flex items-center justify-center">
            <img
              src="/jinu_clean.png"
              alt="GreenStep 마스코트 지누"
              className="w-full h-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>

      {/* 4. ALIO Style Hero Button Bar */}
      <div className="relative z-30 pt-1 space-y-2">
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
            className="py-3.5 bg-white hover:bg-slate-50 text-emerald-700 font-bold text-sm rounded-2xl shadow-xs border border-emerald-200/90 flex items-center justify-center space-x-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <span>회원가입</span>
          </button>
        </div>

        <p className="text-[11px] text-center text-slate-400 font-normal">
          경상국립대학교 경영대학 5개 학과 재학생 연동
        </p>
      </div>
    </div>
  );
};
