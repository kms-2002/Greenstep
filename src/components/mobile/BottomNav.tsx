import React from 'react';
import type { TabType } from '../../context/AppContext';
import { useApp } from '../../context/AppContext';
import { Activity, Award, Home, Target, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: '홈', icon: <Home className="w-5 h-5" /> },
    { id: 'challenge', label: '챌린지', icon: <Target className="w-5 h-5" /> },
    { id: 'ranking', label: '랭킹', icon: <Award className="w-5 h-5" /> },
    { id: 'activity', label: '나의 활동', icon: <Activity className="w-5 h-5" /> },
    { id: 'my', label: '마이', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <nav className="shrink-0 w-full bg-white/95 backdrop-blur-lg border-t border-slate-100 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] z-30 select-none">
      <div className="flex justify-around items-center h-14 px-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center h-full transition-all duration-200 relative ${
                isActive ? 'text-emerald-600 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-b-full shadow-sm shadow-emerald-500/40" />
              )}
              <div
                className={`p-0.5 rounded-xl transition-transform duration-200 ${
                  isActive ? 'scale-110 text-emerald-600' : ''
                }`}
              >
                {item.icon}
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
