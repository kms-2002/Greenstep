import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Leaf, GraduationCap, UserCheck, Sparkles, X, Building } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, user, login } = useApp();
  const [isSignup, setIsSignup] = useState(true);

  const [nickname, setNickname] = useState(user.nickname || '지구지키미');
  const [university, setUniversity] = useState(user.university || '경상국립대학교');
  const [department, setDepartment] = useState(user.department || '경영정보학과');
  const [grade, setGrade] = useState(user.grade || '3학년');

  // GNU Business College 5 Departments
  const gnuDepartments = [
    '경영학부',
    '경영정보학과',
    '회계세무학부',
    '국제통상학과',
    '스마트유통물류학과',
  ];

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      alert('닉네임을 입력해 주세요.');
      return;
    }
    login(nickname, university, department, grade);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col relative animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100/80 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Banner */}
        <div className="bg-gradient-to-br from-emerald-800 via-teal-800 to-slate-900 text-white p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="w-14 h-14 bg-gradient-to-tr from-emerald-400 to-teal-200 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-3">
            <Leaf className="w-8 h-8 text-emerald-950 stroke-[2.5]" />
          </div>

          <div className="inline-flex items-center space-x-1 bg-emerald-700/60 border border-emerald-500/40 px-2.5 py-0.5 rounded-full mb-1">
            <span className="text-[10px] font-bold text-emerald-200">GNU 경영대학</span>
          </div>

          <h2 className="text-2xl font-black tracking-tight font-sans">
            Green<span className="text-emerald-400">Step</span>
          </h2>
          <p className="text-emerald-200 text-xs mt-1 font-medium">
            "작은 실천이 만드는 큰 변화"
          </p>
        </div>

        {/* Auth Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-2">
            <button
              type="button"
              onClick={() => setIsSignup(true)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                isSignup
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              회원가입
            </button>
            <button
              type="button"
              onClick={() => setIsSignup(false)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                !isSignup
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              로그인
            </button>
          </div>

          {/* Nickname Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              닉네임
            </label>
            <input
              type="text"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="예: 지구지키미"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
            />
          </div>

          {/* University Select */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              대학교
            </label>
            <select
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
            >
              <option value="경상국립대학교">경상국립대학교 (GNU)</option>
              <option value="서울대학교">서울대학교</option>
              <option value="연세대학교">연세대학교</option>
              <option value="고려대학교">고려대학교</option>
            </select>
          </div>

          {/* Department (GNU Business College 5 Major Options) & Grade */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-emerald-600" />
                경영대학 학과
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all truncate"
              >
                {gnuDepartments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">학년</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
              >
                <option value="1학년">1학년</option>
                <option value="2학년">2학년</option>
                <option value="3학년">3학년</option>
                <option value="4학년">4학년</option>
                <option value="대학원생">대학원생</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSignup ? '경상국립대 GreenStep 시작하기' : '로그인'}</span>
            </button>
          </div>

          <p className="text-[11px] text-center text-slate-400 font-light">
            경영대학 5개 학과(경영학부, 경영정보학과, 회계세무학부, 국제통상학과, 스마트유통물류학과) 랭킹에 자동 등록됩니다.
          </p>
        </form>
      </div>
    </div>
  );
};
