import { useEffect, useRef, useState } from 'react';
import { Bell, CheckCheck, MessageCircle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function NotificationModal(){
  const {inbox,notificationError,isNotificationOpen,setIsNotificationOpen,refreshNotifications,readNotifications}=useApp();
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const panel=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if(!isNotificationOpen)return;
    setError('');
    const previous=document.activeElement as HTMLElement|null;
    panel.current?.focus();void refreshNotifications();
    return ()=>previous?.focus();
  },[isNotificationOpen,refreshNotifications]);
  if(!isNotificationOpen)return null;
  const mark=async(ids:string[])=>{
    if(busy)return;setBusy(true);setError('');
    try{await readNotifications(ids);}catch{setError('읽음 상태를 저장하지 못했어요. 다시 시도해주세요.');}finally{setBusy(false);}
  };
  return <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
    <div ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="notification-title"
      onKeyDown={e=>{
        if(e.key==='Escape')setIsNotificationOpen(false);
        if(e.key==='Tab'){
          const nodes=panel.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');if(!nodes?.length)return;
          if(e.shiftKey&&(document.activeElement===nodes[0]||document.activeElement===panel.current)){e.preventDefault();nodes[nodes.length-1].focus();}
          else if(!e.shiftKey&&document.activeElement===nodes[nodes.length-1]){e.preventDefault();nodes[0].focus();}
        }
      }} className="w-full max-w-md rounded-3xl bg-slate-50 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] outline-none">
      <div className="bg-white p-4 border-b border-slate-100 flex justify-between items-center">
        <div><h2 id="notification-title" className="font-extrabold text-slate-900 flex gap-2 items-center"><Bell size={18}/>활동 알림</h2>
          <p className="text-xs text-slate-500 mt-1">읽지 않은 메시지 {inbox.unread}개</p></div>
        <button aria-label="알림 닫기" onClick={()=>setIsNotificationOpen(false)} className="p-2 rounded-full hover:bg-slate-100"><X size={20}/></button>
      </div>
      <div className="p-4 overflow-y-auto space-y-4">
        {(error||notificationError)&&<p role="alert" className="rounded-xl bg-red-50 p-3 text-xs text-red-700">{error||notificationError}<button onClick={()=>void refreshNotifications()} className="underline ml-2">다시 불러오기</button></p>}
        {inbox.items.length===0&&!notificationError&&<div className="py-12 text-center text-slate-500">
          <MessageCircle className="mx-auto mb-3 text-emerald-400" size={36}/>
          <p className="font-bold text-sm text-slate-700">아직 도착한 알림이 없어요</p>
          <p className="mt-2 text-xs leading-relaxed">출석을 완료하거나 챌린지·퀴즈 포인트가<br/>적립되면 여기에 메시지가 도착해요.</p>
        </div>}
        {inbox.items.length>0&&<div className="flex justify-end"><button disabled={busy||!inbox.items.some(n=>!n.read_at)} onClick={()=>void mark(inbox.items.filter(n=>!n.read_at).map(n=>n.id))} className="text-xs text-emerald-700 font-bold flex gap-1 items-center disabled:opacity-40"><CheckCheck size={14}/>표시된 메시지 읽음 처리</button></div>}
        {inbox.items.map(n=><article key={n.id} className="flex items-start gap-2">
          <div className="shrink-0 w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-lg" aria-hidden="true">🌱</div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold text-slate-600 mb-1">GreenStep { !n.read_at&&<span className="text-emerald-700 ml-1">NEW</span>}</p>
            <div className={`rounded-2xl rounded-tl-sm border p-3 shadow-xs ${n.read_at?'bg-white border-slate-100':'bg-emerald-50 border-emerald-200'}`}>
              <h3 className="text-sm font-extrabold text-slate-800">{n.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-700 break-words">{n.body}</p>
              {!n.read_at&&<button disabled={busy} onClick={()=>void mark([n.id])} className="mt-2 text-xs font-bold text-emerald-700 disabled:opacity-40">읽음 확인 ✓</button>}
            </div>
            <time dateTime={n.created_at} className="block mt-1 text-[10px] text-slate-400">{new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',month:'long',day:'numeric',hour:'numeric',minute:'2-digit'}).format(new Date(n.created_at))}</time>
          </div>
        </article>)}
      </div>
      <p className="bg-white border-t px-4 py-3 text-[10px] text-slate-400">미확인 메시지 우선 · 최대 100개 · 앱 내 활동 알림</p>
    </div>
  </div>;
}
