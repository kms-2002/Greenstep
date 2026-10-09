import React, { useEffect, useRef, useState } from 'react';
import { CircleHelp, RotateCcw, Send, Type, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getChallengeRewardPoints } from '../../lib/challengeRewards';
import { calculateTreeInfo } from '../../utils/carbonCalculator';

type ChatMessage = { id: number; role: 'assistant' | 'user'; text: string };

const welcomeMessage: ChatMessage = {
  id: 1,
  role: 'assistant',
  text: '안녕! 진주시 마스코트 하모야 🦦\n챌린지와 포인트, 나무 성장에 대해 궁금한 점을 물어봐!',
};

export const GreenstepChatbot: React.FC = () => {
  const { user, challenges, setActiveTab } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isLargeText, setIsLargeText] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [isOpen, messages]);

  const answerQuestion = (question: string) => {
    const text = question.toLowerCase();
    if (text.includes('챌린지') || text.includes('추천') || text.includes('실천')) {
      const options = challenges
        .filter((challenge) => challenge.active && challenge.officialIncentiveId)
        .sort((a, b) => getChallengeRewardPoints(b) - getChallengeRewardPoints(a))
        .slice(0, 3)
        .map((challenge) => `• ${challenge.title} (+${getChallengeRewardPoints(challenge).toLocaleString()}P)`).join('\n');
      return options
        ? `진주·GNU에서 참여할 수 있는 챌린지를 골라봤어!\n${options}\n\n포인트는 공식 활동 기준으로 계산한 참고값이며, 실제 지급은 참여기업의 실적 인정과 운영 기준을 따라.`
        : '지금 참여할 수 있는 챌린지를 불러오지 못했어. 챌린지 탭에서 확인해줘!';
    }
    if (text.includes('포인트') || text.includes('적립') || text.includes('얼마')) {
      const options = challenges
        .filter((challenge) => challenge.active && challenge.officialIncentiveId)
        .sort((a, b) => getChallengeRewardPoints(b) - getChallengeRewardPoints(a))
        .slice(0, 3)
        .map((challenge) => `${challenge.title}: ${getChallengeRewardPoints(challenge).toLocaleString()}P`).join('\n');
      return `엑셀의 공식 인센티브 단가를 기준으로 환산한 포인트야.\n${options}\n\n참여기업에서 활동을 인정받아야 하며, 실제 지급액은 운영 기준에 따라 달라질 수 있어.`;
    }
    if (text.includes('나무') || text.includes('레벨') || text.includes('성장')) {
      const tree = calculateTreeInfo(user.totalCarbonReduction);
      return `지금 ${user.nickname}님의 나무는 Lv.${tree.level} ${tree.stage.name}이야 ${tree.stage.emoji}\n나무를 누르면 Lv.1~5 새싹부터 레벨별 성장 모습을 볼 수 있어!`;
    }
    if (text.includes('친구') || text.includes('qr') || text.includes('팔로우')) {
      return '마이페이지의 친구 영역에서 친구 찾기, QR 초대, 친구 목록을 이용할 수 있어. 아래 버튼으로 바로 이동할게!';
    }
    if (text.includes('도움') || text.includes('뭐') || text.includes('기능')) {
      return '챌린지 추천, 엑셀 기준 포인트 안내, 나의 나무 성장, 친구 추가 방법을 도와줄 수 있어. 아래 질문을 눌러보거나 직접 입력해줘!';
    }
    return '아직은 GreenStep 챌린지와 포인트 정보를 중심으로 답하고 있어. “챌린지 추천”, “포인트 기준”, “내 나무 레벨”처럼 물어봐줘!';
  };

  const sendMessage = (value: string) => {
    const question = value.trim();
    if (!question) return;
    const answer = answerQuestion(question);
    setMessages((current) => [
      ...current,
      { id: Date.now(), role: 'user', text: question },
      { id: Date.now() + 1, role: 'assistant', text: answer },
    ]);
    setDraft('');
    if (question.includes('친구') || question.toLowerCase().includes('qr') || question.includes('팔로우')) {
      window.setTimeout(() => setActiveTab('my'), 500);
    }
  };

  const resetConversation = () => setMessages([welcomeMessage]);

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
            <button type="button" onClick={() => sendMessage('도움말')} aria-label="도움말" className="rounded-full p-2 hover:bg-white/15"><CircleHelp className="h-5 w-5" /></button>
            <button type="button" onClick={resetConversation} aria-label="대화 초기화" className="rounded-full p-2 hover:bg-white/15"><RotateCcw className="h-5 w-5" /></button>
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
            {messages.length === 1 && <div className="ml-10 flex flex-wrap gap-2">
              {['챌린지 추천해줘', '포인트 기준 알려줘', '내 나무 레벨은?'].map((prompt) => <button key={prompt} type="button" onClick={() => sendMessage(prompt)} className="rounded-full border border-white/70 bg-white/80 px-3 py-2 text-[11px] font-bold text-slate-700 shadow-sm hover:bg-white">{prompt}</button>)}
            </div>}
          </div>

          <form onSubmit={(event) => { event.preventDefault(); sendMessage(draft); }} className="shrink-0 bg-white px-3 pb-3 pt-2" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-inner focus-within:border-blue-400">
              <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="메시지 보내기" aria-label="메시지 보내기" className={`min-w-0 flex-1 bg-transparent text-slate-800 outline-none placeholder:text-slate-400 ${isLargeText ? 'text-base' : 'text-sm'}`} />
              <button type="submit" disabled={!draft.trim()} aria-label="메시지 전송" className="rounded-full bg-[#4d91d0] p-2 text-white transition-opacity disabled:opacity-40"><Send className="h-4 w-4" /></button>
            </div>
            <p className="mt-2 text-center text-[10px] text-slate-500">GreenStep 안내 챗봇 · 자동 응답 미리보기</p>
          </form>
        </section>
      )}
    </>
  );
};
