import React, { useMemo, useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Avatar } from '../../common/Avatar';
import { Award, Building2, Flame, Trophy, Users } from 'lucide-react';
import { JINJU_UNIVERSITY_NAMES } from '../../../data/jinjuUniversityCatalog';

type RankCategory = 'overall' | 'students' | 'citizens' | 'friends';
type RankingMember = {
  id: string;
  nickname: string;
  university: string;
  college?: string;
  department: string;
  carbonReduction: number;
  points: number;
  streak: number;
  avatarId?: string;
  isCurrentUser?: boolean;
};

const SAMPLE_CITIZENS: RankingMember[] = [
  { id: 'citizen-1', nickname: '남강산책러', university: '진주시민', department: '시민', carbonReduction: 39.6, points: 1080, streak: 12, avatarId: 'avatar-tree' },
  { id: 'citizen-2', nickname: '초록진주', university: '진주시민', department: '시민', carbonReduction: 32.4, points: 920, streak: 8, avatarId: 'avatar-sprout' },
  { id: 'citizen-3', nickname: '텀블러진주', university: '진주시민', department: '시민', carbonReduction: 21.8, points: 640, streak: 5, avatarId: 'avatar-tumbler' },
];

const SAMPLE_FRIENDS: RankingMember[] = [
  { id: 'friend-1', nickname: '박지구', university: '경상국립대학교', department: '경영학부', carbonReduction: 38.2, points: 1120, streak: 8, avatarId: 'avatar-sprout' },
  { id: 'friend-2', nickname: '최에코', university: '경상국립대학교', department: '회계세무학부', carbonReduction: 31.4, points: 890, streak: 6, avatarId: 'avatar-rider' },
  { id: 'friend-3', nickname: '정클린', university: '진주교육대학교', department: '초등교육과', carbonReduction: 29.1, points: 810, streak: 4, avatarId: 'avatar-tree' },
];

const sortByCarbon = (members: RankingMember[]) => [...members].sort((a, b) => b.carbonReduction - a.carbonReduction);

