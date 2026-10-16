import { createClient } from '@supabase/supabase-js';
import type { Participation, User } from '../types';
import { calculateTreeInfo } from '../utils/carbonCalculator';

// Public project credentials; authorization is enforced by Auth and database policies.
export const backend = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://dfgdtvgpnsyjhnsttibs.supabase.co',
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_8ackbhnMEYvM7He_JNJOsA_jqPjJGln',
);
export async function rpc<T = any>(name: string, args = {}): Promise<T> {
  const { data, error } = await backend.rpc(name, args);
  if (error) throw new Error(error.message);
  return data as T;
}
export type Member = {
  id: string; nickname: string; memberType: 'student' | 'citizen'; university: string;
  department: string; profileAvatarId: string; points: number; carbonReduction: number;
  isFriend: boolean; shareActivity: boolean;
};
export const emptyUser: User = {
  id: '', nickname: '', university: '', department: '', grade: '', points: 0, level: 1,
  totalCarbonReduction: 0, todayCarbonReduction: 0, weekCarbonReduction: 0,
  consecutiveDays: 0, lastActiveDate: '',
};
export const koreanDay = (date = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year:'numeric', month:'2-digit', day:'2-digit' }).format(date);
export function mapParticipation(row: any): Participation {
  return { id:row.id,userId:row.user_id,challengeId:row.challenge_id,status:row.status,
    joinedAt:row.joined_at,completedAt:row.completed_at,carbonSaved:Number(row.carbon_saved),
    pointsEarned:row.points,carbonEstimate:row.carbon_estimate };
}
async function accountRows(table: string, columns: string, id: string) {
  const rows: any[]=[];
  for(let offset=0;;offset+=500){
    const {data,error}=await backend.from(table).select(columns).eq('user_id',id).order('id').range(offset,offset+499);
    if(error)throw new Error(error.message);
    rows.push(...(data??[]));if(!data || data.length<500)return {data:rows,error:null};
  }
}
export async function loadAccount(id: string) {
  const [profile, activity, ledger] = await Promise.all([
    backend.from('gs_profiles').select('*').eq('id',id).single(),
    accountRows('gs_participations','*',id),
    accountRows('gs_points','amount',id),
  ]);
  for (const result of [profile,activity,ledger]) if (result.error) throw new Error(result.error.message);
  const p=profile.data;
  const participations=(activity.data ?? []).map(mapParticipation).sort((a,b)=>b.joinedAt.localeCompare(a.joinedAt));
  const completed=participations.filter(p=>p.status==='completed');
  const today=koreanDay();
  const start=new Date(today+'T12:00:00+09:00'); start.setUTCDate(start.getUTCDate()-((start.getUTCDay()+6)%7));
  const total=completed.reduce((sum,p)=>sum+p.carbonSaved,0);
  const days=new Set(completed.map(p=>koreanDay(new Date(p.completedAt!))));
  let consecutiveDays=0;
  let day=new Date(today+'T12:00:00+09:00');
  if(!days.has(today)) day.setUTCDate(day.getUTCDate()-1);
  while(days.has(koreanDay(day))){consecutiveDays++;day.setUTCDate(day.getUTCDate()-1);}
  const user: User={...emptyUser,id,nickname:p.nickname,memberType:p.member_type,university:p.university,
    college:p.college,department:p.department,grade:p.grade,studentId:p.student_id,profileAvatarId:p.avatar_id,
    shareActivity:p.share_activity,points:(ledger.data??[]).reduce((sum,r)=>sum+r.amount,0),
    totalCarbonReduction:total,todayCarbonReduction:completed.filter(p=>koreanDay(new Date(p.completedAt!))===today).reduce((s,p)=>s+p.carbonSaved,0),
    weekCarbonReduction:completed.filter(p=>new Date(p.completedAt!)>=new Date(koreanDay(start)+'T00:00:00+09:00')).reduce((s,p)=>s+p.carbonSaved,0),
    level:calculateTreeInfo(total).level,consecutiveDays,lastActiveDate:[...days].sort().at(-1)??''};
  return {user,participations};
}
