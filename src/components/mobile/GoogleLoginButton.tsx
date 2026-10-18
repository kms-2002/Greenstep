import { useState } from 'react';
import { backend } from '../../lib/backend';

export function GoogleLoginButton() {
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const login=async()=>{
    if(busy)return;
    setBusy(true);setError('');
    try {
      const {error}=await backend.auth.signInWithOAuth({provider:'google',options:{
        redirectTo:new URL(import.meta.env.BASE_URL,location.origin).href,
        queryParams:{prompt:'select_account'},
      }});
      if(error)throw error;
    }catch(e){
      setError(e instanceof Error?e.message:'Google 로그인에 연결하지 못했습니다. 다시 시도해주세요.');
      setBusy(false);
    }
  };
  return <div>
    <button type="button" disabled={busy} onClick={login} className="w-full min-h-11 px-5 py-3 rounded-full border border-slate-200 bg-white text-slate-700 text-sm font-medium flex items-center justify-center gap-3 shadow-xs hover:bg-slate-50 disabled:opacity-60">
      <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#4285F4" d="M43.61 24.46c0-1.36-.12-2.66-.35-3.92H24v7.42h11a9.4 9.4 0 0 1-4.08 6.17v5.13h6.6c3.86-3.56 6.09-8.8 6.09-14.8Z"/>
        <path fill="#34A853" d="M24 44c5.5 0 10.1-1.82 13.47-4.94l-6.6-5.13c-1.82 1.22-4.15 1.96-6.87 1.96-5.3 0-9.8-3.58-11.41-8.4H5.77v5.29A20 20 0 0 0 24 44Z"/>
        <path fill="#FBBC05" d="M12.59 27.49a12 12 0 0 1 0-6.98v-5.29H5.77a20 20 0 0 0 0 17.56l6.82-5.29Z"/>
        <path fill="#EA4335" d="M24 12.11c3 0 5.68 1.03 7.8 3.05l5.85-5.85A19.6 19.6 0 0 0 24 4 20 20 0 0 0 5.77 15.22l6.82 5.29c1.61-4.82 6.11-8.4 11.41-8.4Z"/>
      </svg>
      {busy?'Google로 연결 중…':'Google로 계속하기'}
    </button>
    {error && <p role="alert" className="mt-2 text-xs text-red-700">{error}</p>}
  </div>;
}
