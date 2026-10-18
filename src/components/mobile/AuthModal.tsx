import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { backend, rpc } from '../../lib/backend';
import { GoogleLoginButton } from './GoogleLoginButton';
import { CUTE_AVATARS } from '../../types';
import { JINJU_UNIVERSITY_CATALOG, JINJU_UNIVERSITY_NAMES } from '../../data/jinjuUniversityCatalog';
import { Leaf, GraduationCap, UserCheck, Sparkles, X, Building, KeyRound, CheckCircle2, AlertCircle, RotateCcw, Smile } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authInitialTab, needsProfile, refreshAccount, refreshMembers, logout, user } = useApp();

  const [isSignup, setIsSignup] = useState<boolean>(true);

  // Form Fields
  const [email,setEmail]=useState('');
  const [busy,setBusy]=useState(false);
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [memberType, setMemberType] = useState<'student' | 'citizen'>('student');
  const [university, setUniversity] = useState('경상국립대학교');
  const [customUniversity, setCustomUniversity] = useState('');
  const [college, setCollege] = useState('경영대학');
  const [customCollege, setCustomCollege] = useState('');
  const [department, setDepartment] = useState('경영정보학과');
  const [customDepartment, setCustomDepartment] = useState('');
  const [grade, setGrade] = useState('3학년');
  const [selectedAvatarId, setSelectedAvatarId] = useState('avatar-hamo');

  // Error / Success Feedback State
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Synchronize tab mode when modal opens
  useEffect(() => {
    if (isAuthModalOpen || needsProfile) {
      setIsSignup(needsProfile || authInitialTab === 'signup');
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [isAuthModalOpen, authInitialTab, needsProfile]);

  useEffect(()=>{
    if(!needsProfile)return;
    setNickname(user.nickname==='그린스텝 회원'?'':user.nickname);
    setMemberType(user.memberType || 'student');
    setStudentId(user.studentId || '');
    setSelectedAvatarId(user.profileAvatarId || 'avatar-hamo');
    setPassword('');setPasswordConfirm('');
  },[needsProfile,user.id]);

  const DIRECT_INPUT = '__direct_input__';
  const universityName = university === DIRECT_INPUT ? customUniversity.trim() : university;
  const collegeOptions = Object.keys(JINJU_UNIVERSITY_CATALOG[universityName] || {});
  const collegeName = college === DIRECT_INPUT ? customCollege.trim() : college;
  const departmentOptions = JINJU_UNIVERSITY_CATALOG[universityName]?.[college] || [];
  const departmentName = department === DIRECT_INPUT ? customDepartment.trim() : department;

  if (!isAuthModalOpen && !needsProfile) return null;
  const signupMode=isSignup || needsProfile;
  const close=()=>{if(needsProfile)logout();else setIsAuthModalOpen(false);};

  const handleSubmit=async(e:React.FormEvent)=>{
    e.preventDefault();if(busy)return;
    setErrorMessage('');setSuccessMessage('');
    if(signupMode && ((!needsProfile && password!==passwordConfirm) || !nickname.trim() || (memberType==='student' && (!studentId.trim() || !universityName || !collegeName || !departmentName)))){
      setErrorMessage(needsProfile?'닉네임과 회원 정보를 모두 입력해주세요.':'비밀번호 확인과 회원 정보를 모두 입력해주세요.');return;
    }
    setBusy(true);
    try{
      if(needsProfile){
        await rpc('gs_update_profile',{p:{nickname:nickname.trim(),memberType,
          studentId:memberType==='student'?studentId.trim():'',
          university:memberType==='student'?universityName:'진주시민',
          college:memberType==='student'?collegeName:'',department:memberType==='student'?departmentName:'',
          grade:memberType==='student'?grade:'시민',profileAvatarId:selectedAvatarId}});
        await refreshAccount();await refreshMembers();setIsAuthModalOpen(false);
      }else if(isSignup){
        const {data,error}=await backend.auth.signUp({email:email.trim(),password,options:{
          emailRedirectTo:location.origin+import.meta.env.BASE_URL,
          data:{studentId:memberType==='student'?studentId.trim():'',nickname:nickname.trim(),memberType,
            university:memberType==='citizen'?'진주시민':universityName,college:memberType==='citizen'?'':collegeName,
            department:memberType==='citizen'?'':departmentName,grade:memberType==='citizen'?'시민':grade,profileAvatarId:selectedAvatarId}
        }});
        if(error)throw error;
        if(!data.session)throw new Error('즉시 가입이 완료되지 않았습니다. 서버의 이메일 인증 설정을 확인하거나, 이미 가입한 계정이라면 로그인해주세요.');
        setSuccessMessage('계정 정보를 불러오고 있어요.');
      }else{
        const {error}=await backend.auth.signInWithPassword({email:email.trim(),password});
        if(error)throw error;
        setSuccessMessage('계정 정보를 불러오고 있어요.');
      }
    }catch(error){setErrorMessage(error instanceof Error?error.message:'계정 연결에 실패했습니다.');}
    finally{setBusy(false);}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col relative animate-scaleUp">
        {/* Top Header Buttons: "처음으로" pill on left, X close on right */}
        <div className="absolute top-4 inset-x-4 z-10 flex items-center justify-between pointer-events-none">
          <button
            onClick={close}
            className="pointer-events-auto px-2.5 py-1 bg-white/80 hover:bg-white text-slate-700 rounded-full text-xs font-bold shadow-xs border border-white/60 flex items-center space-x-1 transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
            <span>처음으로</span>
          </button>

          <button
            onClick={close}
            className="pointer-events-auto w-8 h-8 rounded-full bg-slate-900/40 hover:bg-slate-900/60 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Header Banner */}
        <div className="bg-gradient-to-br from-emerald-800 via-teal-800 to-slate-900 text-white p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="w-14 h-14 bg-gradient-to-tr from-emerald-400 to-teal-200 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-3">
            <Leaf className="w-8 h-8 text-emerald-950 stroke-[2.5]" />
          </div>

          <div className="inline-flex items-center space-x-1 bg-emerald-700/60 border border-emerald-500/40 px-2.5 py-0.5 rounded-full mb-1">
            <span className="text-[10px] font-bold text-emerald-200">진주에서 함께하는 녹색생활</span>
          </div>

          <h2 className="text-2xl font-black tracking-tight font-sans">
            Green<span className="text-emerald-400">Step</span>
          </h2>
          <p className="text-emerald-200 text-xs mt-1 font-medium">
            {needsProfile?'로그인 완료! 참여 유형과 프로필을 입력해주세요.':'나의 실천을 기록하는 GreenStep 계정'}
          </p>
        </div>

        {/* Auth Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 max-h-[75vh] overflow-y-auto">
          {/* Tab Selector */}
          {!needsProfile && <GoogleLoginButton />}
          {!needsProfile && <div className="flex bg-slate-100 p-1 rounded-2xl mb-2">
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
          </div>}

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

          {!needsProfile && <label className="block text-xs font-bold text-slate-700">이메일
            <input type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="이메일 주소" className="mt-1 w-full rounded-xl border bg-slate-50 p-3 text-sm" />
          </label>}
          {signupMode && memberType==='student' && <label className="block text-xs font-bold text-slate-700">학번 (본인에게만 표시)
            <input required maxLength={40} value={studentId} onChange={e=>setStudentId(e.target.value)} className="mt-1 w-full rounded-xl border bg-slate-50 p-3 text-sm" />
          </label>}
          {/* 2. Password (비밀번호) Input */}
          {!needsProfile && <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
              비밀번호
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={isSignup ? 8 : undefined} autoComplete={isSignup ? "new-password" : "current-password"} placeholder="비밀번호 (가입 시 8자 이상)"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
            />
          </div>}

          {/* Signup Specific Fields */}
          {signupMode && (
            <>
              {/* 5 Cute Eco Avatar Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Smile className="w-3.5 h-3.5 text-emerald-600" />
                  프로필 캐릭터 아이콘 선택 (5종)
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {CUTE_AVATARS.map((av) => {
                    const isSelected = selectedAvatarId === av.id;
                    return (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setSelectedAvatarId(av.id)}
                        className={`p-2 rounded-2xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/30 shadow-xs scale-105'
                            : 'bg-slate-50 border-slate-200 opacity-70 hover:opacity-100 hover:bg-white'
                        }`}
                        title={av.name}
                      >
                        {av.image ? (
                          <img src={av.image} alt={av.name} className="w-7 h-7 object-contain" />
                        ) : (
                          <span className="text-xl leading-none">{av.icon}</span>
                        )}
                        <span className="text-[9px] font-bold text-slate-700 mt-1 truncate w-full text-center">
                          {av.name.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Password Confirm */}
              {!needsProfile && <div>
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
              </div>}

              {/* Nickname Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  닉네임
                </label>
                <input
                  type="text"
                  required
                  value={nickname} maxLength={40}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="예: 지구지키미"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                />
              </div>

              {/* Member type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                  참여 유형
                </label>
                <select
                  value={memberType}
                  onChange={(e) => setMemberType(e.target.value as 'student' | 'citizen')}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                >
                  <option value="student">진주시 소재 대학 학생</option>
                  <option value="citizen">진주시민</option>
                </select>
              </div>

              {memberType === 'student' && <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-emerald-600" />
                    대학교
                  </label>
                  <select
                    required
                    value={university}
                    onChange={(event) => {
                      const nextUniversity = event.target.value;
                      const nextCollege = Object.keys(JINJU_UNIVERSITY_CATALOG[nextUniversity] || {})[0] || DIRECT_INPUT;
                      setUniversity(nextUniversity);
                      setCollege(nextCollege);
                      setDepartment(JINJU_UNIVERSITY_CATALOG[nextUniversity]?.[nextCollege]?.[0] || DIRECT_INPUT);
                      setCustomUniversity('');
                      setCustomCollege('');
                      setCustomDepartment('');
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium outline-none transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    {JINJU_UNIVERSITY_NAMES.map((school) => <option key={school} value={school}>{school}</option>)}
                    <option value={DIRECT_INPUT}>목록에 없어요 · 직접 입력</option>
                  </select>
                  {university === DIRECT_INPUT && <input required value={customUniversity} onChange={(event) => setCustomUniversity(event.target.value)} placeholder="대학교 이름 입력" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500" />}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">단과대학</label>
                    <select required value={college} onChange={(event) => { const nextCollege = event.target.value; setCollege(nextCollege); setDepartment(JINJU_UNIVERSITY_CATALOG[universityName]?.[nextCollege]?.[0] || DIRECT_INPUT); setCustomDepartment(''); }} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2.5 text-xs font-bold outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500">
                      {collegeOptions.map((name) => <option key={name} value={name}>{name}</option>)}
                      <option value={DIRECT_INPUT}>직접 입력</option>
                    </select>
                    {college === DIRECT_INPUT && <input required value={customCollege} onChange={(event) => setCustomCollege(event.target.value)} placeholder="단과대학 입력" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2.5 text-xs font-bold outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500" />}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">학과·학부</label>
                    <select required value={department} onChange={(event) => setDepartment(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2.5 text-xs font-bold outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500">
                      {departmentOptions.map((name) => <option key={name} value={name}>{name}</option>)}
                      <option value={DIRECT_INPUT}>직접 입력</option>
                    </select>
                    {department === DIRECT_INPUT && <input required value={customDepartment} onChange={(event) => setCustomDepartment(event.target.value)} placeholder="학과·학부 입력" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2.5 text-xs font-bold outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500" />}
                  </div>
                </div>
              </>}

              {/* Grade */}
              {memberType === 'student' && <div className="grid grid-cols-2 gap-3">
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
                <div className="flex items-end text-[10px] leading-relaxed text-slate-400">학교·단과대학·학과 목록에 없으면 직접 입력할 수 있어요.</div>
              </div>}
              {memberType === 'citizen' && <p className="rounded-xl bg-emerald-50 px-3 py-2 text-[10px] leading-relaxed text-emerald-800">진주시민으로 가입합니다. 별도의 거주 인증은 진행하지 않습니다.</p>}
            </>
          )}

          <div className="pt-2">
            <button
              type="submit" disabled={busy}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{busy ? '연결 중...' : needsProfile ? '가입 완료하고 시작하기' : isSignup ? '회원가입' : '이메일 로그인'}</span>
            </button>
          </div>

          <p className="text-[11px] text-center text-slate-400 font-light">
            {signupMode
              ? '닉네임·학교·활동 합계는 랭킹에 표시됩니다. 상세 활동은 별도로 공개할 수 있어요.'
              : '등록한 이메일과 비밀번호로 로그인할 수 있습니다.'}
          </p>
        </form>
      </div>
    </div>
  );
};
