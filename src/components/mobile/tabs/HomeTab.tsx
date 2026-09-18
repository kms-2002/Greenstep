import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { generateRecommendation } from '../../../utils/carbonCalculator';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  MapPin,
  Store,
  Building2,
  CalendarCheck2,
  Globe2,
  Trophy,
  HelpCircle,
  Gift,
  ChevronRight,
  Coffee,
  Sparkles,
  X,
} from 'lucide-react';

export const HomeTab: React.FC = () => {
  const { user, challenges, participations, setSelectedChallenge, setActiveTab } = useApp();

  // Banner carousel index state (1/3)
  const [currentBanner, setCurrentBanner] = useState(0);

  // Active Quick Action Modal State
  const [activeModal, setActiveModal] = useState<'store' | 'myStore' | 'partner' | 'calendar' | 'faq' | 'point' | null>(null);

  const banners = [
    {
      id: 1,
      tag: '시범운영',
      title: '탄소중립포인트 모바일앱 신규서비스 시범운영안내',
      date: '기간: 2026. 09. 16(수) ~ 10월 (본 게시시점까지)',
      bg: 'bg-rose-100/90 border-rose-200/80 text-rose-950',
      badgeBg: 'bg-rose-600 text-white',
    },
    {
      id: 2,
      tag: 'GNU 이벤트',
      title: '경상국립대 경영대학 텀블러 지참 시 300P 즉시 적립!',
      date: '기간: 2026. 09. 01 ~ 상시 진행 (가좌캠 카페)',
      bg: 'bg-emerald-100/90 border-emerald-200/80 text-emerald-950',
      badgeBg: 'bg-emerald-600 text-white',
    },
    {
      id: 3,
      tag: '진주시 협력',
      title: '진주시 남강 자전거 라이딩 챌린지 탄소 포인트 우대',
      date: '기간: 2026. 09. 10 ~ 11. 30',
      bg: 'bg-sky-100/90 border-sky-200/80 text-sky-950',
      badgeBg: 'bg-sky-600 text-white',
    },
  ];

  const recommendationInfo = generateRecommendation(participations, challenges);
  const recommendedList = challenges.filter((c) => c.isRecommended || c.isPopular).slice(0, 2);

  const weeklyData = [
    { day: '월', carbon: 0.8 },
    { day: '화', carbon: 1.4 },
    { day: '수', carbon: 2.1 },
    { day: '목', carbon: 1.1 },
    { day: '금', carbon: user.todayCarbonReduction },
    { day: '토', carbon: 0.0 },
    { day: '일', carbon: 0.0 },
  ];

  // Jinju Eco Stores Mock Data
  const jinjuEcoStores = [
    { name: 'GNU 가좌캠 도서관 1층 카페', type: '텀블러 300원 할인 + 300P', dist: '캠퍼스 내' },
    { name: '진주 가좌동 제로웨이스트샵 리필가게', type: '용기내 할인 + 탄소포인트', dist: '500m' },
    { name: '진주 남강 공공자전거 대여소 (가좌)', type: '대중교통 자전거 포인트', dist: '300m' },
    { name: '경상국립대 칠암캠 혜람관 카페', type: '텀블러 지참 200원 할인', dist: '칠암캠' },
  ];

  return (
    <div className="p-4 space-y-4 pb-24 animate-fadeIn select-none">

      {/* 1. User Greeting & Live Counter Pill */}
      <div className="space-y-1 pt-1">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
          <span className="text-slate-900">{user.nickname}</span>님, 안녕하세요
        </h2>

        <div className="flex items-center space-x-1 text-xs">
          <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200/70 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>녹색생활 1,504,824 참여중</span>
          </span>
        </div>
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

        <h3 className="text-sm font-bold tracking-tight leading-snug pr-6 font-sans">
          {banners[currentBanner].title}
        </h3>

        {/* Dots indicator */}
        <div className="flex items-center space-x-1 mt-3">
          {banners.map((_, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentBanner(idx)}
              className={`h-1 rounded-full transition-all cursor-pointer ${
                idx === currentBanner ? 'w-4 bg-slate-800' : 'w-1 bg-slate-400/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 3. Eco Practice Dashboard Card */}
      <div className="bg-[#EAF5E9] border border-emerald-200/80 rounded-3xl p-4.5 shadow-xs relative overflow-hidden">
        {/* Top Header inside Dashboard Card */}
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-base font-bold text-emerald-950 tracking-tight flex items-center gap-1.5">
            <span>녹색생활실천</span>
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
              {participations.length} <span className="text-xs font-medium text-slate-500">건</span>
            </div>
          </div>

          {/* Item 2 */}
          <div className="space-y-0.5 border-x border-slate-200/60">
            <span className="text-[11px] font-semibold text-slate-500 block">상세건수</span>
            <div className="text-base font-bold text-slate-900">
              {user.todayCarbonReduction.toFixed(1)} <span className="text-[10px] font-medium text-slate-500">(km/kg)</span>
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

      {/* 4. Quick Action 8 Grid Icon Buttons (카본페이 하단 8개 깔끔한 버튼 카테고리) */}
      <div className="grid grid-cols-4 gap-2.5 pt-1">
        {/* Button 1: 매장찾기 */}
        <button
          onClick={() => setActiveModal('store')}
          className="p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center space-y-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-xs font-bold text-slate-800">매장찾기</span>
        </button>

        {/* Button 2: 나의매장 */}
        <button
          onClick={() => setActiveModal('myStore')}
          className="p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center space-y-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center">
            <Store className="w-5 h-5 text-amber-600" />
          </div>
          <span className="text-xs font-bold text-slate-800">나의매장</span>
        </button>

        {/* Button 3: 참여기업 */}
        <button
          onClick={() => setActiveModal('partner')}
          className="p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center space-y-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-sky-100 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-sky-600" />
          </div>
          <span className="text-xs font-bold text-slate-800">참여기업</span>
        </button>

        {/* Button 4: 실적달력 */}
        <button
          onClick={() => setActiveModal('calendar')}
          className="p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center space-y-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center">
            <CalendarCheck2 className="w-5 h-5 text-amber-600" />
          </div>
          <span className="text-xs font-bold text-slate-800">실적달력</span>
        </button>

        {/* Button 5: 실천활동 */}
        <button
          onClick={() => setActiveTab('board')}
          className="p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center space-y-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
            <Globe2 className="w-5 h-5 text-indigo-600" />
          </div>
          <span className="text-xs font-bold text-slate-800">실천활동</span>
        </button>

        {/* Button 6: 학과랭킹 */}
        <button
          onClick={() => setActiveTab('ranking')}
          className="p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center space-y-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-rose-600 fill-rose-500" />
          </div>
          <span className="text-xs font-bold text-slate-800">학과랭킹</span>
        </button>

        {/* Button 7: FAQ */}
        <button
          onClick={() => setActiveModal('faq')}
          className="p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center space-y-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-teal-100 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-teal-600" />
          </div>
          <span className="text-xs font-bold text-slate-800">FAQ</span>
        </button>

        {/* Button 8: 포인트샵 */}
        <button
          onClick={() => setActiveModal('point')}
          className="p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center space-y-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center">
            <Gift className="w-5 h-5 text-purple-600" />
          </div>
          <span className="text-xs font-bold text-slate-800">포인트샵</span>
        </button>
      </div>

      {/* AI Recommendation Banner */}
      <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200/80 flex items-start space-x-3 shadow-xs">
        <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-md shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex-1 text-xs">
          <span className="font-bold text-emerald-950 block">AI 맞춤형 챌린지 추천</span>
          <p className="text-emerald-800 text-[11px] mt-0.5">
            "{user.nickname}님은 {recommendationInfo.reason}"
          </p>
        </div>
      </div>

      {/* Today's Recommended Challenges */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
            <span>오늘의 추천 챌린지</span>
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              HOT
            </span>
          </h3>
          <button
            onClick={() => setActiveTab('challenge')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center cursor-pointer"
          >
            <span>전체보기</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {recommendedList.map((ch) => (
            <div
              key={ch.id}
              onClick={() => setSelectedChallenge(ch)}
              className="p-4 bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                    <img src={ch.imageUrl} alt={ch.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1">
                      <span>{ch.categoryIcon}</span>
                      <span>{ch.title}</span>
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{ch.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center space-x-3 font-mono font-medium">
                  <span className="text-emerald-700">
                    예상 절감: <b>{ch.carbonReduction.toFixed(1)}kg</b>
                  </span>
                  <span className="text-amber-600">
                    보상: <b>+{ch.rewardPoints}P</b>
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedChallenge(ch);
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
                >
                  도전하기
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Activity Graph */}
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

      {/* Quick Action Interactive Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-slate-100 p-5 space-y-4 animate-scaleUp relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModal === 'store' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-emerald-600 font-black">
                  <MapPin className="w-5 h-5" />
                  <h3 className="text-base text-slate-900">진주 친환경 제로웨이스트 매장</h3>
                </div>
                <p className="text-xs text-slate-500">경상국립대 주변 텀블러 할인 및 용기내 매장입니다.</p>
                <div className="space-y-2 pt-1">
                  {jinjuEcoStores.map((st, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-800 block">{st.name}</span>
                        <span className="text-[11px] text-emerald-600 font-medium">{st.type}</span>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">{st.dist}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeModal === 'myStore' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-amber-600 font-black">
                  <Store className="w-5 h-5" />
                  <h3 className="text-base text-slate-900">나의 자주 가는 매장</h3>
                </div>
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/60 space-y-2 text-xs">
                  <div className="font-bold text-amber-900">GNU 가좌캠 도서관 1층 카페</div>
                  <p className="text-amber-800 text-[11px]">누적 텀블러 할인 12회 받음 (총 3,600원 할인 & 3,600P 적립 완료)</p>
                </div>
              </div>
            )}

            {activeModal === 'partner' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sky-600 font-black">
                  <Building2 className="w-5 h-5" />
                  <h3 className="text-base text-slate-900">GNU 탄소중립 참여 기업 및 기관</h3>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 font-bold text-sky-900">경상국립대학교 경영대학 학부</div>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 font-bold text-emerald-900">진주시청 환경교통국</div>
                  <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 font-bold text-indigo-900">한국남동발전 본사</div>
                </div>
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
                    <span>9월 실천 달성도</span>
                    <span className="text-emerald-600">12일 연속 성공 🔥</span>
                  </div>
                  <p className="text-[11px] text-slate-500">이번 달 총 절감량: 8.4 kg CO₂e / 획득 포인트: 450 P</p>
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
