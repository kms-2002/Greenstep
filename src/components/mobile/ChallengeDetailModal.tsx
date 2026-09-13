import React from 'react';
import { useApp } from '../../context/AppContext';
import { Camera, CheckCircle2, ShieldCheck, Sparkles, Users, X, Zap } from 'lucide-react';

export const ChallengeDetailModal: React.FC = () => {
  const {
    selectedChallenge,
    setSelectedChallenge,
    participations,
    joinChallenge,
    setIsVerificationOpen,
    setChallengeToVerify,
  } = useApp();

  if (!selectedChallenge) return null;

  const isJoined = participations.some(
    (p) => p.challengeId === selectedChallenge.id && p.status === 'in_progress'
  );
  const isCompleted = participations.some(
    (p) => p.challengeId === selectedChallenge.id && p.status === 'completed'
  );

  const handleJoin = () => {
    joinChallenge(selectedChallenge.id);
  };

  const handleOpenVerify = () => {
    setChallengeToVerify(selectedChallenge);
    setSelectedChallenge(null);
    setIsVerificationOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col relative max-h-[90vh] overflow-y-auto animate-scaleUp">
        {/* Cover Image Header */}
        <div className="relative h-48 w-full bg-slate-200">
          <img
            src={selectedChallenge.imageUrl}
            alt={selectedChallenge.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

          {/* Category Pill */}
          <span className="absolute top-4 left-4 bg-emerald-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-emerald-400/40 flex items-center gap-1">
            <span>{selectedChallenge.categoryIcon}</span>
            <span>{selectedChallenge.categoryName}</span>
          </span>

          <button
            onClick={() => setSelectedChallenge(null)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 className="text-xl font-extrabold tracking-tight">
              {selectedChallenge.categoryIcon} {selectedChallenge.title}
            </h2>
            <p className="text-xs text-slate-200 font-light mt-0.5">
              {selectedChallenge.description}
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Main Info Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-emerald-50/80 rounded-2xl border border-emerald-100 text-center">
            <div className="p-2">
              <span className="block text-[10px] text-emerald-700 font-bold">예상 탄소절감량</span>
              <span className="text-sm font-black text-emerald-900 font-mono">
                {selectedChallenge.carbonReduction.toFixed(1)}kg CO₂e
              </span>
            </div>
            <div className="p-2 border-x border-emerald-200/60">
              <span className="block text-[10px] text-emerald-700 font-bold">획득 포인트</span>
              <span className="text-sm font-black text-amber-600 font-mono flex items-center justify-center gap-0.5">
                <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                +{selectedChallenge.rewardPoints}P
              </span>
            </div>
            <div className="p-2">
              <span className="block text-[10px] text-emerald-700 font-bold">참여자 수</span>
              <span className="text-sm font-black text-slate-800 font-mono flex items-center justify-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                {selectedChallenge.participantsCount}명
              </span>
            </div>
          </div>

          {/* Goal & Verification Specs */}
          <div className="space-y-2.5 text-xs text-slate-700 font-medium">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500 font-bold">실천 목표</span>
              <span className="font-extrabold text-slate-800">{selectedChallenge.unitDescription}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500 font-bold">인증 방법</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <Camera className="w-3.5 h-3.5" />
                {selectedChallenge.verificationMethod}
              </span>
            </div>
          </div>

          {/* Detailed Guide */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              상세 인증 가이드
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedChallenge.detailGuide}
            </p>
          </div>

          {/* Bottom Action Area */}
          <div className="pt-2">
            {!isJoined && !isCompleted && (
              <button
                onClick={handleJoin}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>챌린지 참여하기</span>
              </button>
            )}

            {isJoined && !isCompleted && (
              <div className="space-y-2">
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl text-center">
                  ✅ 챌린지 참여 중입니다! 실천 후 사진을 인증해주세요.
                </div>
                <button
                  onClick={handleOpenVerify}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-amber-500/30 flex items-center justify-center space-x-2 transition-all active:scale-95"
                >
                  <Camera className="w-4 h-4" />
                  <span>실천 인증하기</span>
                </button>
              </div>
            )}

            {isCompleted && (
              <button
                onClick={handleOpenVerify}
                className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-2xl shadow-md flex items-center justify-center space-x-2 transition-all"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>추가 실천 인증하기 (+재인증)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
