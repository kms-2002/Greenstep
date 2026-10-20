import { useEffect, useRef, useState } from 'react';
import { CalendarCheck2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function AttendanceModal(){
  const {isAttendanceOpen,setIsAttendanceOpen,attendance,attendanceError,refreshAttendance,checkIn}=useApp();
  const [month,setMonth]=useState('');
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('');
  const [error,setError]=useState('');
  const panel=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if(!isAttendanceOpen)return;
    setMessage('');setError('');setMonth('');
    const prior=document.activeElement as HTMLElement|null;
    panel.current?.focus();void refreshAttendance();
    const timer=window.setInterval(()=>void refreshAttendance(),60000);
    return ()=>{window.clearInterval(timer);prior?.focus();};
  },[isAttendanceOpen,refreshAttendance]);
  if(!isAttendanceOpen)return null;
  const selected=month || attendance.today.slice(0,7);
  const [year,number]=selected.split('-').map(Number);
  const first=selected?new Date(year,number-1,1).getDay():0;
  const count=selected?new Date(year,number,0).getDate():0;
  const days=new Set(attendance.days);
  const done=days.has(attendance.today);
  const monthly=attendance.days.filter(d=>d.startsWith(selected)).length;
  const move=(offset:number)=>{
    const date=new Date(year,number-1+offset,1);
    setMonth(`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`);
  };
  return <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
    <div ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="attendance-title"
      onKeyDown={e=>{
        if(e.key==='Escape')setIsAttendanceOpen(false);
        if(e.key==='Tab'){
          const buttons=panel.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
          if(!buttons?.length)return;
          const first=buttons[0],last=buttons[buttons.length-1];
          if(e.shiftKey&&(document.activeElement===first||document.activeElement===panel.current)){e.preventDefault();last.focus();}
          else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
        }
      }} className="w-full max-w-sm max-h-[85vh] overflow-y-auto rounded-3xl bg-white shadow-2xl outline-none">
      <div className="p-5 bg-gradient-to-br from-emerald-700 to-teal-800 text-white">
        <div className="flex items-center justify-between">
          <h2 id="attendance-title" className="font-extrabold flex items-center gap-2"><CalendarCheck2 size={20}/>오늘의 출석 체크</h2>
          <button aria-label="출석 팝업 닫기" onClick={()=>setIsAttendanceOpen(false)} className="p-2 rounded-full hover:bg-white/20"><X size={18}/></button>
        </div>
        <p className="mt-2 text-xs text-emerald-100">매일 한 번, 초록 습관을 채워보세요.</p>
        <div className="flex gap-3 mt-4">
          <div className="flex-1 rounded-2xl bg-white/15 p-3 text-xs">이번 달 <strong className="block mt-1 text-xl">{monthly}일</strong></div>
          <div className="flex-1 rounded-2xl bg-white/15 p-3 text-xs">누적 출석 <strong className="block mt-1 text-xl">{days.size}일</strong></div>
        </div>
      </div>
      <div className="p-5 space-y-4">
        {selected&&<><div className="flex justify-between items-center">
          <button aria-label="이전 달" onClick={()=>move(-1)} className="p-2"><ChevronLeft size={18}/></button>
          <h3 className="font-bold text-sm">{year}년 {number}월</h3>
          <button aria-label="다음 달" disabled={selected>=attendance.today.slice(0,7)} onClick={()=>move(1)} className="p-2 disabled:opacity-20"><ChevronRight size={18}/></button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {'일월화수목금토'.split('').map(d=><span key={d} className="text-slate-400 py-1">{d}</span>)}
          {Array.from({length:first},(_,i)=><span key={`empty-${i}`}/>)}
          {Array.from({length:count},(_,i)=>{
            const day=`${selected}-${String(i+1).padStart(2,'0')}`;
            return <div key={day} aria-label={`${i+1}일 ${days.has(day)?'출석 완료':day===attendance.today?'오늘':''}`} className={`aspect-square rounded-xl flex flex-col justify-center items-center ${days.has(day)?'bg-emerald-100 text-emerald-800 font-bold':day===attendance.today?'border-2 border-emerald-500':'bg-slate-50 text-slate-500'}`}>
              {i+1}{days.has(day)&&<span className="text-[10px]">✓</span>}
            </div>;
          })}
        </div></>}
        <p className="text-xs text-slate-500 leading-relaxed">누적 1 · 3 · 7 · 14 · 30 · 100일에 출석 배지를 획득해요. 한국 시간 자정에 다음 출석이 열립니다.</p>
        {(error||attendanceError)&&<div role="alert" className="text-xs text-red-700">{error||attendanceError}<button className="ml-2 underline" onClick={()=>void refreshAttendance()}>다시 불러오기</button></div>}
        {message&&<p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-800">{message}</p>}
        <button disabled={busy||done||!attendance.today||!!attendanceError} onClick={async()=>{
          if(busy)return;setBusy(true);setError('');
          try{await checkIn();setMessage('출석 완료! 오늘의 초록 도장을 찍었어요 🌱');}
          catch{setError('출석을 저장하지 못했습니다. 다시 시도해주세요.');}
          finally{setBusy(false);}
        }} className="w-full rounded-2xl bg-emerald-600 text-white font-bold py-3 disabled:bg-slate-200 disabled:text-slate-500">
          {busy?'출석 저장 중…':done?'오늘 출석 완료 ✓':'오늘 출석하기'}
        </button>
      </div>
    </div>
  </div>;
}
