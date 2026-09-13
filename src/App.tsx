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
import { ActivityTab } from './components/mobile/tabs/ActivityTab';
import { MyPageTab } from './components/mobile/tabs/MyPageTab';
import { Wifi, Battery } from 'lucide-react';

const MainContent: React.FC = () => {
  const { isAuthenticated, activeTab } = useApp();

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center p-0 sm:p-4 font-sans antialiased text-slate-900">
      {/* Smartphone Device Mockup Frame (iPhone style) */}
      <div className="w-full max-w-[400px] h-screen sm:h-[844px] bg-white sm:rounded-[48px] sm:border-[10px] sm:border-slate-800 sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] relative overflow-hidden flex flex-col sm:ring-1 sm:ring-slate-300">
        
        {/* Phone Top Status Bar (9:41, Dynamic Island, Wifi, Battery) */}
        <div className="w-full bg-white px-7 pt-3 pb-1 flex items-center justify-between z-40 shrink-0 select-none border-b border-slate-50">
          <span className="font-extrabold text-xs tracking-tight text-slate-800">9:41</span>
          
          {/* Dynamic Island Notch */}
          <div className="w-24 h-5 bg-slate-950 rounded-full flex items-center justify-end px-2 space-x-1.5 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 animate-pulse" />
            <span className="w-2 h-2 rounded-full bg-indigo-900" />
          </div>

          <div className="flex items-center space-x-1 text-slate-800">
            <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
            <Battery className="w-4 h-4 stroke-[2.5] fill-slate-800" />
          </div>
        </div>

        {/* Dynamic App Content Body - Completely Enclosed Inside Phone Frame */}
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
                {activeTab === 'activity' && <ActivityTab />}
                {activeTab === 'my' && <MyPageTab />}
              </main>

              {/* Bottom Fixed Navigation Bar (Strictly Inside Frame) */}
              <BottomNav />
            </>
          )}
        </div>

        {/* Bottom iPhone Home Indicator Bar */}
        <div className="w-full bg-white py-1.5 flex justify-center shrink-0 border-t border-slate-50 z-40">
          <div className="w-32 h-1 bg-slate-800 rounded-full" />
        </div>

        {/* Global Modals */}
        <AuthModal />
        <VerificationModal />
        <SuccessModal />
        <ChallengeDetailModal />
      </div>
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
