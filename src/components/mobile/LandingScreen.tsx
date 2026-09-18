import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Leaf, Trophy, TreePine, Zap } from 'lucide-react';

export const LandingScreen: React.FC = () => {
  const { openAuthModal, login } = useApp();

  const handleQuickDemo = () => {
    login('지구지키미', '경상국립대학교', '경영정보학과', '3학년', '20230101');
  };

  return (
    <div className="h-full bg-gradient-to-b from-[#E8F6FA] via-white to-emerald-50/70 p-5 flex flex-col justify-between animate-fadeIn relative overflow-hidden select-none">
      {/* Top Ambient Light Glow */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#D4F0FA] via-sky-100/50 to-transparent pointer-events-none" />

      {/* Top Section - Text from User's First Prompt */}
      <div className="pt-2 space-y-2.5 relative z-10">
        {/* Brand Tag & Subtitle */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-300 flex items-center justify-center shadow-xs">
            <Leaf className="w-4.5 h-4.5 text-emerald-950 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xs font-bold tracking-tight text-emerald-800 uppercase block font-sans">
              GreenStep
            </span>
            <span className="text-[11px] text-slate-500 font-medium block">
              작은 실천이 만드는 큰 변화
            </span>
          </div>
        </div>

        {/* Main Title & Slogan */}
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-snug">
          작은 실천이 만드는 <br />
          <span className="text-emerald-600">큰 변화</span> 🌱
        </h1>

        {/* Description */}
        <p className="text-xs text-slate-600 font-normal leading-relaxed">
          일상생활에서 실천할 수 있는 친환경 행동에 참여하고 인증하여 탄소절감량과 포인트를 얻고, 개인 및 학과별 랭킹을 통해 지속적으로 동참해보세요!
        </p>
      </div>

      {/* Center Section - New Transparent Jinu Mascot + 4 Floating Motion Eco Bubbles */}
      <div className="my-2 relative flex items-center justify-center flex-1">
        {/* Circular Light Backdrop */}
        <div className="w-64 h-64 rounded-full bg-gradient-to-tr from-sky-100/70 via-emerald-100/60 to-white/90 flex items-center justify-center shadow-inner relative border border-emerald-100/80">

          {/* ======================================================== */}
          {/* 4 LIVELY FLOATING ECO MOTION BUBBLES                     */}
          {/* ======================================================== */}
          
          {/* Floating Bubble 1: Top-Left Leaf (Bounce motion) */}
          <div className="absolute top-2 left-1 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl shadow-lg border border-emerald-200 flex items-center justify-center animate-bounce duration-1000 z-20">
            <Leaf className="w-5 h-5 text-emerald-600" />
          </div>

          {/* Floating Bubble 2: Top-Right Trophy (Pulse motion) */}
          <div className="absolute top-4 right-1 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl shadow-lg border border-amber-200 flex items-center justify-center animate-pulse z-20">
            <Trophy className="w-5 h-5 text-amber-500 fill-amber-400" />
          </div>

          {/* Floating Bubble 3: Bottom-Left Virtual Tree */}
          <div className="absolute bottom-4 left-2 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl shadow-lg border border-teal-200 flex items-center justify-center z-20">
            <TreePine className="w-5 h-5 text-teal-600" />
          </div>

          {/* Floating Bubble 4: Bottom-Right Zap Points */}
          <div className="absolute bottom-3 right-2 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl shadow-lg border border-amber-200 flex items-center justify-center z-20">
            <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>

          {/* Center Transparent Jinu Mascot Image */}
          <div className="relative z-10 w-48 h-48 flex items-center justify-center">
            <img
              src="/jinu_transparent.jpg"
              alt="GreenStep 마스코트 지누"
              className="w-full h-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>

      {/* Bottom Section - Login & Signup Buttons from First Prompt */}
      <div className="space-y-2 relative z-30 pt-1">
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => openAuthModal('login')}
            className="py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center space-x-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <span>로그인</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => openAuthModal('signup')}
            className="py-3.5 bg-white hover:bg-slate-50 text-emerald-700 font-extrabold text-sm rounded-2xl shadow-md border border-emerald-200 flex items-center justify-center space-x-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <span>회원가입</span>
          </button>
        </div>

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
