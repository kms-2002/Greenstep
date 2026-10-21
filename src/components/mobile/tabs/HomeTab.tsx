import { koreanDay } from '../../../lib/backend';
import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { HomeRanking } from './HomeRanking';
import { VirtualTree } from '../VirtualTree';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Store,
  Building2,
  CalendarCheck2,
  HelpCircle,
  Gift,
  Coffee,
  Sparkles,
  X,
  CheckCircle2,
  Clock,
  Leaf,
  Zap,
  Flame,
  Trophy,
} from 'lucide-react';
import { getChallengeRewardPoints } from '../../../lib/challengeRewards';

export const HomeTab: React.FC = () => {
  const { user, challenges, participations, setActiveTab, setIsAttendanceOpen, attendance } = useApp();
  const measuredEstimateTotal = participations
    .filter(p => p.userId === user.id && p.status === 'completed' && p.carbonEstimate?.status === 'estimated')
    .reduce((sum, p) => sum + (p.carbonEstimate?.estimatedKgCO2e ?? 0), 0);

  // Banner carousel index state (1/3)
  const [currentBanner, setCurrentBanner] = useState(0);

  // Active Quick Action Modal State
  const [activeModal, setActiveModal] = useState<'store' | 'myStore' | 'partner' | 'calendar' | 'faq' | 'point' | 'ranking' | null>(null);

  const banners = [
    { id: 1, tag: '진주 소식', title: '진주시, 2026 지자체 탄소중립 우수사례 선정', date: '브레이크뉴스 · 2026.08.25', href: 'https://m.breaknews.com/1231417', bg: 'bg-rose-100/90 border-rose-200/80 text-rose-950', badgeBg: 'bg-rose-600 text-white' },
    { id: 2, tag: '친환경 이동', title: '하모콜버스, 진주시 탄소중립 주요 이행성과로 평가', date: '시선뉴스 · 지역 교통 이야기', href: 'https://www.sisunnews.co.kr/news/articleView.html?idxno=245840', bg: 'bg-sky-100/90 border-sky-200/80 text-sky-950', badgeBg: 'bg-sky-600 text-white' },
    { id: 3, tag: '시민 참여', title: '진주시 기후변화·탄소중립 인식 및 선호도 조사', date: '2026.10.01 ~ 10.31 · 센터 공식 안내', href: 'https://www.gnu.ac.kr/jinjunetzero/na/ntt/selectNttInfo.do?nttSn=8749362&mi=18870', bg: 'bg-emerald-100/90 border-emerald-200/80 text-emerald-950', badgeBg: 'bg-emerald-600 text-white' },
  ];

  const todayKey=koreanDay();
  const noon=new Date(todayKey+'T12:00:00+09:00');
  const monday=new Date(noon);monday.setUTCDate(noon.getUTCDate()-(noon.getUTCDay()+6)%7);
  const weeklyData=['월','화','수','목','금','토','일'].map((day,index)=>{
    const date=new Date(monday);date.setUTCDate(date.getUTCDate()+index);
    return {day,carbon:participations.filter(p=>p.status==='completed'&&p.completedAt&&koreanDay(new Date(p.completedAt))===koreanDay(date)).reduce((sum,p)=>sum+p.carbonSaved,0)};
  });
  const monthRecords=participations.filter(p=>p.status==='completed'&&p.completedAt&&koreanDay(new Date(p.completedAt)).slice(0,7)===todayKey.slice(0,7));


  const jinjuEcoStores = [
    { name: '아름다운가게 진주평안점', type: '물품 재사용', description: '기증과 중고물품 구매로 자원순환을 실천해보세요.', source: 'https://www.gne.go.kr/e-nanumi/user/bbs/BD_selectBbs.do?q_bbsDocNo=3791&q_bbsSn=1103' },
    { name: '한살림 진주매장', type: '친환경 장보기', description: '장바구니를 챙겨 필요한 만큼 장보기를 실천해보세요.', source: 'https://cdnc.heyzine.com/files/uploaded/v3/8d06f67de29083abcfed16988eee83812ad6d2b6.pdf' },
    { name: '갤러리아백화점 진주점', type: '녹색매장 지정 이력', description: '2023 지속가능경영보고서에 녹색매장으로 소개된 곳입니다. 방문 시 녹색제품 표시를 확인해보세요.', source: 'https://www.hwam.co.kr/resources/kr/file/Hanwha_Solutions_Sustainability_Report_2023.pdf' },
  ];

  // User's Completed Activities Feed
  const completedParticipations = participations.filter((p) => p.status === 'completed');
  const officialCompletedParticipations = completedParticipations.filter((participation) => {
    const challenge = challenges.find((item) => item.id === participation.challengeId);
    return challenge?.active && challenge.officialIncentiveId;
  });

  return (
    <div className="p-4 space-y-4 pb-24 animate-fadeIn select-none">
      <button onClick={()=>setIsAttendanceOpen(true)} className="w-full flex items-center justify-between rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-left">
        <span className="flex items-center gap-2 text-sm font-bold text-emerald-900"><CalendarCheck2 size={18}/>오늘의 출석 체크</span>
        <span className="text-xs font-bold text-emerald-700">{attendance.days.includes(attendance.today)?'출석 완료 ✓':'도장 찍기 →'}</span>
      </button>

      {/* 1. User Greeting & Live Counter Pill */}
      <div className="space-y-1 pt-1">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
          <span className="text-slate-900">{user.nickname}</span>님, 안녕하세요
        </h2>

      </div>

      {/* 2. Main Promotional Pink Banner Card */}
      <div className={`p-4 rounded-2xl border shadow-xs relative overflow-hidden transition-all duration-300 ${banners[currentBanner].bg}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${banners[currentBanner].badgeBg}`}>
              {banners[currentBanner].tag}
            </span>
            <span className="text-[10px] font-medium opacity-80">
              {banners[currentBanner].date}
            </span>
          </div>

          {/* Banner Page Counter */}
          <button
            onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
            className="text-[10px] font-bold bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded-full opacity-90 hover:opacity-100 cursor-pointer"
          >
            {currentBanner + 1} / {banners.length} {'>'}
          </button>
        </div>

        <a href={banners[currentBanner].href} target="_blank" rel="noopener noreferrer" className="block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4">
          <h3 className="text-sm font-bold tracking-tight leading-snug pr-6 font-sans min-h-10">{banners[currentBanner].title}</h3>
          <span className="mt-2 block text-[11px] font-semibold opacity-80">기사·활동 자세히 보기 ↗</span>
        </a>

        {/* Dots indicator */}
        <div className="flex items-center space-x-1 mt-3">
          {banners.map((_, idx) => (
            <button
              key={idx}
              aria-label={`${idx + 1}번째 소식 보기`}
              aria-pressed={idx === currentBanner}
              onClick={() => setCurrentBanner(idx)}
              className={`h-1 rounded-full transition-all cursor-pointer ${
                idx === currentBanner ? 'w-4 bg-slate-800' : 'w-1 bg-slate-400/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 3. Activity Stats 4 Grid Summary (활동 요약 메트릭) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 bg-white rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-xs text-slate-500 font-bold block mb-1">누적 감축 추정량</span>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-black text-emerald-700 font-mono">
              {user.totalCarbonReduction.toFixed(1)}
            </span>
            <span className="text-xs font-bold text-slate-500">kg CO₂e</span>
          </div>
          <p className="mt-1 text-[10px] text-slate-500">측정 무게와 제공 자료로 계산한 기록 {Number(measuredEstimateTotal.toFixed(6))} kg</p>
        </div>

        <div className="p-3.5 bg-white rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-xs text-slate-500 font-bold block mb-1 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            연속 실천
          </span>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-black text-amber-600 font-mono">{user.consecutiveDays}</span>
            <span className="text-xs font-bold text-slate-500">일째</span>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-xs text-slate-500 font-bold block mb-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
            챌린지 성공
          </span>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-black text-teal-700 font-mono">{completedParticipations.length}</span>
            <span className="text-xs font-bold text-slate-500">회</span>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-xs text-slate-500 font-bold block mb-1 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-indigo-600 fill-indigo-500" />
            포인트
          </span>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-black text-indigo-700 font-mono">
              {user.points.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-500">P</span>
          </div>
        </div>
      </div>

      {/* 4. Eco Practice Dashboard Card */}
      <div className="bg-[#EAF5E9] border border-emerald-200/80 rounded-3xl p-4.5 shadow-xs relative overflow-hidden">
        {/* Top Header inside Dashboard Card */}
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-base font-bold text-emerald-950 tracking-tight flex items-center gap-1.5">
            <span>녹색생활실천 현황</span>
          </h3>

          {/* Cute Coffee / Tumbler Illustration Icon */}
          <div className="w-9 h-9 rounded-2xl bg-white/90 shadow-xs border border-emerald-200 flex items-center justify-center relative">
            <Coffee className="w-4.5 h-4.5 text-emerald-600" />
            <Sparkles className="w-3 h-3 text-amber-500 absolute -top-1 -right-1 animate-pulse" />
          </div>
        </div>

        {/* 3 Metric Columns: 실천건수 / 상세건수 / 지급예정포인트 */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center bg-white/80 backdrop-blur-xs rounded-2xl p-3 border border-emerald-100/90 shadow-xs">
          {/* Item 1 */}
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-500 block">실천건수</span>
            <div className="text-base font-bold text-slate-900">
              {completedParticipations.length} <span className="text-xs font-medium text-slate-500">건</span>
            </div>
          </div>

          {/* Item 2 */}
          <div className="space-y-0.5 border-x border-slate-200/60">
            <span className="text-[11px] font-semibold text-slate-500 block">오늘의 절감</span>
            <div className="text-base font-bold text-slate-900">
              {user.todayCarbonReduction.toFixed(1)} <span className="text-[10px] font-medium text-slate-500">(kg CO₂)</span>
            </div>
          </div>

          {/* Item 3 */}
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-500 block">지급예정포인트</span>
            <div className="text-base font-bold text-emerald-700">
              {user.points.toLocaleString()} <span className="text-xs font-semibold text-emerald-600">P</span>
            </div>
          </div>
        </div>
      </div>

      {/* Home shortcuts */}
      <div className="grid grid-cols-4 gap-2.5 pt-1">
        {([
          { id: 'myStore', label: '추천매장', Icon: Store, color: 'bg-amber-100 text-amber-600' },
          { id: 'partner', label: '참여기업', Icon: Building2, color: 'bg-sky-100 text-sky-600' },
          { id: 'point', label: '포인트샵', Icon: Gift, color: 'bg-purple-100 text-purple-600' },
          { id: 'ranking', label: '랭킹', Icon: Trophy, color: 'bg-emerald-100 text-emerald-600' },
        ] as const).map(({ id, label, Icon, color }) => (
          <button key={id} onClick={() => setActiveModal(id)} className="p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${color}`}><Icon className="w-5 h-5" /></div>
            <span className="text-xs font-bold text-slate-800 whitespace-nowrap">{label}</span>
          </button>
        ))}
      </div>

      {/* 6. 나의 최근 공식 포인트 실천 피드 */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
            <span>나의 실천 인증 피드</span>
          </h3>
        </div>

        <div className="space-y-2.5">
          {officialCompletedParticipations.length === 0 ? (
            <div className="p-6 bg-white rounded-2xl border border-slate-100 text-center space-y-2 shadow-xs">
              <Leaf className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-xs font-bold text-slate-700">아직 인증된 실천 활동이 없습니다.</p>
              <p className="text-[11px] text-slate-400">공식 포인트 기준이 연결된 챌린지에 참여해보세요.</p>
              <button
                onClick={() => setActiveTab('challenge')}
                className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer hover:bg-emerald-700 transition-all mt-1"
              >
                챌린지 둘러보기
              </button>
            </div>
          ) : (
            officialCompletedParticipations.slice(0, 4).map((p) => {
              const targetCh = challenges.find((c) => c.id === p.challengeId);
              if (!targetCh) return null;
              const dateStr = p.completedAt ? new Date(p.completedAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '최근';

              return (
                <div
                  key={p.id}
                  className="p-3.5 bg-white rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between hover:shadow-md transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-2xl overflow-hidden shrink-0 bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xl">
                      {targetCh.categoryIcon}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-extrabold text-xs text-slate-800">{targetCh.title}</span>
                      </div>

                      <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {dateStr}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-0.5">
                    <div className="text-[10px] font-mono font-bold text-amber-600 flex items-center justify-end gap-0.5">
                      <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                      +{getChallengeRewardPoints(targetCh).toLocaleString()}P
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 7. Weekly Activity Graph */}
      <div className="p-4.5 bg-white rounded-2xl border border-slate-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-800">이번 주 탄소절감 활동</h3>
          <span className="text-[11px] text-slate-400 font-medium">요일별 (kg CO₂e)</span>
        </div>

        <div className="h-40 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value: any) => [`${value ?? 0}kg CO₂e`, '탄소절감량']}
              />
              <Bar dataKey="carbon" fill="#10B981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 8. Virtual Carbon Tree (나의 탄소나무를 홈 화면 하단에 배치) */}
      <div className="pt-2">
        <VirtualTree totalCarbon={user.totalCarbonReduction} />
      </div>

      {/* Quick Action Interactive Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-sm max-h-[85dvh] overflow-y-auto rounded-3xl shadow-2xl border border-slate-100 p-5 space-y-4 animate-scaleUp relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModal === 'ranking' && <HomeRanking />}

            {(activeModal === 'store' || activeModal === 'myStore') && (
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 pr-5 text-base font-black text-slate-900"><Store className="w-5 h-5 text-emerald-600" />진주시 친환경 매장 추천</h3>
                <p className="text-xs leading-relaxed text-slate-500">재사용과 친환경 소비를 시작할 수 있는 매장이에요. 방문 전 운영 정보와 참여 조건을 확인해주세요.</p>
                {jinjuEcoStores.map(st => <article key={st.name} className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3.5 space-y-2">
                  <span className="inline-block rounded-full bg-white px-2 py-1 text-[10px] font-bold text-emerald-700">{st.type}</span>
                  <h4 className="text-sm font-bold text-slate-800">{st.name}</h4>
                  <p className="text-xs leading-relaxed text-slate-600">{st.description}</p>
                  <div className="flex gap-3 text-xs font-bold text-emerald-700">
                    <a href={`https://map.naver.com/p/search/${encodeURIComponent(st.name)}`} target="_blank" rel="noopener noreferrer">위치·운영정보 ↗</a>
                    <a href={st.source} target="_blank" rel="noopener noreferrer">소개 자료 ↗</a>
                  </div>
                </article>)}
                <p className="text-[10px] leading-relaxed text-slate-500">추천 매장 안내이며 앱 제휴·포인트 지급을 보장하지 않습니다. 지정 이력은 현재 인증 상태와 다를 수 있습니다.</p>
              </div>
            )}

            {activeModal === 'partner' && (
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 pr-5 text-base font-black text-slate-900"><Building2 className="w-5 h-5 text-sky-600" />참여 기업 및 기관</h3>
                {[
                  ['경상국립대학교', '대학과 함께하는 지역 환경 실천'],
                  ['진주시청 환경산림국', '기후환경과 · 자원순환과'],
                  ['경상남도 탄소중립지원센터', '지역 탄소중립 정책 및 실천 지원'],
                  ['진주시 시설관리공단', '시민 생활과 공공시설'],
                ].map(([name, description], index) => <div key={name} className="flex gap-3 rounded-2xl border border-sky-100 bg-sky-50/70 p-3.5">
                  <span className="text-sky-600 font-black text-sm">0{index + 1}</span>
                  <div><h4 className="text-sm font-bold text-slate-900">{name}</h4><p className="mt-1 text-xs text-slate-500">{description}</p></div>
                </div>)}
                <p className="text-[10px] text-slate-500">지역 관련 기관 안내 · 앱의 공식 제휴 여부는 별도 확인이 필요합니다.</p>
              </div>
            )}

            {activeModal === 'calendar' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-amber-600 font-black">
                  <CalendarCheck2 className="w-5 h-5" />
                  <h3 className="text-base text-slate-900">이번 달 나의 실무 달력</h3>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl text-xs space-y-2">
                  <div className="flex justify-between font-bold border-b pb-2">
                    <span>{Number(todayKey.slice(5,7))}월 실천 달성도</span>
                    <span className="text-emerald-600">{user.consecutiveDays}일 연속 실천</span>
                  </div>
                  <p className="text-[11px] text-slate-500">이번 달 감축 추정량: {monthRecords.reduce((sum,p)=>sum+p.carbonSaved,0).toFixed(4)} kg CO₂e / 챌린지 포인트: {monthRecords.reduce((sum,p)=>sum+p.pointsEarned,0)} P</p>
                </div>
              </div>
            )}

            {activeModal === 'faq' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-teal-600 font-black">
                  <HelpCircle className="w-5 h-5" />
                  <h3 className="text-base text-slate-900">자주 묻는 질문 (FAQ)</h3>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl font-bold">Q. 탄소 포인트는 어디서 사용하나요?</div>
                  <p className="text-[11px] text-slate-600 pl-2">GNU 캠퍼스 내부 카페 할인 쿠폰 및 진주 모바일 상품권으로 교환 가능합니다.</p>
                </div>
              </div>
            )}

            {activeModal === 'point' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-purple-600 font-black">
                  <Gift className="w-5 h-5" />
                  <h3 className="text-base text-slate-900">탄소포인트 교환 상품권</h3>
                </div>
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-xs space-y-2">
                  <div className="font-bold text-purple-900">보유 포인트: {user.points.toLocaleString()} P</div>
                  <p className="text-[11px] text-purple-700">GNU 도서관 카페 1,000원 할인권 (1,000 P 필요)</p>
                  <button
                    onClick={() => {
                      alert('🎉 포인트 교환이 정상적으로 신청되었습니다!');
                      setActiveModal(null);
                    }}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl mt-2 cursor-pointer"
                  >
                    1,000 P 교환하기
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
