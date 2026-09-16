import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { supabaseAuth } from '../../lib/supabase';
import { Leaf, GraduationCap, UserCheck, Sparkles, X, Building, Lock, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authInitialTab, login } = useApp();

  const [isSignup, setIsSignup] = useState<boolean>(true);

  // Form Fields
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [university, setUniversity] = useState('경상국립대학교');
  const [department, setDepartment] = useState('경영정보학과');
  const [grade, setGrade] = useState('3학년');

  // Error / Success Feedback State
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Synchronize tab mode when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setIsSignup(authInitialTab === 'signup');
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [isAuthModalOpen, authInitialTab]);

  // GNU Business College 5 Departments
  const gnuDepartments = [
    '경영학부',
    '경영정보학과',
    '회계세무학부',
    '국제통상학과',
    '스마트유통물류학과',
  ];

  if (!isAuthModalOpen) return null;

  const handleQuickDemoFill = () => {
    setStudentId('20230101');
    setPassword('1234');
    setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (isSignup) {
      // 1. 회원가입 처리 (Supabase DB 저장)
      if (!studentId.trim()) {
        setErrorMessage('학번을 입력해 주세요.');
        return;
      }
      if (!password.trim()) {
        setErrorMessage('비밀번호를 입력해 주세요.');
        return;
      }
      if (password !== passwordConfirm) {
        setErrorMessage('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
        return;
      }
      if (!nickname.trim()) {
        setErrorMessage('닉네임을 입력해 주세요.');
        return;
      }

      // Supabase Auth DB 저장
      const res = supabaseAuth.signUp({
        studentId: studentId.trim(),
        password,
        nickname: nickname.trim(),
        university,
        department,
        grade,
      });

      if (!res.success) {
        setErrorMessage(res.message);
        return;
      }

      setSuccessMessage('Supabase DB에 회원가입 정보가 기록되었습니다!');
      setTimeout(() => {
        login(nickname.trim(), university, department, grade, studentId.trim());
      }, 700);

    } else {
      // 2. 로그인 처리 (Supabase DB 검증)
      if (!studentId.trim()) {
        setErrorMessage('학번을 입력해 주세요.');
        return;
      }
      if (!password.trim()) {
        setErrorMessage('비밀번호를 입력해 주세요.');
        return;
      }

      const res = supabaseAuth.signIn(studentId.trim(), password);

      if (!res.success) {
        setErrorMessage(res.message);
        return;
      }

      const registeredUser = res.user;
      if (registeredUser) {
        setSuccessMessage('Supabase DB 인증 성공! 로그인합니다.');
        setTimeout(() => {
          login(
            registeredUser.nickname,
            registeredUser.university,
            registeredUser.department,
            registeredUser.grade,
            registeredUser.studentId
          );
        }, 500);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col relative animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100/80 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
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
            <span className="text-[10px] font-bold text-emerald-200">GNU 경영대학 & Supabase Auth</span>
          </div>

          <h2 className="text-2xl font-black tracking-tight font-sans">
            Green<span className="text-emerald-400">Step</span>
          </h2>
          <p className="text-emerald-200 text-xs mt-1 font-medium">
            "학번 및 비밀번호 기반 학생 인증 시스템"
          </p>
        </div>

        {/* Auth Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 max-h-[75vh] overflow-y-auto">
          {/* Tab Selector */}
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-2">
            <button
              type="button"
              onClick={() => {
                setIsSignup(false);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                !isSignup
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              로그인
            </button>

            <button
              type="button"
              onClick={() => {
                setIsSignup(true);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                isSignup
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              회원가입
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-rose-700 text-xs font-bold animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-700 text-xs font-bold animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 1. Student ID (학번) Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              학번 (Student ID)
            </label>
            <input
              type="text"
              required
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="예: 2024101234"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
            />
          </div>

          {/* 2. Password (비밀번호) Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
              비밀번호
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
            />
          </div>

          {/* Signup Specific Fields */}
          {isSignup && (
            <>
              {/* Password Confirm */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  required
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="비밀번호를 한번 더 입력하세요"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                />
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
                </select>
              </div>

              {/* Department & Grade */}
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
            </>
          )}

          {/* Quick Demo button for Login */}
          {!isSignup && (
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>테스트용 데모 계정 자동 입력 (학번: 20230101 / 암호: 1234)</span>
            </button>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSignup ? 'Supabase DB 회원가입 및 시작하기' : '학번 로그인'}</span>
            </button>
          </div>

          <p className="text-[11px] text-center text-slate-400 font-light">
            {isSignup
              ? '회원가입 시 Supabase 데이터베이스 사용자 테이블에 정보가 영구 등록됩니다.'
              : '등록한 학번과 직접 설정한 비밀번호로 로그인할 수 있습니다.'}
          </p>
        </form>
      </div>
    </div>
  );
};
