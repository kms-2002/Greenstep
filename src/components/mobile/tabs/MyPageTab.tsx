import { rpc } from '../../../lib/backend';
import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Avatar } from '../../common/Avatar';
import { CUTE_AVATARS } from '../../../types';
import { FriendsPanel } from './FriendsPanel';
import {
  Award,
  Bell,
  ChevronRight,
  FileText,
  GraduationCap,
  LogOut,
  Settings,
  Shield,
  Target,
  Zap,
  Smile,
  X,
} from 'lucide-react';

export const MyPageTab: React.FC = () => {
  const { user, badges, logout, updateProfile, refreshAccount, refreshMembers, attendance, setIsAttendanceOpen, setIsNotificationOpen, inbox } = useApp();
  const [editing,setEditing]=useState(false);
  const [draft,setDraft]=useState(user);
  const [profileError,setProfileError]=useState('');
  const [saving,setSaving]=useState(false);
  const [profileMessage,setProfileMessage]=useState('');
  const [badgeFilter,setBadgeFilter]=useState<'all'|'earned'|'locked'>('all');
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const unlockedCount = badges.filter((b) => b.unlockedAt).length;

  const visibleBadges=badges.filter(b=>badgeFilter==='all'||(badgeFilter==='earned'?!!b.unlockedAt:!b.unlockedAt));
  const nextBadge=badges.filter(b=>!b.unlockedAt).sort((a,b)=>(b.progress/b.requirementValue)-(a.progress/a.requirementValue))[0];

  return (
    <div className="p-4 space-y-4 pb-24 animate-fadeIn">
      {/* Profile Card Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-5 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex items-center space-x-4">
          {/* Avatar Icon with Edit Button */}
          <div
            onClick={() => setShowAvatarPicker(true)}
            className="relative cursor-pointer group"
            title="프로필 아이콘 변경"
          >
            <Avatar avatarId={user.profileAvatarId || 'avatar-hamo'} size="xl" className="ring-2 ring-emerald-400" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border border-white text-white text-[10px] shadow-sm">
              ✏️
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-black tracking-tight text-white truncate">
                {user.nickname}
              </h2>
              <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full shrink-0">
                Lv.{user.level}
              </span>
            </div>

            <p className="text-xs text-emerald-200 mt-0.5 flex items-center gap-1 truncate">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>
                {user.memberType === 'citizen' ? '진주시민' : [user.university, user.college, user.department].filter(Boolean).join(' · ')}{user.memberType !== 'citizen' && ` (${user.grade})`}
              </span>
            </p>

            <div className="flex items-center space-x-3 mt-2 text-xs font-mono font-bold">
              <span className="text-amber-300 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-amber-400" />
                {user.points.toLocaleString()}P
              </span>
              <span className="text-emerald-300">
                절감 {user.totalCarbonReduction.toFixed(1)}kg CO₂e
              </span>
            </div>
          </div>
        </div>
      </div>

      <button onClick={()=>setIsAttendanceOpen(true)} className="w-full flex justify-between items-center rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-left">
        <span><span className="text-sm font-extrabold text-emerald-900">📅 매일 출석 체크</span><span className="block text-xs text-emerald-700 mt-1">누적 {attendance.days.length}일 · 출석 배지를 모아보세요</span></span>
        <span className="text-xs font-bold text-emerald-700">{attendance.days.includes(attendance.today)?'완료 ✓':'출석하기 →'}</span>
      </button>
      {/* Badges Overview Grid Section */}
      <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>획득 배지 ({unlockedCount}/{badges.length})</span>
          </h3>

          <button
            onClick={() => setShowBadgeModal(true)}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center"
          >
            <span>전체보기</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {[...badges].sort((a,b)=>Number(!!b.unlockedAt)-Number(!!a.unlockedAt)).slice(0,10).map((b) => (
            <div
              key={b.id}
              onClick={() => setShowBadgeModal(true)}
              className={`p-2 rounded-xl text-center border cursor-pointer transition-all ${
                b.unlockedAt
                  ? 'bg-emerald-50/80 border-emerald-200 hover:scale-105'
                  : 'bg-slate-50 border-slate-100 opacity-40 grayscale'
              }`}
              title={b.name}
            >
              <span className="text-2xl block">{b.icon}</span>
              <span className="text-[10px] font-bold text-slate-700 truncate block mt-0.5">
                {b.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {nextBadge && <button onClick={()=>setShowBadgeModal(true)} className="w-full rounded-2xl bg-amber-50 border border-amber-100 p-4 text-left">
        <span className="text-xs text-amber-800 font-bold">다음으로 도전할 배지</span>
        <span className="block font-bold text-sm mt-1">{nextBadge.icon} {nextBadge.name} <span className="text-xs font-normal">{nextBadge.progress}/{nextBadge.requirementValue}</span></span>
        <span className="block text-xs text-slate-600 mt-1">{nextBadge.description}</span>
      </button>}
      <FriendsPanel user={user} />

      {editing && <form className="rounded-2xl border bg-white p-4 space-y-3" onSubmit={async e=>{e.preventDefault();if(saving)return;setSaving(true);setProfileError('');try{await rpc('gs_update_profile',{p:draft});await refreshAccount();await refreshMembers();setEditing(false);}catch(error){setProfileError((error as Error).message);}finally{setSaving(false);}}}>
        <h3 className="font-bold text-sm">프로필과 소속 정보</h3>
        <label className="block text-xs">회원 구분<select value={draft.memberType} onChange={e=>setDraft({...draft,memberType:e.target.value as 'student'|'citizen'})} className="ml-2 border rounded p-2"><option value="student">대학생</option><option value="citizen">진주시민</option></select></label>
        {(['nickname','university','college','department','grade','studentId'] as const).map((key,i)=><label key={key} className="block text-xs">{['닉네임','학교','단과대학','학과','학년','학번 (비공개)'][i]}<input required={key==='nickname'} maxLength={key==='nickname'?40:120} value={draft[key]??''} onChange={e=>setDraft({...draft,[key]:e.target.value})} className="mt-1 block w-full rounded-xl border p-2" /></label>)}
        {profileError&&<p role="alert" className="text-xs text-red-700">{profileError}</p>}
        <button disabled={saving} className="rounded-xl bg-emerald-700 px-4 py-2 text-white text-xs">{saving?'저장 중...':'저장'}</button><button type="button" className="ml-4 text-xs" onClick={()=>setEditing(false)}>닫기</button>
      </form>}
      {/* Main Settings & Info Menu List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-100">
        <button
          onClick={() => {setDraft(user);setEditing(true);}}
          className="w-full p-3.5 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-between transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Settings className="w-4 h-4 text-slate-500" />
            <span>프로필 및 소속 정보 수정</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => alert('나의 월간 탄소 절감 목표: 50kg CO₂e (설정 완료)')}
          className="w-full p-3.5 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-between transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Target className="w-4 h-4 text-slate-500" />
            <span>나의 챌린지 목표 설정</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => setIsNotificationOpen(true)}
          className="w-full p-3.5 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-between transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Bell className="w-4 h-4 text-slate-500" />
            <span>활동 알림함</span>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
            {inbox.unread>0?`${inbox.unread}개`:'새 알림 없음'}
          </span>
        </button>

        <button
          onClick={() => alert('GreenStep 이용약관 v1.0 - 대학생 친환경 탄소절감 플랫폼 서비스 규정')}
          className="w-full p-3.5 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-between transition-colors"
        >
          <div className="flex items-center space-x-3">
            <FileText className="w-4 h-4 text-slate-500" />
            <span>이용약관</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => setProfileMessage('이메일·학번·인증 사진은 본인만 조회합니다. 닉네임·학교·포인트·감축 합계는 친구 찾기에 표시됩니다. 상세 챌린지 기록은 공개 설정을 켰을 때 친구에게만 보입니다. 공개한 활동의 위치는 행정동·통합권역 단위로 지도 집계에 포함됩니다. 데이터는 Supabase에 저장됩니다.')}
          className="w-full p-3.5 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-between transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Shield className="w-4 h-4 text-slate-500" />
            <span>개인정보처리방침</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {profileMessage && <p className="rounded-xl bg-slate-100 p-3 text-xs leading-relaxed">{profileMessage}</p>}
      {/* Account System Options: Reset & Logout */}
      <div className="space-y-2 pt-2">
        <button
          onClick={logout}
          className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-2xl flex items-center justify-center space-x-1.5 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>로그아웃</span>
        </button>
      </div>

      {/* Full Badge Grid Modal */}
      {showBadgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl relative max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-base text-slate-800 flex items-center gap-1.5">
                <Award className="w-5 h-5 text-emerald-600" />
                <span>나의 배지 컬렉션 ({unlockedCount}/{badges.length})</span>
              </h3>
              <button
                onClick={() => setShowBadgeModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                닫기
              </button>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-3">
              <p className="text-xs font-bold text-emerald-900">나의 초록 발자취 · {Math.round(unlockedCount/badges.length*100)}% 수집</p>
              <div className="h-2 mt-2 rounded-full bg-emerald-100 overflow-hidden"><div className="h-full bg-emerald-500" style={{width:`${unlockedCount/badges.length*100}%`}}/></div>
            </div>
            <div className="flex gap-2">{(['all','earned','locked'] as const).map((filter,i)=><button key={filter} aria-pressed={badgeFilter===filter} onClick={()=>setBadgeFilter(filter)} className={`flex-1 rounded-full py-2 text-xs font-bold ${badgeFilter===filter?'bg-emerald-700 text-white':'bg-slate-100 text-slate-600'}`}>{['전체','획득','도전 중'][i]}</button>)}</div>
            {visibleBadges.length===0&&<p className="text-sm text-center text-slate-500 py-6">첫 출석으로 첫 번째 배지를 획득해보세요!</p>}
            <div className="space-y-3">
              {visibleBadges.map((b) => (
                <div
                  key={b.id}
                  className={`p-3.5 rounded-2xl border flex items-center space-x-3 ${
                    b.unlockedAt
                      ? 'bg-emerald-50/80 border-emerald-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className="text-3xl shrink-0">{b.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-slate-800">{b.name}</span>
                      {b.unlockedAt && (
                        <span className="text-[9px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded">
                          획득함 ({b.unlockedAt})
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{b.description}</p>
                    {!b.unlockedAt&&<><div className="mt-2 flex justify-between text-[10px] text-slate-500"><span>도전 중</span><span>{Number(b.progress.toFixed(1))} / {b.requirementValue}</span></div><div role="progressbar" aria-label={b.name} aria-valuenow={b.progress} aria-valuemin={0} aria-valuemax={b.requirementValue} className="mt-1 h-1.5 rounded-full bg-slate-200 overflow-hidden"><div className="h-full bg-emerald-500" style={{width:`${b.progress/b.requirementValue*100}%`}}/></div></>}

                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Avatar Picker Modal */}
      {showAvatarPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-slate-100 p-5 space-y-4 animate-scaleUp relative">
            <button
              onClick={() => setShowAvatarPicker(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-emerald-600 font-extrabold">
              <Smile className="w-5 h-5" />
              <h3 className="text-base text-slate-900">프로필 캐릭터 아이콘 변경 (5종)</h3>
            </div>
            <p className="text-xs text-slate-500">원하시는 귀여운 친환경 캐릭터 아이콘을 선택해주세요.</p>

            <div className="grid grid-cols-5 gap-2 pt-1">
              {CUTE_AVATARS.map((av) => {
                const isSelected = (user.profileAvatarId || 'avatar-hamo') === av.id;
                return (
                  <button
                    key={av.id}
                    onClick={() => {
                      updateProfile({ profileAvatarId: av.id });
                      setShowAvatarPicker(false);
                    }}
                    className={`p-2 rounded-2xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/30 shadow-xs scale-105'
                        : 'bg-slate-50 border-slate-200 opacity-70 hover:opacity-100 hover:bg-white'
                    }`}
                  >
                    <Avatar avatarId={av.id} size="md" />
                    <span className="text-[9px] font-bold text-slate-700 mt-1 truncate w-full text-center">
                      {av.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowAvatarPicker(false)}
              className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              완료
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
