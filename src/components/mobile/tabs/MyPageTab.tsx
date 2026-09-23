import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Avatar } from '../../common/Avatar';
import { CUTE_AVATARS } from '../../../types';
import {
  Award,
  Bell,
  ChevronRight,
  FileText,
  GraduationCap,
  LogOut,
  RefreshCw,
  Settings,
  Shield,
  Target,
  Zap,
  Smile,
  X,
} from 'lucide-react';

export const MyPageTab: React.FC = () => {
  const { user, badges, logout, updateProfile, resetAllData } = useApp();
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const unlockedCount = badges.filter((b) => b.unlockedAt).length;

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
            <Avatar avatarId={user.profileAvatarId || 'avatar-jinu'} size="xl" className="ring-2 ring-emerald-400" />
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
                {user.university} {user.department} ({user.grade})
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
          {badges.map((b) => (
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

      {/* Main Settings & Info Menu List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-100">
        <button
          onClick={() => setShowAvatarPicker(true)}
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
          onClick={() => alert('매일 오전 9시 챌린지 리마인더 알림이 활성화되어 있습니다.')}
          className="w-full p-3.5 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-between transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Bell className="w-4 h-4 text-slate-500" />
            <span>알림 설정</span>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
            ON
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
          onClick={() => alert('개인정보처리방침 - 학과 및 닉네임 데이터 보호 정책 안내')}
          className="w-full p-3.5 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-between transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Shield className="w-4 h-4 text-slate-500" />
            <span>개인정보처리방침</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Account System Options: Reset & Logout */}
      <div className="space-y-2 pt-2">
        <button
          onClick={() => {
            if (confirm('샘플 데모 데이터를 처음 상태로 초기화할까요?')) {
              resetAllData();
            }
          }}
          className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-2xl flex items-center justify-center space-x-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>데모 데이터 초기화</span>
        </button>

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

            <div className="space-y-3">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className={`p-3.5 rounded-2xl border flex items-center space-x-3 ${
                    b.unlockedAt
                      ? 'bg-emerald-50/80 border-emerald-200'
                      : 'bg-slate-50 border-slate-200 opacity-50'
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
                const isSelected = (user.profileAvatarId || 'avatar-jinu') === av.id;
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
