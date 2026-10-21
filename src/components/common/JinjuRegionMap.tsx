import { useState } from 'react';
import { regions, regionViewBox, urbanViewBox, type RegionStat } from '../../lib/jinjuRegions';

export function JinjuRegionMap({selected, onSelect, stats = []}: {
  selected: string; onSelect: (id:string) => void; stats?: RegionStat[];
}) {
  const [urban, setUrban] = useState(false);
  const [showImpact, setShowImpact] = useState(false);
  const palette = ['#c5dfe9', '#f4d9df', '#d4e5c4', '#fae6a5', '#d9cbea', '#f4d1af', '#c6e4dc', '#e4dfb4'];
  const max = Math.max(1, ...stats.map(s => s.estimated));
  return <div className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-sky-50/70 via-white to-emerald-50/50 shadow-sm">
    <div className="flex justify-between items-center px-4 pt-4">
      <span className="text-xs font-bold text-emerald-900">JINJU · 지역을 선택하세요</span>
      <button onClick={()=>setUrban(v=>!v)} className="rounded-full border bg-white px-3 py-1.5 text-xs font-bold">{urban?'진주 전체':'도심 확대'}</button>
    </div>
    <div className="mx-4 mt-3 inline-flex gap-1 rounded-full bg-white p-1 border border-slate-200 text-[11px] font-bold">
      <button aria-pressed={!showImpact} onClick={()=>setShowImpact(false)} className={`rounded-full px-3 py-1.5 ${!showImpact?'bg-slate-800 text-white':'text-slate-600'}`}>지역별 색상</button>
      <button aria-pressed={showImpact} onClick={()=>setShowImpact(true)} className={`rounded-full px-3 py-1.5 ${showImpact?'bg-emerald-700 text-white':'text-slate-600'}`}>감축 추정량</button>
    </div>
    <svg viewBox={urban?urbanViewBox:regionViewBox} className="block aspect-square w-full" aria-label="진주시 행정동 및 읍면 통합권역 지도">
      {regions.map((r, index) => {
        const stat = stats.find(s=>s.id===r.id);
        const active = r.id===selected;
        const fill = showImpact
          ? (stat?.measured ? `hsl(155 50% ${85 - Math.min(1,stat.estimated/max)*45}%)` : '#e2ece7')
          : palette[index % palette.length];
        return <g key={r.id} role="button" tabIndex={0} aria-label={`${r.name}: ${r.members.join(', ')}`} aria-pressed={active}
          onClick={()=>onSelect(r.id)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect(r.id);}}}
          className="cursor-pointer outline-none focus:opacity-60">
          <title>{r.name} · {r.members.join(', ')}</title>
          <path d={r.path} fill={fill} fillRule="evenodd" stroke={active?'#243b66':'#ffffff'} strokeWidth={active?3:1.5} vectorEffect="non-scaling-stroke" className="transition-colors duration-200 hover:brightness-95"/>
          <text x={r.label[0]} y={r.label[1]} textAnchor="middle" dominantBaseline="central"
            fontSize={r.members.length>1?16:urban?8:10} fontWeight="700" fill="#173c2d"
            paintOrder="stroke" stroke="#ffffff" strokeWidth={2} strokeLinejoin="round">{r.name}</text>
        </g>;
      })}
    </svg>
    <div className="px-4 pb-4 text-[10px] text-slate-600">
      <span className="inline-flex items-center gap-1.5 font-bold"><span className="h-3 w-3 rounded-sm border-2 border-[#243b66] bg-white" />진한 테두리: 선택 지역</span>
      {showImpact ? <p className="mt-1">연두 → 초록: 앱 감축 추정량 증가 · 회색: 산출 기록 없음</p> : <p className="mt-1">파스텔 색상은 지역 구분용이며 탄소 수치나 순위를 뜻하지 않습니다.</p>}
      <p className="mt-1">읍면은 인접 권역으로 묶어 표시합니다.</p>
    </div>
  </div>;
}
