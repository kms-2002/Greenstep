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
    <div className="website-container font-sans antialiased text-slate-900 select-none">
      {/* Phone Mockup Stage */}
      <div className="phone-stage">
        {/* Authentic ALIO iPhone Frame with Titanium Edge & Bezel */}
        <div className="iphone-frame">
          {/* Real Hardware Side Buttons */}
          <span className="side-button side-button--action" aria-hidden="true" />
          <span className="side-button side-button--volume-up" aria-hidden="true" />
          <span className="side-button side-button--volume-down" aria-hidden="true" />
          <span className="side-button side-button--power" aria-hidden="true" />

          {/* iPhone Edge Border Layer */}
          <div className="iphone-edge">
            {/* iPhone Black Bezel Layer */}
            <div className="iphone-bezel">
              {/* iPhone Inner Display Canvas */}
              <div className="iphone-display">
                
                {/* Real Dynamic Island Status Bar */}
                <div className="status-bar">
                  <span className="status-bar-time font-mono">9:41</span>
                  
                  {/* Dynamic Island Pill Notch */}
                  <div className="dynamic-island">
                    <span className="dynamic-island-dot" />
                  </div>

                  {/* Top Right Status Icons */}
                  <div className="status-bar-icons">
                    <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />
                    <Battery className="w-4 h-4 stroke-[2.2] fill-slate-900" />
                  </div>
                </div>

                {/* App Main Screen View */}
                <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-50 pt-[52px]">
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

                {/* Bottom Home Indicator Bar */}
                <div className="w-full bg-white py-1.5 flex justify-center shrink-0 z-40">
                  <div className="w-32 h-1 bg-slate-900/80 rounded-full" />
                </div>

                {/* Global Modals */}
                <AuthModal />
                <VerificationModal />
                <SuccessModal />
                <ChallengeDetailModal />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Note Footer (ALIO Style) */}
      <p className="hidden sm:block text-xs font-semibold text-slate-400 mt-4 tracking-tight">
        ALIO · GreenStep 모바일 프로토타입 · 화면을 직접 눌러보세요
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
