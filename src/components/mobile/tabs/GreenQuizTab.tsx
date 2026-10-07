import React, { useMemo, useState } from 'react';
import { Award, Clover, CalendarCheck, CheckCircle2, CircleHelp, Flame, RotateCcw, Sparkles, Target, Zap } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { getActivityQuizCategory, generateDailyGreenQuiz } from '../../../data/greenQuizGenerator';
import type { ChallengeCategory } from '../../../types';

type QuizAnswer = { questionId: string; selectedIndex: number; correct: boolean; rewardPoints?: number; rewardMessages?: string[] };
type QuizProgress = { answers: Record<string, QuizAnswer>; rewardedStreaks: number[]; rewardedWeeks: string[] };

const STORAGE_KEY = 'greenstep_daily_quiz_v1';
const emptyProgress: QuizProgress = { answers: {}, rewardedStreaks: [], rewardedWeeks: [] };

const getKoreaDateKey = (date = new Date()) => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(date);

const shiftDay = (dayKey: string, offset: number) => {
  const [year, month, day] = dayKey.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day + offset)).toISOString().slice(0, 10);
};

const getWeekKey = (dayKey: string) => {
  const [year, month, day] = dayKey.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const firstDay = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((date.getTime() - firstDay.getTime()) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
};

const getStreak = (answers: Record<string, QuizAnswer>, startDay: string) => {
  let streak = 0;
  let day = startDay;
  while (answers[day]) {
    streak += 1;
    day = shiftDay(day, -1);
  }
  return streak;
};

const readProgress = (): QuizProgress => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return emptyProgress;
    const parsed = JSON.parse(saved) as Partial<QuizProgress>;
    return {
      answers: parsed.answers ?? {},
      rewardedStreaks: parsed.rewardedStreaks ?? [],
      rewardedWeeks: parsed.rewardedWeeks ?? [],
    };
  } catch {
    return emptyProgress;
  }
};

