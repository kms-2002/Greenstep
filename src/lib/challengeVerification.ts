import { backend } from './backend';
export async function verificationRequest(body: object) {
  const {data,error}=await backend.functions.invoke('greenstep-ai',{body});
  if(error){
    let message='사진 인증 서버에 연결하지 못했습니다.';
    try { message=(await error.context.json()).error||message; } catch { /* Network failure has no JSON response. */ }
    throw new Error(message);
  }
  return data;
}
