import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { useApp } from '../../../context/AppContext';
import { rpc, type Member } from '../../../lib/backend';
import type { User } from '../../../types';
import type { IScannerControls } from '@zxing/browser';

export const FriendsPanel: React.FC<{user:User}>=({user})=>{
  const {members,refreshMembers,updateProfile}=useApp();
  const [token,setToken]=useState('');const [image,setImage]=useState('');
  const [code,setCode]=useState(()=>sessionStorage.getItem('greenstep_pending_invite')||'');
  const [candidate,setCandidate]=useState<Member|null>(null);
  const [candidateToken,setCandidateToken]=useState('');
  const [message,setMessage]=useState('');const [busy,setBusy]=useState(false);
  const [scanning,setScanning]=useState(false);const video=useRef<HTMLVideoElement>(null);
  const [activity,setActivity]=useState<{name:string;rows:{title:string;completed_at:string;points:number}[]}|null>(null);
  const friends=members.filter(m=>m.isFriend);
  const preview=async(raw:string)=>{
    setBusy(true);setMessage('');setCandidate(null);
    try{
      let value=raw.trim();try{value=new URL(value).searchParams.get('invite')||'';}catch{/* Raw invite code. */}
      if(!/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(value))throw new Error('올바른 친구 초대 링크 또는 코드를 입력해주세요.');
      const person=await rpc<Member>('gs_invite_preview',{p_token:value});
      if(person.id===user.id)throw new Error('내 QR은 추가할 수 없어요.');
      setCandidate(person);setCandidateToken(value);
    }catch(e){setMessage((e as Error).message);}finally{setBusy(false);}
  };
  useEffect(()=>{
    let active=true;
    rpc<string>('gs_invite').then(t=>{if(active)setToken(t);}).catch(e=>{if(active)setMessage(e.message);});
    const pending=sessionStorage.getItem('greenstep_pending_invite');if(pending)void preview(pending);
    return()=>{active=false;};
  },[user.id]);
  const invite=token?`${location.origin}${import.meta.env.BASE_URL}?invite=${token}`:'';
  useEffect(()=>{let active=true;setImage('');if(invite)QRCode.toDataURL(invite,{width:220,margin:2}).then(v=>{if(active)setImage(v);}).catch(e=>setMessage(e.message));return()=>{active=false;};},[invite]);
  useEffect(()=>{
    if(!scanning||!video.current)return;
    let cancelled=false;let controls:IScannerControls|undefined;let handled=false;
    import('@zxing/browser').then(async({BrowserQRCodeReader})=>{
      if(cancelled||!video.current)return;
      controls=await new BrowserQRCodeReader().decodeFromVideoDevice(undefined,video.current,(result,_error,c)=>{
        if(cancelled){c.stop();return;}
        if(result&&!handled){handled=true;c.stop();setScanning(false);setCode(result.getText());void preview(result.getText());}
      });if(cancelled)controls.stop();
    }).catch(()=>{if(!cancelled){setMessage('카메라를 열지 못했어요. 권한을 허용하거나 초대 코드를 붙여넣어주세요.');setScanning(false);}});
    return()=>{cancelled=true;controls?.stop();};
  },[scanning]);
  const action=async(work:()=>Promise<void>)=>{if(busy)return;setBusy(true);setMessage('');try{await work();}catch(e){setMessage((e as Error).message);}finally{setBusy(false);}};
  return <section className="space-y-4 rounded-2xl bg-white border p-4 text-sm">
    <div className="flex justify-between"><h3 className="font-bold">내 친구 {friends.length}명</h3><button disabled={busy} onClick={()=>action(refreshMembers)} className="text-emerald-700">새로고침</button></div>
    <label className="flex gap-2 text-xs"><input type="checkbox" checked={!!user.shareActivity} onChange={e=>updateProfile({shareActivity:e.target.checked})}/>친구에게 완료한 챌린지·날짜·포인트 공개</label>
    <p className="text-[11px] text-slate-500">학번·이메일·인증 사진은 공유하지 않아요. QR을 전달한 상대가 추가하면 서로 친구가 됩니다.</p>
    {friends.map(friend=><div key={friend.id} className="border-t py-3 flex justify-between gap-2"><button className="text-left" disabled={busy} onClick={()=>action(async()=>{const rows=await rpc('gs_friend_activity',{p_friend:friend.id});setActivity({name:friend.nickname,rows});})}><b>{friend.nickname}</b><p className="text-xs text-slate-500">{friend.university} · {friend.department}</p><p className="text-xs text-emerald-700">{friend.points}P · 활동 보기</p></button><button disabled={busy} className="text-xs text-slate-500" onClick={()=>action(async()=>{await rpc('gs_remove_friend',{p_friend:friend.id});setActivity(null);await refreshMembers();})}>친구 해제</button></div>)}
    {!friends.length&&<p className="py-3 text-xs text-slate-500">QR이나 초대 코드로 첫 친구를 추가해보세요.</p>}
    {activity&&<div className="rounded-xl bg-slate-50 p-3 text-xs space-y-2"><div className="flex justify-between"><b>{activity.name}의 활동</b><button onClick={()=>setActivity(null)}>닫기</button></div>{activity.rows.map((r,i)=><p key={i}>{r.title} · {new Date(r.completed_at).toLocaleDateString('ko-KR')} · {r.points}P</p>)}{!activity.rows.length&&<p>공개된 활동이 없습니다.</p>}</div>}
    <details><summary className="cursor-pointer font-bold text-emerald-700">내 친구 초대 QR</summary><div className="flex flex-col items-center py-3 gap-2">{image?<img src={image} alt="내 친구 초대 QR" width={220} height={220}/>:<p>QR 준비 중...</p>}<p className="text-xs">{user.nickname}</p><button disabled={!invite||busy} onClick={()=>action(async()=>{await navigator.clipboard.writeText(invite);setMessage('초대 링크를 복사했어요.');})}>초대 링크 복사</button><button disabled={busy} className="text-xs text-slate-500" onClick={()=>action(async()=>{setToken(await rpc<string>('gs_invite',{p_rotate:true}));setMessage('이전 초대 링크는 사용할 수 없어요.');})}>QR 재발급</button></div></details>
    <label className="block text-xs font-bold">친구 초대 링크 또는 코드<input value={code} onChange={e=>{setCode(e.target.value);setCandidate(null);}} className="mt-2 w-full border rounded-xl p-3" placeholder="친구에게 받은 링크를 붙여넣으세요" /></label>
    <div className="flex gap-2"><button disabled={busy||!code.trim()} onClick={()=>preview(code)} className="rounded-xl bg-emerald-600 text-white px-4 py-2">친구 확인</button><button disabled={busy} onClick={()=>setScanning(!scanning)} className="border rounded-xl px-4 py-2">{scanning?'카메라 닫기':'QR 스캔'}</button></div>
    {scanning&&<video ref={video} muted playsInline className="w-full rounded-xl"/>}
    {candidate&&<div className="rounded-xl bg-emerald-50 p-3"><b>{candidate.nickname}</b><p className="text-xs">{candidate.university} · {candidate.department}</p><button disabled={busy} className="mt-2 rounded-lg bg-emerald-700 px-3 py-2 text-white" onClick={()=>action(async()=>{await rpc('gs_add_friend',{p_token:candidateToken});sessionStorage.removeItem('greenstep_pending_invite');setCandidate(null);setCode('');await refreshMembers();setMessage('서로 친구가 되었어요.');})}>이 친구 추가하기</button></div>}
    {message&&<p role="status" className="text-xs text-emerald-800">{message}</p>}
  </section>;
};
