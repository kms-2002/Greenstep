import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Challenge, ChallengeCategory } from '../../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  Plus,
  Trash2,
  Edit,
  Smartphone,
  Users,
  TreePine,
  Activity,
  CheckCircle,
  Database,
  Layers,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    challenges,
    departmentRanks,
    carbonFactors,
    addAdminChallenge,
    updateAdminChallenge,
    deleteAdminChallenge,
    setViewMode,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'analytics' | 'challenges' | 'carbon_factors'>('analytics');
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for New/Edit Challenge
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<ChallengeCategory>('life');
  const [formDesc, setFormDesc] = useState('');
  const [formGuide, setFormGuide] = useState('');
  const [formCarbon, setFormCarbon] = useState('0.5');
  const [formPoints, setFormPoints] = useState('20');
  const [formUnit, setFormUnit] = useState('1회 실천');

  // KPI Specs from Requirement Item 14
  const kpis = [
    { title: '전체 가입자', value: '1,284명', change: '+12% 이번 달', icon: <Users className="w-5 h-5 text-indigo-500" /> },
    { title: '챌린지 참여자', value: '867명', change: '+18% 이번 달', icon: <Activity className="w-5 h-5 text-emerald-500" /> },
    { title: '누적 탄소절감량', value: '1,842kg CO₂e', change: '목표 92% 달성', icon: <TreePine className="w-5 h-5 text-teal-500" /> },
    { title: '이번 달 참여율', value: '67%', change: '+5%p 전월 대비', icon: <CheckCircle className="w-5 h-5 text-amber-500" /> },
  ];

  // Analytics Chart Data
  const dailyCarbonData = [
    { date: '9/1', carbon: 42.5 },
    { date: '9/2', carbon: 58.2 },
    { date: '9/3', carbon: 61.4 },
    { date: '9/4', carbon: 73.8 },
    { date: '9/5', carbon: 89.1 },
    { date: '9/6', carbon: 95.3 },
    { date: '9/7', carbon: 112.0 },
  ];

  const challengeParticipantsData = challenges.map((c) => ({
    name: c.title,
    count: c.participantsCount,
  }));

  const deptEngagementData = departmentRanks.map((d) => ({
    name: d.department,
    carbon: d.totalCarbonReduction,
    participants: d.participantCount,
  }));

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6'];

  const openAddModal = () => {
    setEditingChallenge(null);
    setFormTitle('');
    setFormCategory('life');
    setFormDesc('');
    setFormGuide('');
    setFormCarbon('0.5');
    setFormPoints('20');
    setFormUnit('1회 실천');
    setIsAddModalOpen(true);
  };

  const openEditModal = (ch: Challenge) => {
    setEditingChallenge(ch);
    setFormTitle(ch.title);
    setFormCategory(ch.category);
    setFormDesc(ch.description);
    setFormGuide(ch.detailGuide);
    setFormCarbon(String(ch.carbonReduction));
    setFormPoints(String(ch.rewardPoints));
    setFormUnit(ch.unitDescription);
    setIsAddModalOpen(true);
  };

  const handleSaveChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    const catMap: Record<ChallengeCategory, { name: string; icon: string }> = {
      all: { name: '전체', icon: '🌟' },
      transport: { name: '이동', icon: '🚍' },
      life: { name: '생활', icon: '🥤' },
      food: { name: '음식', icon: '🍚' },
      resource: { name: '자원', icon: '♻️' },
    };

    if (editingChallenge) {
      updateAdminChallenge({
        ...editingChallenge,
        title: formTitle,
        category: formCategory,
        categoryName: catMap[formCategory].name,
        categoryIcon: catMap[formCategory].icon,
        description: formDesc,
        detailGuide: formGuide,
        carbonReduction: parseFloat(formCarbon) || 0.1,
        rewardPoints: parseInt(formPoints) || 10,
        unitDescription: formUnit,
      });
    } else {
      addAdminChallenge({
        title: formTitle,
        category: formCategory,
        categoryName: catMap[formCategory].name,
        categoryIcon: catMap[formCategory].icon,
        description: formDesc,
        detailGuide: formGuide,
        carbonReduction: parseFloat(formCarbon) || 0.1,
        rewardPoints: parseInt(formPoints) || 10,
        unitDescription: formUnit,
        verificationMethod: '사진 인증',
        imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600',
      });
    }
    setIsAddModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 space-y-6">
      {/* Top Navbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full">
              ADMIN CONSOLE v2.0
            </span>
            <span className="text-xs text-slate-400">GreenStep 대학생 챌린지 총괄 관리 대시보드</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mt-1">
            Green<span className="text-emerald-400">Step</span> 관리자 대시보드
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setViewMode('mobile')}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Smartphone className="w-4 h-4" />
            <span>📱 학생용 모바일 앱으로 전환</span>
          </button>
        </div>
      </div>

      {/* KPI Cards (Item 14 Specs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex items-center justify-between hover:border-slate-700 transition-all"
          >
            <div>
              <span className="text-xs text-slate-400 font-medium block mb-1">{kpi.title}</span>
              <span className="text-2xl font-black text-white font-mono">{kpi.value}</span>
              <span className="text-[11px] text-emerald-400 font-medium block mt-1">{kpi.change}</span>
            </div>
            <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700">{kpi.icon}</div>
          </div>
        ))}
      </div>

      {/* Tab Switcher: Analytics / Challenge Management / Carbon Factor Table */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveAdminTab('analytics')}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 ${
            activeAdminTab === 'analytics'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>통계 및 분석 데이터</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('challenges')}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 ${
            activeAdminTab === 'challenges'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>챌린지 등록 및 수정</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('carbon_factors')}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 ${
            activeAdminTab === 'carbon_factors'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>탄소배출계수 산정 테이블</span>
        </button>
      </div>

      {/* TAB 1: ANALYTICS & CHARTS */}
      {activeAdminTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
          {/* Chart 1: Daily/Monthly Carbon Reduction */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <h3 className="text-sm font-extrabold text-white">1. 일별/월별 탄소절감량 추이 (kg CO₂e)</h3>
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyCarbonData}>
                  <XAxis dataKey="date" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }} />
                  <Line type="monotone" dataKey="carbon" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Participants per Challenge */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <h3 className="text-sm font-extrabold text-white">2. 챌린지별 참여자 수 현황</h3>
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={challengeParticipantsData.slice(0, 6)}>
                  <XAxis dataKey="name" stroke="#64748B" fontSize={10} interval={0} tick={{ fill: '#94A3B8' }} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }} />
                  <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Department Carbon & Participation */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <h3 className="text-sm font-extrabold text-white">3. 학과별 탄소절감량 및 참여율</h3>
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptEngagementData}>
                  <XAxis dataKey="name" stroke="#64748B" fontSize={10} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }} />
                  <Bar dataKey="carbon" fill="#14B8A6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Top Eco Behavior Share */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <h3 className="text-sm font-extrabold text-white">4. 가장 많이 실천한 친환경 행동 비중</h3>
            <div className="h-64 w-full pt-2 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: '텀블러 사용', value: 35 },
                      { name: '대중교통 이용', value: 25 },
                      { name: '분리배출', value: 20 },
                      { name: '잔반 제로', value: 15 },
                      { name: '기타', value: 5 },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CHALLENGE MANAGEMENT CRUD */}
      {activeAdminTab === 'challenges' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-white">챌린지 관리목록</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                신규 챌린지를 생성하고 포인트 및 탄소 절감량을 설정할 수 있습니다.
              </p>
            </div>

            <button
              onClick={openAddModal}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center space-x-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>신규 챌린지 추가</span>
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3.5">카테고리</th>
                  <th className="p-3.5">챌린지 제목</th>
                  <th className="p-3.5">탄소 절감량</th>
                  <th className="p-3.5">포인트</th>
                  <th className="p-3.5">참여자 수</th>
                  <th className="p-3.5">상태</th>
                  <th className="p-3.5 text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {challenges.map((ch) => (
                  <tr key={ch.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-3.5 font-bold">
                      {ch.categoryIcon} {ch.categoryName}
                    </td>
                    <td className="p-3.5 font-bold text-white">{ch.title}</td>
                    <td className="p-3.5 font-mono text-emerald-400">{ch.carbonReduction.toFixed(1)}kg CO₂e</td>
                    <td className="p-3.5 font-mono text-amber-400">+{ch.rewardPoints}P</td>
                    <td className="p-3.5 font-mono">{ch.participantsCount}명</td>
                    <td className="p-3.5">
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded text-[10px] font-bold">
                        진행중
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(ch)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                        title="수정"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`'${ch.title}' 챌린지를 삭제하시겠습니까?`)) {
                            deleteAdminChallenge(ch.id);
                          }
                        }}
                        className="p-1.5 bg-red-950/80 hover:bg-red-900 text-red-400 rounded-lg transition-colors"
                        title="삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CARBON FACTORS TABLE */}
      {activeAdminTab === 'carbon_factors' && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <h3 className="text-base font-extrabold text-white">공식 탄소배출계수 데이터베이스</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              환경부 및 KEITI 표준 데이터 기반으로 설정된 단위당 탄소 감축 산정 공식입니다.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3.5">친환경 행동 항목</th>
                  <th className="p-3.5">기준 단위</th>
                  <th className="p-3.5">배출계수 (kg CO₂e)</th>
                  <th className="p-3.5">설명 및 계수 출처</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {carbonFactors.map((cf) => (
                  <tr key={cf.id} className="hover:bg-slate-800/50">
                    <td className="p-3.5 font-bold text-white">{cf.action}</td>
                    <td className="p-3.5 font-mono text-amber-300">{cf.unit}</td>
                    <td className="p-3.5 font-mono font-bold text-emerald-400">{cf.factorKgCO2e}kg</td>
                    <td className="p-3.5 text-slate-400">
                      <div>{cf.description}</div>
                      <span className="text-[10px] text-slate-500 font-mono">출처: {cf.source}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for Add / Edit Challenge */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 text-white w-full max-w-lg rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-white">
              {editingChallenge ? '챌린지 수정' : '신규 챌린지 추가'}
            </h3>

            <form onSubmit={handleSaveChallenge} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">챌린지 제목</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">카테고리</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ChallengeCategory)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-emerald-500"
                  >
                    <option value="transport">이동 🚍</option>
                    <option value="life">생활 🥤</option>
                    <option value="food">음식 🍚</option>
                    <option value="resource">자원 ♻️</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">목표 단위</label>
                  <input
                    type="text"
                    required
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">탄소 절감량 (kg CO₂e)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formCarbon}
                    onChange={(e) => setFormCarbon(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">획득 포인트 (P)</label>
                  <input
                    type="number"
                    required
                    value={formPoints}
                    onChange={(e) => setFormPoints(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">챌린지 간단 설명</label>
                <input
                  type="text"
                  required
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">상세 인증 가이드</label>
                <textarea
                  rows={3}
                  required
                  value={formGuide}
                  onChange={(e) => setFormGuide(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 bg-slate-800 text-slate-400 font-bold rounded-xl"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30"
                >
                  저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
