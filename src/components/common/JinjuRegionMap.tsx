import { useState } from 'react';
import { regions, regionViewBox, urbanViewBox, type RegionStat } from '../../lib/jinjuRegions';

export function JinjuRegionMap({selected, onSelect, stats = []}: {
  selected: string; onSelect: (id:string) => void; stats?: RegionStat[];
}) {
  const [urban, setUrban] = useState(false);
  const max = Math.max(1, ...stats.map(s => s.estimated));
  return <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-[#f7fbf8]">
    <div className="flex justify-between items-center px-4 pt-4">
      <span className="text-xs font-bold text-emerald-900">JINJU · 지역을 선택하세요</span>
      <button onClick={()=>setUrban(v=>!v)} className="rounded-full border bg-white px-3 py-1.5 text-xs font-bold">{urban?'진주 전체':'도심 확대'}</button>
    </div>
    <svg viewBox={urban?urbanViewBox:regionViewBox} className="block aspect-square w-full" aria-label="진주시 행정동 및 읍면 통합권역 지도">
      {regions.map(r => {
        const stat = stats.find(s=>s.id===r.id);
        const active = r.id===selected;
        const fill = active ? '#fbbf24' : stat?.measured ? `hsl(155 50% ${85 - Math.min(1,stat.estimated/max)*45}%)` : '#e2ece7';
        return <g key={r.id} role="button" tabIndex={0} aria-label={`${r.name}: ${r.members.join(', ')}`} aria-pressed={active}
          onClick={()=>onSelect(r.id)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect(r.id);}}}
          className="cursor-pointer outline-none focus:opacity-60">
          <title>{r.name} · {r.members.join(', ')}</title>
          <path d={r.path} fill={fill} fillRule="evenodd" stroke={active?'#92400e':'#749989'} strokeWidth={active?2.5:1} vectorEffect="non-scaling-stroke"/>
          <text x={r.label[0]} y={r.label[1]} textAnchor="middle" dominantBaseline="central"
            fontSize={r.members.length>1?16:urban?8:10} fontWeight="700" fill="#173c2d"
            paintOrder="stroke" stroke="#ffffff" strokeWidth={2} strokeLinejoin="round">{r.name}</text>
        </g>;
      })}
    </svg>
    <div className="px-4 pb-4 text-[10px] text-slate-600">
      <span className="mr-3">🟨 선택 지역</span><span>연두 → 초록: 앱 감축 추정량 증가</span>
      <p className="mt-1">회색: 산출 기록 없음 · 공식 배출량의 많고 적음을 나타내지 않습니다.</p>
    </div>
  </div>;
}
