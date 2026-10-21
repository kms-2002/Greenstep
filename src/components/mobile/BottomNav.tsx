import React from 'react';
import type { TabType } from '../../context/AppContext';
import { useApp } from '../../context/AppContext';
import { MapPinned, Clover, Home, Target, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: '홈', icon: <Home className="w-5 h-5" /> },
    { id: 'challenge', label: '챌린지', icon: <Target className="w-5 h-5" /> },
    { id: 'map', label: '실천지도', icon: <MapPinned className="w-5 h-5" /> },
    { id: 'quiz', label: '그린퀴즈', icon: <Clover className="w-5 h-5" /> },
    { id: 'my', label: '마이페이지', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <nav aria-label="하단 메뉴" className="bottom-nav shrink-0 w-full bg-white border-t border-slate-100 z-30 select-none">
      <div className="grid grid-cols-5 items-center h-14 px-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => setActiveTab(item.id)}
              className={`min-w-0 flex flex-col items-center justify-center h-full transition-colors duration-200 relative ${
                isActive ? 'text-emerald-600 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 w-7 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-b-full shadow-sm shadow-emerald-500/40" />
              )}
              <div
                className={`p-0.5 rounded-xl transition-transform duration-200 ${
                  isActive ? 'scale-110 text-emerald-600' : ''
                }`}
              >
                {item.icon}
              </div>
              <span className={`text-[9.5px] tracking-tight mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
