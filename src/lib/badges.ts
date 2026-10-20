import type { Badge, Challenge, Participation } from '../types';
import { INITIAL_BADGES } from '../mock/initialData';
import { koreanDay } from './backend';

export type BadgeProgress=Badge & {progress:number};
const extras: Badge[]=[
  ...[3,5,10,25,100].map(n=>({id:`practice-${n}`,name:`실천 ${n}회`,description:`챌린지 인증 ${n}회 완료`,icon:n>=25?'🏆':'🌱',category:'master' as const,requirementType:'count' as const,requirementValue:n})),
  ...[1,3,7,14,30,100].map(n=>({id:`attendance-${n}`,name:n===1?'반가운 첫 출석':`출석 ${n}일`,description:`누적 ${n}일 출석 체크`,icon:n>=30?'💎':'📅',category:'starter' as const,requirementType:'attendance' as const,requirementValue:n})),
  ...[3,14,30].map(n=>({id:`streak-${n}`,name:`꾸준한 ${n}일`,description:`챌린지 ${n}일 연속 인증`,icon:'🔥',category:'streak' as const,requirementType:'streak' as const,requirementValue:n})),
  ...(['transport','life','food','resource'] as const).flatMap((category,i)=>
    [1,5,20].map(n=>({id:`${category}-${n}`,name:`${['이동','생활','음식','자원'][i]} ${n===1?'첫걸음':n+'회 달성'}`,description:`${['이동','생활','음식','자원'][i]} 분야 챌린지 ${n}회 인증`,icon:['🚌','🥤','🍽️','♻️'][i],category:'category' as const,requirementType:'count' as const,requirementValue:n,targetCategory:category}))),
];
export function badgeProgress(participations:Participation[],challenges:Challenge[],attendance:string[]):BadgeProgress[]{
  const completed=participations.filter(p=>p.status==='completed'&&p.completedAt).sort((a,b)=>a.completedAt!.localeCompare(b.completedAt!));
  const catalog=[...INITIAL_BADGES.map(b=>b.id==='badge-4'?{...b,name:'생활 실천가',description:'생활 분야 챌린지 10회 인증'}:b.id==='badge-6'?{...b,name:'친환경 이동 히어로',description:'이동 분야 챌린지 15회 인증'}:b),...extras];
  return catalog.map(b=>{
    let progress=0;let unlockedAt:string|undefined;
    if(b.requirementType==='attendance'){
      const dates=[...new Set(attendance)].sort();progress=dates.length;unlockedAt=dates[b.requirementValue-1];
    }else{
      let streak=0;let previous='';let total=0;
      for(const p of completed){
        const day=koreanDay(new Date(p.completedAt!));
        if(b.requirementType==='streak'){
          if(day===previous)continue;
          streak=previous && Date.parse(day)-Date.parse(previous)===86400000?streak+1:1;
          previous=day;progress=Math.max(progress,streak);
        }else if(b.requirementType==='carbon'){
          total+=p.carbonSaved;progress=total;
        }else if(b.requirementType==='count'){
          if(!b.targetCategory||challenges.find(c=>c.id===p.challengeId)?.category===b.targetCategory)progress++;
        }
        if(progress>=b.requirementValue && !unlockedAt)unlockedAt=day;
      }
    }
    return {...b,progress:Math.min(progress,b.requirementValue),unlockedAt};
  });
}