export const GreenQuizTab: React.FC = () => {
  const { user, updateProfile, challenges, participations, setActiveTab } = useApp();
  const [progress, setProgress] = useState<QuizProgress>(readProgress);
  const [feedback, setFeedback] = useState<{ rewards: number; messages: string[] } | null>(null);
  const today = getKoreaDateKey();
  const weekKey = getWeekKey(today);
  const todayAnswer = progress.answers[today];

  const latestActivity = useMemo(() => participations
    .filter((participation) => participation.status === 'completed' && participation.completedAt)
    .sort((a, b) => new Date(b.completedAt || b.joinedAt).getTime() - new Date(a.completedAt || a.joinedAt).getTime())
    .map((participation) => ({ participation, challenge: challenges.find((challenge) => challenge.id === participation.challengeId) }))
    .find((item) => Boolean(item.challenge)), [challenges, participations]);

  const quiz = useMemo(() => {
    const category = getActivityQuizCategory(latestActivity?.challenge?.officialIncentiveId, latestActivity?.challenge?.category as Exclude<ChallengeCategory, 'all'> | undefined);
    return generateDailyGreenQuiz(today, category, latestActivity?.challenge?.title);
  }, [today, latestActivity]);

  const currentStreak = getStreak(progress.answers, todayAnswer ? today : shiftDay(today, -1));
  const weekCount = Object.keys(progress.answers).filter((day) => getWeekKey(day) === weekKey).length;
  const recommendedChallenge = todayAnswer?.correct
    ? quiz.recommendedIncentiveIds.map((id) => challenges.find((challenge) => challenge.active && challenge.officialIncentiveId === id)).find(Boolean)
      || challenges.find((challenge) => challenge.active && challenge.category === quiz.category)
    : undefined;

  const submitAnswer = (selectedIndex: number) => {
    if (todayAnswer) return;
    const correct = selectedIndex === quiz.answerIndex;
    const answers = { ...progress.answers, [today]: { questionId: quiz.id, selectedIndex, correct } };
    const rewardedStreaks = [...progress.rewardedStreaks];
    const rewardedWeeks = [...progress.rewardedWeeks];
    const messages: string[] = [];
    let pointsEarned = 0;

    if (correct) {
      pointsEarned += 10;
      messages.push('오늘의 퀴즈 정답 +10P');
    }

    const streak = getStreak(answers, today);
    if (streak === 3 && !rewardedStreaks.includes(3)) {
      pointsEarned += 30;
      rewardedStreaks.push(3);
      messages.push('3일 연속 퀴즈 참여 +30P');
    }
    if (streak === 7 && !rewardedStreaks.includes(7)) {
      pointsEarned += 100;
      rewardedStreaks.push(7);
      messages.push('7일 연속 퀴즈 참여 +100P');
    }

    const completedThisWeek = Object.keys(answers).filter((day) => getWeekKey(day) === weekKey).length;
    if (completedThisWeek >= 5 && !rewardedWeeks.includes(weekKey)) {
      pointsEarned += 50;
      rewardedWeeks.push(weekKey);
      messages.push('이번 주 퀴즈 5개 완료 +50P');
    }

    answers[today] = { questionId: quiz.id, selectedIndex, correct, rewardPoints: pointsEarned, rewardMessages: messages };
    const nextProgress = { answers, rewardedStreaks, rewardedWeeks };
    setProgress(nextProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProgress));
    if (pointsEarned > 0) updateProfile({ points: user.points + pointsEarned });
    setFeedback({ rewards: pointsEarned, messages });
  };

  const previousAnswerCorrect = todayAnswer?.correct;

  return (
    <div className="space-y-4 p-4 pb-24 animate-fadeIn">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-800 p-5 text-white shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold"><Sparkles className="h-3 w-3" />AI 맞춤 환경 퀴즈</span>
            <h2 className="mt-3 text-xl font-black">오늘의 그린퀴즈</h2>
            <p className="mt-1 text-xs leading-relaxed text-emerald-50">{quiz.personalizationLabel}</p>
          </div>
          <div className="rounded-2xl bg-white/15 p-3"><Clover className="h-7 w-7" /></div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-white/10 p-3"><div className="flex items-center gap-1 text-[10px] text-emerald-100"><Flame className="h-3 w-3" />연속 참여</div><p className="mt-1 text-lg font-black">{currentStreak}<span className="ml-1 text-xs font-bold">일</span></p></div>
          <div className="rounded-2xl bg-white/10 p-3"><div className="flex items-center gap-1 text-[10px] text-emerald-100"><CalendarCheck className="h-3 w-3" />이번 주 완료</div><p className="mt-1 text-lg font-black">{weekCount}<span className="ml-1 text-xs font-bold">/ 5개</span></p></div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold text-emerald-700">{quiz.category === 'general' ? '환경 상식' : `${latestActivity?.challenge?.categoryName || '맞춤'} 실천 맞춤`}</span>
          <span className="text-[10px] font-semibold text-slate-400">{today.replaceAll('-', '.')}</span>
        </div>
        <h3 className="mt-4 text-base font-extrabold leading-relaxed text-slate-900">{quiz.prompt}</h3>
        <div className="mt-4 space-y-2.5">
          {quiz.options.map((option, index) => {
            const selected = todayAnswer?.selectedIndex === index;
            const isCorrectAnswer = todayAnswer && index === quiz.answerIndex;
            const isWrongSelection = selected && !todayAnswer.correct;
            return <button key={option} type="button" disabled={Boolean(todayAnswer)} onClick={() => submitAnswer(index)} className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left text-sm font-bold transition-colors ${isCorrectAnswer ? 'border-emerald-400 bg-emerald-50 text-emerald-800' : isWrongSelection ? 'border-rose-300 bg-rose-50 text-rose-700' : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50'} ${todayAnswer ? 'cursor-default' : 'cursor-pointer'}`}>
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${isCorrectAnswer ? 'bg-emerald-600 text-white' : isWrongSelection ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-500'}`}>{isCorrectAnswer ? <CheckCircle2 className="h-4 w-4" /> : String.fromCharCode(65 + index)}</span>
              {option}
            </button>;
          })}
        </div>
        {todayAnswer && <div className={`mt-4 rounded-2xl p-4 ${previousAnswerCorrect ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-900'}`}>
          <p className="flex items-center gap-1.5 text-sm font-extrabold">{previousAnswerCorrect ? <CheckCircle2 className="h-4 w-4" /> : <CircleHelp className="h-4 w-4" />}{previousAnswerCorrect ? '정답이에요!' : `아쉬워요. 정답은 ${quiz.options[quiz.answerIndex]}예요.`}</p>
          <p className="mt-1.5 text-xs leading-relaxed">{quiz.explanation}</p>
          <div className="mt-3 border-t border-current/10 pt-2 text-xs font-extrabold">{(feedback?.messages ?? todayAnswer.rewardMessages ?? []).length ? (feedback?.messages ?? todayAnswer.rewardMessages ?? []).join(' · ') : previousAnswerCorrect ? '오늘의 보상은 이미 적립되었어요.' : '퀴즈 참여 기록이 저장됐어요. 내일 다시 도전해봐요!'}</div>
        </div>}
      </section>

      {todayAnswer?.correct && recommendedChallenge && <section className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-lg">{recommendedChallenge.categoryIcon}</span><div><p className="text-[10px] font-bold text-emerald-700">오늘의 챌린지 추천</p><p className="text-sm font-extrabold text-slate-800">{recommendedChallenge.title}</p></div></div>
        <button type="button" onClick={() => setActiveTab('challenge')} className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl bg-emerald-600 py-3 text-xs font-extrabold text-white hover:bg-emerald-700"><Target className="h-4 w-4" />챌린지 보러가기</button>
      </section>}

      <section className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
        <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-800"><Award className="h-4 w-4 text-amber-500" />그린퀴즈 보상</h3>
        <div className="mt-3 divide-y divide-slate-100">
          <div className="flex items-center justify-between py-2 text-xs"><span className="text-slate-600">오늘의 퀴즈 정답</span><span className="font-extrabold text-amber-600">+10P</span></div>
          <div className="flex items-center justify-between py-2 text-xs"><span className="text-slate-600">3일 연속 참여</span><span className="font-extrabold text-amber-600">+30P</span></div>
          <div className="flex items-center justify-between py-2 text-xs"><span className="text-slate-600">7일 연속 참여</span><span className="font-extrabold text-amber-600">+100P</span></div>
          <div className="flex items-center justify-between py-2 text-xs"><span className="text-slate-600">주간 퀴즈 5개 완료</span><span className="font-extrabold text-amber-600">+50P</span></div>
        </div>
        <p className="mt-2 flex items-start gap-1.5 text-[10px] leading-relaxed text-slate-400"><Zap className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" />퀴즈는 하루 한 번 참여할 수 있어요. 연속 참여와 주간 완료 보상은 조건을 달성했을 때 자동 적립됩니다.</p>
      </section>

      {todayAnswer && <button type="button" onClick={() => setActiveTab('home')} className="flex w-full items-center justify-center gap-1.5 py-2 text-xs font-bold text-slate-500"><RotateCcw className="h-3.5 w-3.5" />홈으로 돌아가기</button>}
    </div>
  );
};
