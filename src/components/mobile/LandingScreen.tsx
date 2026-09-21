import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Leaf, Trophy, TreePine, Zap, RotateCcw } from 'lucide-react';

export const LandingScreen: React.FC = () => {
  const { openAuthModal } = useApp();

  const handleReset = () => {
    window.location.reload();
  };

  return (
    <div className="h-full bg-gradient-to-b from-[#EFF9FC] via-white to-[#EBF7F4] p-5 flex flex-col justify-between animate-fadeIn relative overflow-hidden select-none">
      {/* Top Ambient Glow Effect */}
      <div className="absolute top-0 inset-x-0 h-44 bg-gradient-to-b from-[#D5F2FA]/70 via-[#E8F6FA]/30 to-transparent pointer-events-none" />

      {/* 1. Header Bar: Clean Logo & Image 1 Style [ ↻ 처음으로 ] Pill Button */}
      <div className="flex items-center justify-between relative z-20 pt-1 pb-1">
        {/* Brand Logo & Tag */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-300 flex items-center justify-center shadow-xs">
            <Leaf className="w-4.5 h-4.5 text-emerald-950 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xs font-bold tracking-tight text-slate-900 font-sans block">
              Green<span className="text-emerald-600 font-extrabold">Step</span>
            </span>
            <span className="text-[10px] text-emerald-700 font-bold block -mt-0.5">
              GNU 경영대학
            </span>
          </div>
        </div>

        {/* Image 1 "처음으로" Reset Button */}
        <button
          onClick={handleReset}
          className="px-3.5 py-1.5 bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-full shadow-xs flex items-center space-x-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer active:scale-95"
          title="첫 화면으로 초기화"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>처음으로</span>
        </button>
      </div>

      {/* 2. Main Hero Typography (Clean & Impactful Real Mobile App Splash Headline) */}
      <div className="pt-2 space-y-2 relative z-10">
        <div className="inline-flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-extrabold text-emerald-800 tracking-tight">
            경상국립대 & 진주시 탄소절감 앱
          </span>
        </div>

        <h1 className="text-[26px] font-bold text-slate-900 tracking-tight leading-[1.25] pt-0.5">
          탄소 절감은 <span className="text-emerald-600 font-extrabold">GreenStep이,</span> <br />
          환경 관리는 <span className="text-sky-600 font-extrabold">지구지키미가.</span>
        </h1>

        <p className="text-xs text-slate-600 font-normal leading-relaxed pt-0.5">
          일상생활 속 작은 실천으로 탄소 포인트를 적립하고, 경영대학 5개 학과 랭킹에 동참해보세요!
        </p>
      </div>

      {/* 3. Center Hero Section: Clean Mascot Jinu & 4 Lively Floating Eco Bubbles */}
      <div className="my-1 relative flex items-center justify-center flex-1">
        {/* Soft Glowing Ambient Backdrop Circle */}
        <div className="w-64 h-64 rounded-full bg-gradient-to-tr from-[#D7F3FC]/80 via-emerald-100/50 to-white/90 flex items-center justify-center shadow-inner relative border border-emerald-100/60">

          {/* 4 LIVELY FLOATING ECO MOTION BUBBLES */}
          <div className="absolute top-2 left-0 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-2xl shadow-md border border-emerald-200 flex items-center space-x-1.5 animate-bounce duration-1000 z-20">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] font-bold text-emerald-900">친환경 실천</span>
          </div>

          <div className="absolute top-3 right-0 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-2xl shadow-md border border-amber-200 flex items-center space-x-1.5 animate-pulse z-20">
            <Trophy className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span className="text-[10px] font-bold text-amber-900">탄소 포인트</span>
          </div>

          <div className="absolute bottom-3 left-1 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-2xl shadow-md border border-teal-200 flex items-center space-x-1.5 z-20">
            <TreePine className="w-4 h-4 text-teal-600" />
            <span className="text-[10px] font-bold text-teal-900">나무 가꾸기</span>
          </div>

          <div className="absolute bottom-2 right-1 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-2xl shadow-md border border-sky-200 flex items-center space-x-1.5 z-20">
            <Zap className="w-4 h-4 text-sky-500 fill-sky-500" />
            <span className="text-[10px] font-bold text-sky-900">에너지 절약</span>
          </div>

          {/* 
            Center Pure Transparent Jinu Mascot Image
            Full body uncropped with clean transparent background
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

      {/* 4. Bottom Section - High-Impact Login & Signup Buttons (Play Store App CTA Bar) */}
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
          경상국립대학교 경영대학 5개 학과 재학생 자동 연동
        </p>
      </div>
    </div>
  );
};
