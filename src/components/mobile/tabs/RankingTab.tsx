import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Award, Trophy, Users, Sparkles, Building2, Flame } from 'lucide-react';

export const RankingTab: React.FC = () => {
  const { user, personalRanks, departmentRanks } = useApp();
  const [activeRankTab, setActiveRankTab] = useState<'personal' | 'friends' | 'department'>('personal');

  // Sample Friend Ranks data
  const friendRanks = [
    { rank: 1, nickname: user.nickname, department: user.department, carbonReduction: user.totalCarbonReduction, streak: user.consecutiveDays, isCurrentUser: true },
    { rank: 2, nickname: '박지구', department: '컴퓨터공학과', carbonReduction: 38.2, streak: 8 },
    { rank: 3, nickname: '최에코', department: '경영학과', carbonReduction: 31.4, streak: 6 },
    { rank: 4, nickname: '정클린', department: '경영정보학과', carbonReduction: 29.1, streak: 4 },
  ];

  // Find user rank in personal
  const userRankObj = personalRanks.find((r) => r.isCurrentUser) || {
    rank: 1,
    carbonReduction: user.totalCarbonReduction,
  };

  const userDeptObj = departmentRanks.find((d) => d.department === user.department) || departmentRanks[0];

  return (
    <div className="p-4 space-y-4 pb-24 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-amber-600 via-emerald-800 to-teal-900 text-white p-5 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight flex items-center gap-1.5">
              <span>리더보드 랭킹</span>
              <Trophy className="w-5 h-5 text-amber-300 fill-amber-300" />
            </h2>
            <p className="text-xs text-amber-100/90 mt-0.5">
              친환경 실천으로 개인 및 학과 최고의 그린마스터에 도전하세요!
            </p>
          </div>
        </div>
      </div>

      {/* 3 Tab Switcher: 개인 / 친구 / 학과 */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveRankTab('personal')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
            activeRankTab === 'personal'
              ? 'bg-white text-emerald-700 shadow-sm scale-[1.02]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>개인 랭킹</span>
        </button>

        <button
          onClick={() => setActiveRankTab('friends')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
            activeRankTab === 'friends'
              ? 'bg-white text-emerald-700 shadow-sm scale-[1.02]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>친구 랭킹</span>
        </button>

        <button
          onClick={() => setActiveRankTab('department')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
            activeRankTab === 'department'
              ? 'bg-white text-emerald-700 shadow-sm scale-[1.02]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>학과 랭킹</span>
        </button>
      </div>

      {/* User Current Position Highlight Banner */}
      <div className="p-4 bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl shadow-md border border-emerald-700/60 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center shadow-md">
            {activeRankTab === 'department' ? `${userDeptObj?.rank || 1}위` : `${userRankObj.rank}위`}
          </div>
          <div>
            <span className="text-[11px] text-emerald-200 font-bold block">
              {activeRankTab === 'department' ? '나의 학과 현황' : '나의 현재 순위'}
            </span>
            <span className="font-extrabold text-sm text-white">
              {activeRankTab === 'department' ? user.department : `${user.nickname} (${user.department})`}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono font-black text-amber-300 block">
            {activeRankTab === 'department'
              ? `${userDeptObj?.totalCarbonReduction.toFixed(1)}kg`
              : `${user.totalCarbonReduction.toFixed(1)}kg CO₂e`}
          </span>
          <span className="text-[10px] text-emerald-200 font-light">누적 탄소 절감</span>
        </div>
      </div>

      {/* Top 3 Podium Visualizer (For Personal & Friends tabs) */}
      {activeRankTab !== 'department' && (
        <div className="grid grid-cols-3 gap-2 pt-2 items-end">
          {/* 2nd Place */}
          {personalRanks[1] && (
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center">
              <span className="text-2xl mb-1">🥈</span>
              <span className="font-bold text-xs text-slate-800 truncate w-full">
                {personalRanks[1].nickname}
              </span>
              <span className="text-[10px] text-slate-400 truncate w-full">{personalRanks[1].department}</span>
              <span className="text-xs font-black text-emerald-700 font-mono mt-1">
                {personalRanks[1].carbonReduction.toFixed(1)}kg
              </span>
            </div>
          )}

          {/* 1st Place (Center Big) */}
          {personalRanks[0] && (
            <div className="bg-gradient-to-b from-amber-50 to-amber-100 p-4 rounded-2xl border-2 border-amber-300 shadow-md text-center flex flex-col items-center transform -translate-y-1">
              <Sparkles className="w-4 h-4 text-amber-500 mb-0.5 animate-pulse" />
              <span className="text-3xl mb-1">🥇</span>
              <span className="font-extrabold text-xs text-amber-950 truncate w-full">
                {personalRanks[0].nickname}
              </span>
              <span className="text-[10px] text-amber-800/80 truncate w-full">
                {personalRanks[0].department}
              </span>
              <span className="text-sm font-black text-emerald-800 font-mono mt-1">
                {personalRanks[0].carbonReduction.toFixed(1)}kg
              </span>
            </div>
          )}

          {/* 3rd Place */}
          {personalRanks[2] && (
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center">
              <span className="text-2xl mb-1">🥉</span>
              <span className="font-bold text-xs text-slate-800 truncate w-full">
                {personalRanks[2].nickname}
              </span>
              <span className="text-[10px] text-slate-400 truncate w-full">{personalRanks[2].department}</span>
              <span className="text-xs font-black text-emerald-700 font-mono mt-1">
                {personalRanks[2].carbonReduction.toFixed(1)}kg
              </span>
            </div>
          )}
        </div>
      )}

      {/* Main Ranking List */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-500 px-1">
          {activeRankTab === 'personal' && '전체 학생 누적 랭킹'}
          {activeRankTab === 'friends' && '내 친구 랭킹 목록'}
          {activeRankTab === 'department' && '학과별 누적 탄소절감량 랭킹'}
        </h3>

        {/* Personal Rank List */}
        {activeRankTab === 'personal' &&
          personalRanks.map((item) => (
            <div
              key={item.userId}
              className={`p-3.5 rounded-2xl flex items-center justify-between border transition-all ${
                item.isCurrentUser
                  ? 'bg-emerald-50 border-emerald-300 shadow-sm'
                  : 'bg-white border-slate-100 shadow-xs hover:border-slate-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span
                  className={`w-7 h-7 rounded-xl font-mono font-black text-xs flex items-center justify-center ${
                    item.rank === 1
                      ? 'bg-amber-400 text-slate-950'
                      : item.rank === 2
                      ? 'bg-slate-300 text-slate-900'
                      : item.rank === 3
                      ? 'bg-amber-700 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.rank}
                </span>

                <div className="w-9 h-9 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                  {item.avatarUrl ? (
                    <img src={item.avatarUrl} alt={item.nickname} className="w-full h-full object-cover" />
                  ) : (
                    <span className="flex items-center justify-center h-full text-xs">🌱</span>
                  )}
                </div>

                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-xs text-slate-800">{item.nickname}</span>
                    {item.isCurrentUser && (
                      <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold">
                        나
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">{item.department}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono font-extrabold text-xs text-emerald-700 block">
                  {item.carbonReduction.toFixed(1)}kg CO₂e
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{item.points}P</span>
              </div>
            </div>
          ))}

        {/* Friend Rank List */}
        {activeRankTab === 'friends' &&
          friendRanks.map((item) => (
            <div
              key={item.rank}
              className={`p-3.5 rounded-2xl flex items-center justify-between border ${
                item.isCurrentUser
                  ? 'bg-emerald-50 border-emerald-300'
                  : 'bg-white border-slate-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="font-mono font-bold text-xs text-slate-600 w-6">#{item.rank}</span>
                <div>
                  <span className="font-bold text-xs text-slate-800">{item.nickname}</span>
                  <span className="text-[11px] text-slate-400 block">{item.department}</span>
                </div>
              </div>

              <div className="text-right flex items-center space-x-3">
                <span className="text-xs text-amber-600 font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-500" />
                  {item.streak}일 연속
                </span>
                <span className="font-mono font-extrabold text-xs text-emerald-700">
                  {item.carbonReduction.toFixed(1)}kg
                </span>
              </div>
            </div>
          ))}

        {/* Department Rank List */}
        {activeRankTab === 'department' &&
          departmentRanks.map((dept) => (
            <div
              key={dept.department}
              className={`p-4 rounded-2xl border transition-all ${
                dept.isUserDept
                  ? 'bg-emerald-50/90 border-emerald-300 shadow-sm'
                  : 'bg-white border-slate-100 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span
                    className={`w-7 h-7 rounded-xl font-mono font-black text-xs flex items-center justify-center ${
                      dept.rank === 1
                        ? 'bg-amber-400 text-slate-950'
                        : dept.rank === 2
                        ? 'bg-slate-300 text-slate-900'
                        : dept.rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {dept.rank}
                  </span>

                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-extrabold text-xs text-slate-800">{dept.department}</span>
                      {dept.isUserDept && (
                        <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold">
                          소속 학과
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      참여자 {dept.participantCount}명 • 인당 평균 {dept.avgCarbonReduction}kg
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-extrabold text-sm text-emerald-700 block">
                    {dept.totalCarbonReduction.toFixed(1)}kg
                  </span>
                  <span className="text-[10px] text-slate-400">누적 절감량</span>
                </div>
              </div>

              {/* Progress bar visualizing share */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                  style={{ width: `${Math.min(100, (dept.totalCarbonReduction / 300) * 100)}%` }}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
