import { useEffect, useState } from 'react';
import { MapPinned, RefreshCw, ArrowUpRight } from 'lucide-react';
import { JinjuRegionMap } from '../../common/JinjuRegionMap';
import { regions, regionById, carbonSource, boundarySource, knownPlaces, emptyRegionStat, type RegionSummary } from '../../../lib/jinjuRegions';
import { rpc } from '../../../lib/backend';
import { useApp } from '../../../context/AppContext';
import { CarbonGoal } from '../CarbonGoal';

const categories = [{id:'life',name:'생활',color:'#10b981'},{id:'food',name:'음식',color:'#f59e0b'},{id:'transport',name:'이동',color:'#38bdf8'},{id:'resource',name:'자원',color:'#a78bfa'}];
export function MapTab() {
  const { user, participations, challenges, setSelectedChallenge } = useApp();
  const [days, setDays] = useState(30);
  const [scope, setScope] = useState('mine');
  const [data, setData] = useState<RegionSummary | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);
  const [selected, setSelected] = useState('4817074000');
  const [placeDistrict, setPlaceDistrict] = useState('');
  useEffect(() => {
    let cancelled = false;
    setLoading(true);setError('');setData(null);
    rpc<RegionSummary>('gs_region_map',{p_days:days,p_mine:scope==='mine'})
      .then(v=>{if(!cancelled)setData(v);})
      .catch(()=>{if(!cancelled)setError('실천 기록을 불러오지 못했어요. 새로고침해주세요. 공식 통계와 지도는 계속 볼 수 있어요.');})
      .finally(()=>{if(!cancelled)setLoading(false);});
    return ()=>{cancelled=true;};
  }, [days,scope,reload,user.id,participations]);
  const region = regionById(selected)!;
  const searchDistrict = region.members.includes(placeDistrict) ? placeDistrict : region.members[0];
  const stat = data?.regions.find(r=>r.id===selected) ?? emptyRegionStat(selected);
  const distribution = categories.map(c=>({...c,count:stat.challenges.reduce((sum,row)=>sum+(challenges.find(ch=>ch.id===row.id)?.category===c.id?row.count:0),0)}));
  const places = knownPlaces.filter(p=>p.region===selected);
  const recommended = challenges.filter(c=>c.active).map(c=>({challenge:c,
    score:(c.officialIncentiveId==='zero-leftover-meal'?5:0)+(c.category===(region.members.length>1?'resource':'life')?3:0)-(stat.challenges.find(row=>row.id===c.id)?.count??0),
  })).sort((a,b)=>b.score-a.score).slice(0,3);
  const difference = stat.actions-stat.previous;
  const suppressed = scope==='all' && !!data && !data.regions.some(r=>r.id===selected);
  return <div className="space-y-4 p-4 pb-8">
    <header className="rounded-3xl bg-gradient-to-br from-emerald-900 to-teal-700 p-5 text-white">
      <p className="text-[10px] tracking-widest text-emerald-200">GREENSTEP · JINJU</p>
      <h2 className="mt-2 flex items-center gap-2 text-xl font-black"><MapPinned size={22}/>우리 동네 탄소 지도</h2>
      <p className="mt-2 text-xs text-emerald-50">지역을 누르고, 할 수 있는 실천을 찾아보세요.</p>
    </header>
    <section className="rounded-2xl border border-slate-100 bg-white p-4">
      <div className="flex justify-between"><h3 className="text-sm font-bold">진주시 공식 탄소 기준</h3><span className="rounded-full bg-slate-100 px-2 py-1 text-[9px]">실시간 측정 아님</span></div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div><p className="text-[10px] text-slate-500">2018년 기준 총배출량</p><strong className="text-xl text-slate-800">2,125.7</strong><span className="ml-1 text-[10px]">천 tCO₂eq</span></div>
        <div><p className="text-[10px] text-slate-500">2030년 목표배출량</p><strong className="text-xl text-emerald-700">1,266.9</strong><span className="ml-1 text-[10px]">천 tCO₂eq</span></div>
      </div>
      <p className="mt-3 text-[10px] leading-relaxed text-slate-500">기본계획의 지자체 관리권한 범위 · 2030년 목표는 순배출량 기준. 읍면동별로 임의 배분하지 않으며 앱 인증으로 이 공식 수치를 변경하지 않습니다.</p>
      <a href={carbonSource} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-emerald-700 underline">진주시 탄소중립지원센터 출처 ↗</a>
    </section>
    <CarbonGoal participations={participations} userId={user.id}/>
    <div className="flex gap-2">
      <select aria-label="집계 대상" value={scope} onChange={e=>setScope(e.target.value)} className="min-w-0 flex-1 rounded-xl border bg-white p-2.5 text-xs"><option value="mine">나의 실천</option><option value="all">함께한 실천</option></select>
      <select aria-label="집계 기간" value={days} onChange={e=>setDays(Number(e.target.value))} className="rounded-xl border bg-white p-2.5 text-xs"><option value={7}>최근 7일</option><option value={30}>최근 30일</option><option value={365}>최근 1년</option></select>
      <button aria-label="새로고침" disabled={loading} onClick={()=>setReload(v=>v+1)} className="rounded-xl bg-white p-2.5"><RefreshCw size={16}/></button>
    </div>
    {error&&<p role="alert" className="rounded-xl bg-rose-50 p-3 text-xs text-rose-700">{error}</p>}
    {loading&&<p role="status" className="text-xs text-slate-500">실천 기록 불러오는 중…</p>}
    <JinjuRegionMap selected={selected} onSelect={setSelected} stats={data?.regions}/>
    <label className="block text-xs font-bold text-slate-600">지역 빠르게 선택
      <select value={selected} onChange={e=>setSelected(e.target.value)} className="mt-2 w-full rounded-xl border bg-white p-3">{regions.map(r=><option key={r.id} value={r.id}>{r.name}{r.members.length>1?` (${r.members.join('·')})`:''}</option>)}</select>
    </label>
    <section className="space-y-4 rounded-3xl bg-white p-5">
      <div><h3 className="text-lg font-black text-emerald-900">{region.name}</h3><p className="mt-1 text-xs text-slate-500">{region.members.join(' · ')}{region.members.length>1?' · 앱 표시용 통합권역':''}</p></div>
      <div className="rounded-2xl bg-emerald-50 p-4">
        <p className="text-xs font-bold text-emerald-800">이 지역에서 쌓은 감축 추정량 · {scope==='mine'?'내 기록':'공개 집계'}</p>
        <div className="mt-2 flex items-baseline gap-2"><strong className="text-3xl text-emerald-800">{data&&!suppressed?stat.estimated.toFixed(3):'—'}</strong><span className="text-xs">kg CO₂e</span></div>
        <p className="mt-2 text-[10px] leading-relaxed text-slate-600">선택한 최근 {days}일의 인증 중 계산 근거가 있는 기록만 합산합니다. 읍면동별 공식 목표가 확인되지 않아 지역 잔여량은 표시하지 않습니다.</p>
        {data&&!suppressed&&<p className="mt-2 text-xs font-bold">감축 추정 {stat.estimated.toFixed(3)}kg · 산출 가능 {stat.measured}건 / 인증 {stat.actions}건</p>}
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-500">이전 {days}일 대비 인증</p><strong className="mt-1 block">{!data||suppressed?'—':`${difference>0?'+':''}${difference}건`}</strong><p className="mt-1 text-[9px] text-slate-500">현재 기간은 오늘 진행분 포함</p></div>
        <div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-500">데이터 상태</p><strong className="mt-1 block">{!data?(error?'연결 오류':'불러오는 중'):suppressed?'미공개 / 기록 없음':stat.actions===0?'아직 기록 없음':stat.actions<10?'초기 기록':'기록 축적 중'}</strong></div>
      </div>
      <p className="text-[10px] text-slate-500">기록은 앱 이용자의 활동 표본이며 지역 전체를 대표하지 않습니다. 공식 지역별 배출량은 미확보 상태입니다.</p>
      <div><h4 className="text-sm font-bold">활동 종류별 비중</h4>
        {data&&!suppressed&&stat.actions>0?<div className="mt-3 space-y-2">{distribution.map(c=><div key={c.id} className="flex items-center gap-2 text-xs"><span className="w-8">{c.name}</span><div className="h-2 flex-1 rounded bg-slate-100"><div className="h-2 rounded" style={{width:`${100*c.count/stat.actions}%`,backgroundColor:c.color}}/></div><span className="w-20 text-right">{c.count}건 · {Math.round(100*c.count/stat.actions)}%</span></div>)}</div>:<p className="mt-2 text-xs text-slate-500">공개 가능한 인증이 쌓이면 활동 비중을 보여드려요.</p>}
      </div>
    </section>
    <section className="space-y-3 rounded-3xl bg-white p-5">
      <h3 className="font-bold">이 지역 실천 장소</h3>
      {places.map(p=><a key={p.name} href={p.url} target="_blank" rel="noreferrer" className="block rounded-xl bg-emerald-50 p-3"><strong className="text-sm">{p.name} ↗</strong><p className="mt-1 text-xs">{p.address}</p><p className="mt-1 text-xs text-slate-600">{p.activity}</p><span className="text-[9px] text-slate-500">진주시 공식 안내 · 혜택 제휴 장소 아님</span></a>)}
      {!places.length&&<p className="text-xs text-slate-500">확인된 장소 목록은 아직 준비 중이에요. 외부 지도에서 실제 운영 여부를 확인해주세요.</p>}
      {region.members.length>1&&<label className="block text-xs">장소를 찾을 읍·면<select className="ml-2 rounded-lg border p-2" value={searchDistrict} onChange={e=>setPlaceDistrict(e.target.value)}>{region.members.map(name=><option key={name}>{name}</option>)}</select></label>}
      <div className="flex flex-wrap gap-2">{['공원','카페','재활용'].map(word=><a key={word} href={`https://map.kakao.com/?q=${encodeURIComponent(`진주시 ${searchDistrict} ${word}`)}`} target="_blank" rel="noreferrer" className="rounded-full border px-3 py-2 text-xs">{searchDistrict} {word} 찾기 ↗</a>)}</div>
      <p className="text-[10px] text-slate-500">검색 결과는 참여기업·보상 가능 매장으로 검증된 목록이 아닙니다.</p>
    </section>
    <section className="space-y-3">
      <h3 className="px-1 font-bold">이어서 해볼 실천</h3>
      <p className="px-1 text-[10px] text-slate-500">도심·읍면의 활동 유형과 선택한 집계의 실천 기록을 참고한 추천입니다. 장소별 참여 조건은 상세 안내에서 확인하세요.</p>
      {recommended.map(({challenge:c})=><button key={c.id} onClick={()=>setSelectedChallenge(c)} className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left"><span className="text-2xl">{c.categoryIcon}</span><div className="flex-1"><strong className="text-xs">{c.title}</strong><p className="mt-1 text-[10px] text-slate-500">{c.officialIncentiveId==='zero-leftover-meal'?'잔반 무게를 입력하면 감축량 추정 가능':'인증 후 활동·포인트 기록'}</p></div><ArrowUpRight size={16}/></button>)}
    </section>
    <details className="rounded-2xl bg-slate-100 p-4 text-[10px] leading-relaxed text-slate-600">
      <summary className="cursor-pointer text-xs font-bold">지도 출처와 집계 기준</summary>
      <p className="mt-2">14개 동 + 인접한 읍면 5개 권역입니다. 통합은 앱 표시용이며 행정구역 변경이 아닙니다. 경계는 2026-10-01 버전으로 단순화했습니다.</p>
      <p className="mt-2">원자료: 통계청 SGIS(공공누리 제1유형), 가공: vuski/admdongkor(CC BY 4.0). GreenStep에서 진주시 추출·읍면 통합·도형 단순화를 했습니다.</p>
      <a className="underline" href={boundarySource} target="_blank" rel="noreferrer">경계 출처</a> · <a className="underline" href="https://sgis.kostat.go.kr" target="_blank" rel="noreferrer">SGIS</a>
      <p className="mt-2">함께한 실천은 활동 공개 회원만 포함하며 소규모 집계를 숨깁니다. 지역 미등록 {data?.unmapped??'—'}건 / 비공개 집계 {data?.hidden??'—'}건. 기존 약 1km 위치 기록은 새 권역에 임의 배정하지 않습니다.</p>
      <p className="mt-2">감축량은 현재 지원되는 잔반 측정값과 제공된 창원시 계수에 따른 추정치입니다. AI는 입력 무게를 검증하지 않으며, 포인트를 CO₂로 환산하지 않습니다.</p>
    </details>
  </div>;
}
