import React, { useEffect, useRef, useState } from 'react';
import { estimateCarbon, supportsWasteMeasurement } from '../../lib/carbonEstimate';
import { verificationRequest } from '../../lib/challengeVerification';
import { useApp } from '../../context/AppContext';
import { Camera, X } from 'lucide-react';

export const VerificationModal: React.FC = () => {
  const { isVerificationOpen, setIsVerificationOpen, challengeToVerify, completeCertification } = useApp();
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const generation = useRef(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [ticket, setTicket] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [ready, setReady] = useState(false);
  const [opening, setOpening] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [baseline, setBaseline] = useState('');
  const [actual, setActual] = useState('');
  const stop = () => { stream.current?.getTracks().forEach(t => t.stop()); stream.current=null; setReady(false); };
  useEffect(() => {
    generation.current++; stop(); setSelectedImage(null); setTicket(''); setSaveError(''); setOpening(false);setSaving(false);setBaseline('');setActual('');
    return () => { generation.current++; stream.current?.getTracks().forEach(t => t.stop()); stream.current=null; };
  }, [isVerificationOpen, challengeToVerify?.id]);
  useEffect(() => {
    const pause = () => { if(document.hidden){generation.current++;stop();setOpening(false);} };
    document.addEventListener('visibilitychange',pause);
    return () => document.removeEventListener('visibilitychange',pause);
  }, []);
  if (!isVerificationOpen || !challengeToVerify) return null;
  const hasMeasurement = supportsWasteMeasurement(challengeToVerify);
  const measurement = hasMeasurement && (baseline !== '' || actual !== '')
    ? { baselineGrams:Number(baseline), actualGrams:Number(actual) } : undefined;
  let measurementError=''; let preview:number|null=null;
  if(measurement){
    if(baseline===''||actual==='')measurementError='두 무게를 모두 입력하거나 모두 비워주세요.';
    else try{preview=estimateCarbon(challengeToVerify,measurement).estimatedKgCO2e;}catch(e){measurementError=(e as Error).message;}
  }
  const openCamera = async () => {
    const run=++generation.current;
    stop();setSelectedImage(null);setTicket('');setSaveError('');setOpening(true);
    try {
      if(!navigator.mediaDevices?.getUserMedia)throw new Error('HTTPS 또는 localhost에서 카메라를 사용할 수 있습니다.');
      const media=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:960}},audio:false});
      if(run!==generation.current){media.getTracks().forEach(t=>t.stop());return;}
      stream.current=media;
      const session=await verificationRequest({mode:'start',challengeId:challengeToVerify.id});
      if(run!==generation.current)return;
      setTicket(session.ticket);setExpiresAt(session.expiresAt);
      if(video.current){video.current.srcObject=media;await video.current.play();}
    } catch(e){if(run===generation.current){stop();setSaveError(e instanceof Error&&e.name==='NotAllowedError'?'카메라 사용 권한을 허용해주세요.':e instanceof Error?e.message:'카메라를 열지 못했습니다.');}}
    finally{if(run===generation.current)setOpening(false);}
  };
  const capture=()=>{
    const v=video.current;
    if(!v?.videoWidth||!ticket)return;
    if(Date.now()>new Date(expiresAt).getTime()){stop();setSaveError('촬영 시간이 만료되었습니다. 카메라를 다시 열어주세요.');return;}
    const canvas=document.createElement('canvas'); const scale=Math.min(1,1280/v.videoWidth);
    canvas.width=Math.round(v.videoWidth*scale);canvas.height=Math.round(v.videoHeight*scale);
    canvas.getContext('2d')!.drawImage(v,0,0,canvas.width,canvas.height);
    setSelectedImage(canvas.toDataURL('image/jpeg',0.8));stop();
  };
  const submit=async()=>{
    if(!selectedImage||saving||measurementError)return;
    setSaving(true);setSaveError('');
    try{await completeCertification(challengeToVerify.id,selectedImage,measurement,ticket);}
    catch(e){setSaveError(e instanceof Error?e.message:'분석하지 못했습니다. 다시 촬영해주세요.');}
    finally{setSaving(false);}
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
    <div role="dialog" aria-modal="true" aria-label="실시간 활동 사진 인증" className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
      <div className="p-4 bg-emerald-900 text-white flex items-center justify-between">
        <div><h3 className="font-bold">{challengeToVerify.title}</h3><p className="text-xs text-emerald-200">지금 촬영하고 AI로 실천 인증하기</p></div>
        <button aria-label="인증 닫기" disabled={saving} onClick={()=>setIsVerificationOpen(false)}><X/></button>
      </div>
      <div className="p-5 space-y-4">
        <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden">
          <video ref={video} autoPlay muted playsInline onLoadedData={()=>setReady(true)} className={selectedImage?'hidden':'w-full h-full object-contain'}/>
          {selectedImage&&<img src={selectedImage} alt="방금 촬영한 인증 사진" className="w-full h-full object-contain"/>}
          {!ready&&!selectedImage&&<p className="absolute inset-0 flex items-center justify-center text-sm text-white">카메라를 열어 실천 모습을 촬영해주세요</p>}
        </div>
        <p className="text-xs text-slate-500">촬영 요청은 5분 동안 유효합니다. 사진은 인증을 위해 Groq AI로 전송되며, 승인된 사진은 비공개로 저장됩니다.</p>
        <div className="flex gap-2">
          <button disabled={opening||saving} onClick={openCamera} className="flex-1 p-3 rounded-xl bg-emerald-50 text-emerald-800 font-bold disabled:opacity-50">{opening?'카메라 연결 중…':selectedImage?'다시 촬영':'카메라 열기'}</button>
          {ready&&!selectedImage&&<button onClick={capture} disabled={opening||saving} className="flex-1 p-3 rounded-xl bg-emerald-700 text-white flex items-center justify-center gap-2"><Camera size={18}/>촬영</button>}
        </div>
          {hasMeasurement && (
            <section className="rounded-xl bg-emerald-50 p-3 space-y-2 text-xs text-emerald-900">
              <h4 className="font-bold">음식물쓰레기 감축 무게 (선택)</h4>
              <p>같은 식사량·조건에서 평소 남기는 무게와 이번에 남긴 무게를 측정해 입력해주세요. 먹은 음식의 무게가 아니에요.</p>
              <label className="block">비교 기준 잔반 (g)
                <input type="number" min="0" step="any" value={baseline} onChange={e => setBaseline(e.target.value)} className="mt-1 w-full rounded-lg bg-white border p-2" placeholder="예: 200" />
              </label>
              <label className="block">실천 후 잔반 (g)
                <input type="number" min="0" step="any" value={actual} onChange={e => setActual(e.target.value)} className="mt-1 w-full rounded-lg bg-white border p-2" placeholder="예: 50" />
              </label>
              {measurementError ? <p role="alert" className="text-red-700">{measurementError}</p> : preview !== null ? <p role="status">감축 추정량: {preview} kg CO₂e</p> : <p>무게를 입력하지 않으면 CO₂는 계산하지 않고 포인트만 반영해요.</p>}
              <p className="text-[10px]">감축 무게(kg) × 1.65. 제공된 창원시 자료의 추정치이며 진주시 공인 실적이 아닙니다.</p>
            </section>
          )}
        <p className="text-xs text-slate-500">AI가 사진 속 실천을 확인한 경우에만 포인트가 적립됩니다. 거리·구매 여부 등 사진으로 확인하기 어려운 조건은 승인되지 않을 수 있습니다. 입력한 잔반 무게는 직접 측정한 값이며 AI가 검증하지 않습니다.</p>
        {saveError&&<p role="alert" className="text-sm text-red-700">{saveError}</p>}
        <button disabled={!selectedImage||saving||!!measurementError} onClick={submit} className="w-full p-3 rounded-xl bg-emerald-700 text-white font-bold disabled:bg-slate-200 disabled:text-slate-500">{saving?'AI 분석 및 포인트 반영 중…':'사진 분석하고 인증하기'}</button>
      </div>
    </div>
  </div>;
};
