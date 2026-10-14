import type { GreenQuizQuestion } from '../data/greenQuizGenerator';

export type DailyQuiz = GreenQuizQuestion & { personalizationLabel: string };
const inFlight = new Map<string, Promise<DailyQuiz>>();
export function readQuiz(key: string): DailyQuiz | null {
  try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
}

export function requestQuiz(key: string, context: object): Promise<DailyQuiz> {
  const cached = readQuiz(key);
  if (cached) return Promise.resolve(cached);
  const existing = inFlight.get(key);
  if (existing) return existing;
  const request = (async () => {
    const url = (import.meta.env.VITE_SUPABASE_URL || 'https://dfgdtvgpnsyjhnsttibs.supabase.co').replace(/\/$/, '');
    const keyValue = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_8ackbhnMEYvM7He_JNJOsA_jqPjJGln';
    const response = await fetch(`${url}/functions/v1/greenstep-chat`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', apikey: keyValue, Authorization: `Bearer ${keyValue}` },
      body: JSON.stringify({ ...context, mode: 'quiz' }), signal: AbortSignal.timeout(75000),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || '퀴즈를 생성하지 못했어요. 잠시 후 다시 시도해 주세요.');
    const quiz = data.quiz as DailyQuiz;
    if (!quiz || typeof quiz.id !== 'string' || !quiz.prompt || !quiz.explanation || !quiz.personalizationLabel ||
        !['general', 'transport', 'life', 'food', 'resource'].includes(quiz.category) ||
        !Array.isArray(quiz.options) || quiz.options.length !== 4 || !quiz.options.every(o => typeof o === 'string' && o.trim()) ||
        new Set(quiz.options).size !== 4 || !Number.isInteger(quiz.answerIndex) || quiz.answerIndex < 0 || quiz.answerIndex > 3 ||
        !Array.isArray(quiz.recommendedIncentiveIds)) throw new Error('AI 퀴즈 응답을 읽지 못했어요. 서버 배포 상태를 확인해 주세요.');
    localStorage.setItem(key, JSON.stringify(quiz));
    return quiz;
  })();
  inFlight.set(key, request);
  void request.finally(() => inFlight.delete(key)).catch(() => {});
  return request;
}