export const RankingTab: React.FC = () => {
  const { user, personalRanks } = useApp();
  const [activeRankTab, setActiveRankTab] = useState<RankCategory>('overall');
  const [selectedUniversity, setSelectedUniversity] = useState(user.memberType === 'citizen' ? JINJU_UNIVERSITY_NAMES[0] : user.university || JINJU_UNIVERSITY_NAMES[0]);

  const currentUser: RankingMember = {
    id: user.id,
    nickname: user.nickname,
    university: user.memberType === 'citizen' ? '진주시민' : user.university,
    college: user.college,
    department: user.memberType === 'citizen' ? '시민' : user.department,
    carbonReduction: user.totalCarbonReduction,
    points: user.points,
    streak: user.consecutiveDays,
    avatarId: user.profileAvatarId,
    isCurrentUser: true,
  };

  const studentMembers = useMemo(() => {
    const samples = personalRanks.filter((rank) => !rank.isCurrentUser).map((rank) => ({
      id: rank.userId,
      nickname: rank.nickname,
      university: rank.university,
      department: rank.department,
      carbonReduction: rank.carbonReduction,
      points: rank.points,
      streak: 0,
      avatarId: rank.avatarUrl,
    }));
    const members = user.memberType === 'citizen' ? samples : [...samples, currentUser];
    return sortByCarbon(members).map((member, index) => ({ ...member, rank: index + 1 }));
  }, [personalRanks, user.memberType, user.id, user.nickname, user.university, user.department, user.college, user.points, user.totalCarbonReduction, user.consecutiveDays, user.profileAvatarId]);

  const citizenMembers = useMemo(() => {
    const members = user.memberType === 'citizen' ? [...SAMPLE_CITIZENS, currentUser] : SAMPLE_CITIZENS;
    return sortByCarbon(members).map((member, index) => ({ ...member, rank: index + 1 }));
  }, [user.memberType, user.id, user.nickname, user.points, user.totalCarbonReduction, user.consecutiveDays, user.profileAvatarId]);

  const friendMembers = useMemo(() => sortByCarbon([currentUser, ...SAMPLE_FRIENDS]).map((member, index) => ({ ...member, rank: index + 1 })), [user.id, user.nickname, user.university, user.department, user.college, user.points, user.totalCarbonReduction, user.consecutiveDays, user.profileAvatarId]);

  const overallMembers = useMemo(() => sortByCarbon([...studentMembers, ...citizenMembers.filter((member) => !member.isCurrentUser)]).map((member, index) => ({ ...member, rank: index + 1 })), [studentMembers, citizenMembers]);
  const visibleMembers = activeRankTab === 'overall' ? overallMembers : activeRankTab === 'students' ? studentMembers.filter((member) => member.university === selectedUniversity) : activeRankTab === 'citizens' ? citizenMembers : friendMembers;
  const myRank = visibleMembers.find((member) => member.isCurrentUser);
  const isSchoolFilter = activeRankTab === 'students';

  const tabs: { id: RankCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'overall', label: '전체', icon: <Trophy className="h-3.5 w-3.5" /> },
    { id: 'students', label: '대학생', icon: <Building2 className="h-3.5 w-3.5" /> },
    { id: 'citizens', label: '진주시민', icon: <Users className="h-3.5 w-3.5" /> },
    { id: 'friends', label: '친구', icon: <Award className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="space-y-4 p-4 pb-24 animate-fadeIn">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-emerald-800 to-teal-900 p-5 text-white shadow-lg">
        <h2 className="flex items-center gap-1.5 text-xl font-black tracking-tight">진주 그린 랭킹 <Trophy className="h-5 w-5 fill-amber-300 text-amber-300" /></h2>
        <p className="mt-1 text-xs text-amber-100/90">진주시 전체에서 나의 친환경 실천 순위를 확인해요.</p>
      </div>

      <div className="grid grid-cols-4 gap-1 rounded-2xl bg-slate-100 p-1.5">
        {tabs.map((tab) => <button key={tab.id} onClick={() => setActiveRankTab(tab.id)} className={`flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-[10px] font-bold transition-all ${activeRankTab === tab.id ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'}`}>{tab.icon}<span>{tab.label}</span></button>)}
      </div>

      {isSchoolFilter && <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3.5 py-3 text-xs font-bold text-slate-600 shadow-sm"><Building2 className="h-4 w-4 shrink-0 text-emerald-600" /><span className="shrink-0">학교 선택</span><select value={selectedUniversity} onChange={(event) => setSelectedUniversity(event.target.value)} className="min-w-0 flex-1 bg-transparent text-right text-xs font-extrabold text-slate-800 outline-none">{Array.from(new Set([...JINJU_UNIVERSITY_NAMES, user.university])).filter(Boolean).map((school) => <option key={school} value={school}>{school}</option>)}</select></label>}

      <div className="flex items-center justify-between rounded-2xl border border-emerald-700/60 bg-gradient-to-r from-emerald-900 to-teal-900 p-4 text-white shadow-md">
        <div className="flex min-w-0 items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400 text-sm font-black text-slate-950">{myRank ? `${myRank.rank}위` : '—'}</div><div className="min-w-0"><span className="block text-[11px] font-bold text-emerald-200">{myRank ? '나의 현재 순위' : isSchoolFilter ? '선택한 학교 순위' : '내 순위'}</span><span className="block truncate text-sm font-extrabold">{myRank ? user.nickname : isSchoolFilter ? `${selectedUniversity} 랭킹` : '해당 유형에 등록된 계정이 아니에요'}</span></div></div>
        <div className="text-right"><span className="block font-mono text-xs font-black text-amber-300">{myRank ? `${myRank.carbonReduction.toFixed(1)}kg` : `${user.totalCarbonReduction.toFixed(1)}kg`}</span><span className="text-[10px] font-light text-emerald-200">누적 탄소 절감</span></div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between px-1"><h3 className="text-xs font-bold text-slate-600">{activeRankTab === 'overall' ? '전체 누적 랭킹' : activeRankTab === 'students' ? `${selectedUniversity} 학생 랭킹` : activeRankTab === 'citizens' ? '진주시민 랭킹' : '친구 랭킹'}</h3><span className="text-[10px] text-slate-400">탄소 절감량 순</span></div>
        {visibleMembers.map((member) => (
          <div key={member.id} className={`flex items-center justify-between rounded-2xl border p-3.5 ${member.isCurrentUser ? 'border-emerald-300 bg-emerald-50 shadow-sm' : 'border-slate-100 bg-white shadow-xs'}`}>
            <div className="flex min-w-0 items-center gap-3"><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-black ${member.rank === 1 ? 'bg-amber-400 text-slate-950' : member.rank === 2 ? 'bg-slate-300 text-slate-900' : member.rank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-100 text-slate-600'}`}>{member.rank}</span><Avatar avatarId={member.avatarId || 'avatar-hamo'} size="sm" /><div className="min-w-0"><div className="flex items-center gap-1.5"><span className="truncate text-xs font-bold text-slate-800">{member.nickname}</span>{member.isCurrentUser && <span className="rounded bg-emerald-600 px-1.5 py-0.5 text-[9px] font-bold text-white">나</span>}</div><span className="block truncate text-[10px] text-slate-400">{activeRankTab === 'citizens' ? '진주시민' : activeRankTab === 'friends' ? `${member.university} · ${member.department}` : `${member.university}${member.department ? ` · ${member.department}` : ''}`}</span></div></div>
            <div className="shrink-0 text-right"><span className="block font-mono text-xs font-extrabold text-emerald-700">{member.carbonReduction.toFixed(1)}kg</span><span className="text-[10px] font-mono text-slate-400">{member.points.toLocaleString()}P {activeRankTab === 'friends' && member.streak > 0 && <><Flame className="ml-1 inline h-3 w-3 text-amber-500" />{member.streak}일</>}</span></div>
          </div>
        ))}
        {visibleMembers.length === 0 && <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-xs leading-relaxed text-slate-500">이 학교의 랭킹 데이터가 아직 없어요.<br />학생들이 참여하면 여기에 순위가 표시돼요.</div>}
      </div>
      <p className="px-1 text-[10px] leading-relaxed text-slate-400">현재는 화면 확인용 시범 랭킹 데이터예요. 실제 사용자 간 통합 랭킹은 공용 서버 연동 후 제공할 수 있어요.</p>
    </div>
  );
};
