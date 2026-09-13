import React from 'react';
import { useApp } from '../../context/AppContext';
import { Leaf, Zap } from 'lucide-react';

export const Header: React.FC = () => {
  const { user } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-emerald-900/95 backdrop-blur-md text-white px-4 py-3 border-b border-emerald-800 shadow-md">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* Brand & Slogan */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-200 flex items-center justify-center shadow-inner">
            <Leaf className="w-5 h-5 text-emerald-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white font-sans">
                Green<span className="text-emerald-400">Step</span>
              </span>
              <span className="text-[10px] bg-emerald-800 text-emerald-200 px-1.5 py-0.5 rounded font-medium">
                Univ
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/90 font-light tracking-tight">
              작은 실천이 만드는 큰 변화
            </p>
          </div>
        </div>

        {/* User Points Quick Pill */}
        <div className="flex items-center space-x-1 bg-emerald-950/70 border border-emerald-700/60 text-amber-300 font-bold text-xs px-3 py-1.5 rounded-full shadow-sm">
          <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>{user.points.toLocaleString()}P</span>
        </div>
      </div>
    </header>
  );
};
