import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/mobile/Header';
import { BottomNav } from './components/mobile/BottomNav';
import { AuthModal } from './components/mobile/AuthModal';
import { VerificationModal } from './components/mobile/VerificationModal';
import { SuccessModal } from './components/mobile/SuccessModal';
import { ChallengeDetailModal } from './components/mobile/ChallengeDetailModal';
import { LandingScreen } from './components/mobile/LandingScreen';
import { HomeTab } from './components/mobile/tabs/HomeTab';
import { ChallengeTab } from './components/mobile/tabs/ChallengeTab';
import { RankingTab } from './components/mobile/tabs/RankingTab';
import { BoardTab } from './components/mobile/tabs/BoardTab';
import { ActivityTab } from './components/mobile/tabs/ActivityTab';
import { MyPageTab } from './components/mobile/tabs/MyPageTab';
import { Wifi, Battery } from 'lucide-react';

const MainContent: React.FC = () => {
  const { isAuthenticated, activeTab } = useApp();

  return (
    <div className="min-h-screen bg-slate-100/90 flex flex-col items-center justify-center p-0 sm:p-6 font-sans antialiased text-slate-900 select-none">
      {/* ALIO Style Phone Stage Wrapper */}
      <div className="relative w-full max-w-[395px] flex flex-col items-center">
        
        {/* Sleek iPhone Hardware Side Buttons (ALIO Style) */}
        <div className="hidden sm:block absolute left-[-4px] top-28 w-[4px] h-10 bg-slate-300 rounded-l-md border-r border-slate-400/40 shadow-xs pointer-events-none" />
        <div className="hidden sm:block absolute left-[-4px] top-42 w-[4px] h-10 bg-slate-300 rounded-l-md border-r border-slate-400/40 shadow-xs pointer-events-none" />
        <div className="hidden sm:block absolute right-[-4px] top-32 w-[4px] h-14 bg-slate-300 rounded-r-md border-l border-slate-400/40 shadow-xs pointer-events-none" />

        {/* ALIO Style Ultra-Slim iPhone Chassis Frame */}
        <div className="w-full h-screen sm:h-[830px] bg-white sm:rounded-[50px] border-0 sm:border border-slate-200/90 sm:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.14)] relative overflow-hidden flex flex-col sm:ring-1 sm:ring-slate-900/5">
          
          {/* Phone Top Status Bar (9:41, Dynamic Island Notch, Wifi, Battery) */}
          <div className="w-full bg-white px-7 pt-3 pb-1.5 flex items-center justify-between z-40 shrink-0 select-none border-b border-slate-50">
            <span className="font-bold text-xs tracking-tight text-slate-900 font-mono">9:41</span>
            
            {/* Dynamic Island Pill Notch */}
            <div className="w-24 h-5 bg-slate-950 rounded-full flex items-center justify-end px-2 space-x-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500/90 animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-950" />
            </div>

            <div className="flex items-center space-x-1 text-slate-900">
              <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />
              <Battery className="w-4 h-4 stroke-[2.2] fill-slate-900" />
            </div>
          </div>

          {/* Dynamic App Content Body */}
          <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-50">
            {!isAuthenticated ? (
              <LandingScreen />
            ) : (
              <>
                {/* Mobile Header Bar */}
                <Header />

                {/* Scrollable Tab Content Body */}
                <main className="flex-1 overflow-y-auto bg-slate-50">
                  {activeTab === 'home' && <HomeTab />}
                  {activeTab === 'challenge' && <ChallengeTab />}
                  {activeTab === 'ranking' && <RankingTab />}
                  {activeTab === 'board' && <BoardTab />}
                  {activeTab === 'activity' && <ActivityTab />}
                  {activeTab === 'my' && <MyPageTab />}
                </main>

                {/* Bottom Fixed Navigation Bar */}
                <BottomNav />
              </>
            )}
          </div>

          {/* Bottom iPhone Home Indicator Bar */}
          <div className="w-full bg-white py-1.5 flex justify-center shrink-0 border-t border-slate-50 z-40">
            <div className="w-32 h-1 bg-slate-900/80 rounded-full" />
          </div>

          {/* Global Modals */}
          <AuthModal />
          <VerificationModal />
          <SuccessModal />
          <ChallengeDetailModal />
        </div>
      </div>

      {/* Desktop Note Footer (ALIO Style) */}
      <p className="hidden sm:block text-xs font-semibold text-slate-400 mt-4 tracking-tight">
        GreenStep 모바일 프로토타입 · 화면을 직접 눌러보세요
      </p>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;
