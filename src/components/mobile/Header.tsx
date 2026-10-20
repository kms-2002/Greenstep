import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Zap, RotateCcw } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, setActiveTab, logout, inbox, setIsNotificationOpen } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-3.5 py-2.5 border-b border-slate-100 shadow-xs">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* Left: Brand Logo & Dropdown Badge */}
        <div className="flex items-center space-x-1.5">
          <div className="flex items-center space-x-0.5 font-bold text-lg text-slate-900 tracking-tight font-sans">
            <span className="text-slate-900">Green</span>
            <span className="text-emerald-600 font-extrabold">step</span>
          </div>


        </div>

        {/* Right Actions: Image 1 Style [ ↻ 처음으로 ] Pill Button + Points + Menu */}
        <div className="flex items-center space-x-1.5">
          {/* Image 1 Reference Pill Button: "처음으로" */}
          <button
            onClick={logout}
            className="px-2.5 py-1 bg-white border border-slate-200/90 rounded-full shadow-xs flex items-center space-x-1 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer active:scale-95"
            title="처음 시작화면으로 이동"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>처음으로</span>
          </button>

          {/* Quick Points badge */}
          <div
            onClick={() => setActiveTab('my')}
            className="flex items-center space-x-1 bg-amber-50 border border-amber-200 text-amber-700 font-bold text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-amber-100 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>{user.points.toLocaleString()}P</span>
          </div>

          {/* Bell Icon */}
          <button
            onClick={() => setIsNotificationOpen(true)}
            aria-label={`알림${inbox.unread ? `, 읽지 않은 알림 ${inbox.unread}개` : ''}`}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors relative cursor-pointer"
          >
            <Bell className="w-4.5 h-4.5" />
            {inbox.unread>0&&<span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />}
          </button>
        </div>
      </div>
    </header>
  );
};
