import { carbonTargets } from '../../data/carbonTargets';
import { koreanDay } from '../../lib/backend';
import type { Participation } from '../../types';

export function CarbonGoal({ participations, userId }: {participations: Participation[]; userId: string}) {
  const {national,practice} = carbonTargets;
  const today = koreanDay();
  const first = new Date(`${today}T00:00:00+09:00`).getTime()-(practice.days-1)*86400000;
  const now = Date.now();
  const saved = participations.filter(p=>p.userId===userId && p.status==='completed'
    && p.carbonEstimate?.status==='estimated' && p.completedAt
    && new Date(p.completedAt).getTime()>=first && new Date(p.completedAt).getTime()<=now
    && Number.isFinite(p.carbonSaved) && p.carbonSaved>=0)
    .reduce((sum,p)=>sum+p.carbonSaved,0);
  const remaining = Math.max(0,practice.kg-saved);
  const format = (n:number) => n.toLocaleString('ko-KR',{minimumFractionDigits:3,maximumFractionDigits:3});
  return <section className="space-y-4 rounded-3xl border border-emerald-100 bg-white p-4">
    <div>
      <p className="text-xs font-bold text-slate-600">대한민국 {national.targetYear} 국가 감축목표</p>
      <strong className="mt-1 block text-2xl text-emerald-800">{national.reductionPercent.join('~')}% 감축</strong>
      <p className="mt-1 text-[10px] text-slate-500">{national.baselineYear}년 순배출량 {national.baselineNetMillionTonnes}백만 tCO₂eq 대비. 국가 전체 목표이며 개인·지역별 할당량이 아닙니다.</p>
      <a href={national.source} target="_blank" rel="noreferrer" className="mt-1 inline-block text-[10px] text-emerald-700 underline">기후에너지환경부 자료 ↗</a>
    </div>
    <div className="rounded-2xl bg-emerald-50 p-4">
      <h3 className="text-sm font-bold text-emerald-900">나의 1톤 실천 참고 목표</h3>
      <p className="mt-1 text-[10px] text-slate-600">최근 {practice.days}일 · 모든 지역의 내 인증 합계</p>
      <div className="mt-3 flex items-baseline gap-1"><strong className="text-3xl text-emerald-800">{format(remaining)}</strong><span className="text-xs">kg CO₂e 남음</span></div>
      <p className="mt-1 text-xs">목표 {practice.kg.toLocaleString()}kg − 앱 감축 추정 {format(saved)}kg</p>
      <div role="progressbar" aria-label="1톤 실천 참고 목표 진행률" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.min(100,saved/practice.kg*100)} className="my-3 h-2 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-emerald-500" style={{width:`${Math.min(100,saved/practice.kg*100)}%`}}/></div>
      {saved>=practice.kg&&<p className="mb-2 text-xs font-bold text-emerald-800">참고 목표를 달성했어요! 추가 실천도 계속 기록됩니다.</p>}
      <p className="text-[10px] leading-relaxed text-slate-600">한국기후·환경네트워크의 ‘{practice.name}’ 캠페인을 참고했습니다. 최근 365일 집계는 앱의 운영 기준이며, 국가가 개인에게 정한 의무량이 아닙니다. 지역·기간 필터를 바꿔도 이 개인 목표는 같습니다.</p>
      <p className="mt-2 text-[10px] leading-relaxed text-slate-600">캠페인은 다양한 생활 실천을 포함하지만 현재 앱은 계산 근거가 있는 인증만 합산합니다. 생활 전체의 감축량이나 공식 NDC 달성 실적을 의미하지 않습니다.</p>
      <a href={practice.source} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-emerald-700 underline">1인 1톤 캠페인 출처 ↗</a>
    </div>
  </section>;
}
