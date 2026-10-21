import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export function HomeRanking() {
  const { user, members, refreshMembers } = useApp();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    refreshMembers().catch(() => { if (active) setError('랭킹을 불러오지 못했습니다. 다시 시도해주세요.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [refreshMembers, attempt]);
  const sorted = [...members].sort((a, b) => b.points - a.points || a.nickname.localeCompare(b.nickname));
  const rank = (points: number) => sorted.findIndex(member => member.points === points) + 1;
  const me = sorted.find(member => member.id === user.id);
  return <section className="space-y-3" aria-label="전체 포인트 랭킹">
    <h3 className="flex gap-2 items-center font-black text-slate-900"><Trophy className="w-5 h-5 text-emerald-600" />전체 랭킹</h3>
    <p className="text-xs text-slate-500">가입자의 포인트 기준 · 같은 포인트는 공동 순위</p>
    {loading ? <p role="status" className="py-6 text-center text-sm">랭킹 불러오는 중…</p> : error ?
      <div role="alert" className="text-sm text-red-700">{error}<button onClick={() => setAttempt(value => value + 1)} className="block mt-2 underline">다시 불러오기</button></div> : <>
        {me && <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800 font-bold">내 순위 {rank(me.points)}위 <span className="float-right">{me.points.toLocaleString()} P</span></div>}
        {sorted.length === 0 && <p className="py-5 text-sm text-slate-500">아직 표시할 랭킹이 없습니다.</p>}
        <ol className="max-h-72 overflow-y-auto space-y-2">
          {sorted.map(member => <li key={member.id} className={`flex items-center gap-3 rounded-xl p-3 text-sm ${member.id === user.id ? 'bg-emerald-50' : 'bg-slate-50'}`}>
            <span className="font-black text-emerald-700 shrink-0">{rank(member.points)}위</span>
            <span className="flex-1 min-w-0 truncate font-bold">{member.nickname}{member.id === user.id && ' (나)'}</span>
            <span className="shrink-0 text-slate-600">{member.points.toLocaleString()} P</span>
          </li>)}
        </ol>
      </>}
  </section>;
}
