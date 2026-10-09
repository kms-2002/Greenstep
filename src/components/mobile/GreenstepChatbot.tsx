import React, { useEffect, useRef, useState } from 'react';
import { CircleHelp, RotateCcw, Send, Type, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getChallengeRewardPoints } from '../../lib/challengeRewards';

type ChatMessage = { id: number; role: 'assistant' | 'user'; text: string };
type GeminiHistoryItem = { role: 'user' | 'model'; text: string };

const welcomeMessage: ChatMessage = {
  id: 1,
  role: 'assistant',
  text: '안녕! 진주시 마스코트 하모야 🦦\n챌린지와 포인트, 나무 성장에 대해 궁금한 점을 물어봐!',
};

const functionUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '');
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const GreenstepChatbot: React.FC = () => {
  const { user, challenges, participations, setActiveTab } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isLargeText, setIsLargeText] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [isOpen, messages, isSending]);

  const sendMessage = async (value: string) => {
    const question = value.trim();
    if (!question || isSending) return;

    const userMessage: ChatMessage = { id: Date.now(), role: 'user', text: question };
    const conversation = [...messages, userMessage];
    setMessages(conversation);
    setDraft('');
    setIsSending(true);

    try {
      if (!functionUrl || !publishableKey) {
        throw new Error('Supabase 연결 정보가 설정되지 않았습니다. .env.local 파일을 확인해 주세요.');
      }

      const history: GeminiHistoryItem[] = conversation
        .filter((message) => message.id !== welcomeMessage.id)
        .slice(0, -1)
        .slice(-12)
        .map((message) => ({ role: message.role === 'assistant' ? 'model' : 'user', text: message.text }));

      const response = await fetch(`${functionUrl}/functions/v1/greenstep-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: publishableKey,
          Authorization: `Bearer ${publishableKey}`,
        },
        body: JSON.stringify({
          message: question,
          history,
          profile: {
            nickname: user.nickname,
            memberType: user.memberType,
            university: user.university,
            department: user.department,
            points: user.points,
            consecutiveDays: user.consecutiveDays,
            totalCarbonReduction: user.totalCarbonReduction,
          },
          activities: participations
            .filter((participation) => participation.status === 'completed')
            .slice(0, 20)
            .map((participation) => ({
              title: challenges.find((challenge) => challenge.id === participation.challengeId)?.title ?? '친환경 실천',
              completedAt: participation.completedAt,
              pointsEarned: participation.pointsEarned,
            })),
          challenges: challenges
            .filter((challenge) => challenge.active)
            .slice(0, 30)
            .map((challenge) => ({
              title: challenge.title,
              category: challenge.categoryName,
              points: getChallengeRewardPoints(challenge),
              description: challenge.description,
            })),
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(typeof result.error === 'string' ? result.error : `챗봇 요청에 실패했습니다 (${response.status}).`);
      }
      if (typeof result.reply !== 'string' || !result.reply.trim()) {
        throw new Error('챗봇에서 답변을 받지 못했습니다. 잠시 후 다시 시도해 주세요.');
      }
      setMessages((current) => [...current, { id: Date.now() + 1, role: 'assistant', text: result.reply }]);

      if (question.includes('친구') || question.toLowerCase().includes('qr') || question.includes('팔로우')) {
        window.setTimeout(() => setActiveTab('my'), 500);
      }
    } catch (error) {
      const errorText = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      setMessages((current) => [...current, {
        id: Date.now() + 1,
        role: 'assistant',
        text: `답변을 불러오지 못했어. ${errorText}`,
      }]);
    } finally {
      setIsSending(false);
    }
  };

  const resetConversation = () => {
    if (!isSending) setMessages([welcomeMessage]);
  };

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="AI 하모 챗봇 열기"
          className="absolute bottom-[70px] right-3 z-40 flex flex-col items-center drop-shadow-[0_4px_12px_rgba(15,23,42,0.22)] transition-transform hover:scale-105 active:scale-95"
        >
          <span className="mb-[-5px] rounded-md bg-[#559ca8] px-2 py-1 text-[10px] font-black leading-none tracking-wide text-white">Ask AI GNU!</span>
          <img src="/hamo.png" alt="하모 챗봇" className="h-[62px] w-[62px] object-contain drop-shadow-md" />
        </button>
      )}

      {isOpen && (
        <section role="dialog" aria-modal="false" aria-labelledby="greenstep-chat-title" className="absolute bottom-[72px] right-3 z-40 flex h-[58%] min-h-[350px] max-h-[490px] w-[calc(100%-24px)] max-w-[340px] flex-col overflow-hidden rounded-[28px] bg-[#aab6c7] shadow-2xl ring-1 ring-slate-900/10 animate-scaleUp">
          <header className="flex h-14 shrink-0 items-center gap-1 bg-[#4d91d0] px-3 text-white shadow-sm">
            <img src="/hamo.png" alt="" className="h-9 w-9 object-contain drop-shadow-sm" />
            <h2 id="greenstep-chat-title" className="mr-auto text-base font-extrabold">AI 하모</h2>
            <button type="button" onClick={() => setIsLargeText((value) => !value)} aria-label="글자 크기 변경" className="rounded-full p-2 hover:bg-white/15"><Type className="h-5 w-5" /></button>
            <button type="button" onClick={() => void sendMessage('GreenStep 사용법을 알려줘')} aria-label="도움말" disabled={isSending} className="rounded-full p-2 hover:bg-white/15 disabled:opacity-50"><CircleHelp className="h-5 w-5" /></button>
            <button type="button" onClick={resetConversation} aria-label="대화 초기화" disabled={isSending} className="rounded-full p-2 hover:bg-white/15 disabled:opacity-50"><RotateCcw className="h-5 w-5" /></button>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="챗봇 닫기" className="rounded-full p-2 hover:bg-white/15"><X className="h-5 w-5" /></button>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
            {messages.map((message) => message.role === 'assistant' ? (
              <div key={message.id} className="flex items-end gap-2">
                <img src="/hamo.png" alt="하모" className="h-8 w-8 shrink-0 object-contain drop-shadow-sm" />
                <p className={`max-w-[84%] whitespace-pre-line rounded-[24px] rounded-bl-md bg-white px-4 py-3 leading-relaxed text-slate-800 shadow-sm ${isLargeText ? 'text-base' : 'text-sm'}`}>{message.text}</p>
              </div>
            ) : (
              <div key={message.id} className="flex justify-end">
                <p className={`max-w-[84%] whitespace-pre-line rounded-[24px] rounded-br-md bg-[#4d91d0] px-4 py-3 leading-relaxed text-white shadow-sm ${isLargeText ? 'text-base' : 'text-sm'}`}>{message.text}</p>
              </div>
            ))}
            {isSending && <div className="ml-10 flex items-center gap-2 text-xs font-semibold text-slate-600"><span className="h-2 w-2 animate-pulse rounded-full bg-[#4d91d0]" />하모가 답변을 생각하고 있어요…</div>}
            {messages.length === 1 && <div className="ml-10 flex flex-wrap gap-2">
              {['챌린지 추천해줘', '포인트 기준 알려줘', '내 활동 분석해줘'].map((prompt) => <button key={prompt} type="button" disabled={isSending} onClick={() => void sendMessage(prompt)} className="rounded-full border border-white/70 bg-white/80 px-3 py-2 text-[11px] font-bold text-slate-700 shadow-sm hover:bg-white disabled:opacity-50">{prompt}</button>)}
            </div>}
          </div>

          <form onSubmit={(event) => { event.preventDefault(); void sendMessage(draft); }} className="shrink-0 bg-white px-3 pb-3 pt-2" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-inner focus-within:border-blue-400">
              <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="메시지 보내기" aria-label="메시지 보내기" disabled={isSending} className={`min-w-0 flex-1 bg-transparent text-slate-800 outline-none placeholder:text-slate-400 ${isLargeText ? 'text-base' : 'text-sm'}`} />
              <button type="submit" disabled={!draft.trim() || isSending} aria-label="메시지 전송" className="rounded-full bg-[#4d91d0] p-2 text-white transition-opacity disabled:opacity-40"><Send className="h-4 w-4" /></button>
            </div>
            <p className="mt-2 text-center text-[10px] text-slate-500">Gemini AI · GreenStep 맞춤 안내</p>
          </form>
        </section>
      )}
    </>
  );
};
