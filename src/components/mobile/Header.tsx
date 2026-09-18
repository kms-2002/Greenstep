import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Menu, ChevronDown, Zap } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, setActiveTab } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-slate-100 shadow-xs">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* Left: Brand Logo & Dropdown Badge (Carbon Pay Style) */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 font-black text-xl text-slate-900 tracking-tight font-sans">
            <span className="text-slate-900 font-extrabold">Green</span>
            <span className="text-emerald-600 font-black">step</span>
          </div>

          <div className="inline-flex items-center space-x-1 bg-emerald-700 text-white px-2 py-0.5 rounded-md text-[11px] font-bold shadow-xs cursor-pointer hover:bg-emerald-800 transition-colors">
            <span>GNU</span>
            <ChevronDown className="w-3 h-3 stroke-[3]" />
          </div>
        </div>

        {/* Right: Notifications Bell & Hamburger Menu Icon */}
        <div className="flex items-center space-x-2">
          {/* Quick Points badge */}
          <div
            onClick={() => setActiveTab('my')}
            className="flex items-center space-x-1 bg-amber-50 border border-amber-200 text-amber-700 font-extrabold text-xs px-2.5 py-1 rounded-full cursor-pointer hover:bg-amber-100 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>{user.points.toLocaleString()}P</span>
          </div>

          {/* Bell Icon with Red Notification Dot */}
          <button
            onClick={() => alert('🔔 [알림] 진주시 남강 텀블러 인증 챌린지 포인트가 정상 적립되었습니다.')}
            className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors relative cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          </button>

          {/* Hamburger Menu Icon */}
          <button
            onClick={() => setActiveTab('my')}
            className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
