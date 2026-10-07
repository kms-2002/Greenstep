import type { ChallengeCategory } from '../types';

export type GreenQuizQuestion = {
  id: string;
  category: Exclude<ChallengeCategory, 'all'> | 'general';
  prompt: string;
  options: [string, string, string, string];
  answerIndex: number;
  explanation: string;
  recommendedIncentiveIds: string[];
};

const questionBank: GreenQuizQuestion[] = [
  { id: 'arbor-day', category: 'general', prompt: '우리나라 식목일은 몇 월 며칠일까요?', options: ['3월 22일', '4월 5일', '5월 5일', '6월 5일'], answerIndex: 1, explanation: '우리나라 식목일은 매년 4월 5일입니다.', recommendedIncentiveIds: ['tree-planting'] },
  { id: 'environment-day', category: 'general', prompt: '세계 환경의 날은 언제일까요?', options: ['2월 2일', '4월 22일', '6월 5일', '9월 16일'], answerIndex: 2, explanation: '세계 환경의 날은 매년 6월 5일입니다.', recommendedIncentiveIds: ['tree-planting', 'high-quality-recycling'] },
  { id: 'tumbler-rate', category: 'life', prompt: '공식 탄소중립포인트 기준에서 텀블러·다회용컵 이용 1개당 인센티브는 얼마일까요?', options: ['50원', '100원', '300원', '500원'], answerIndex: 2, explanation: '제공된 공식 인센티브 자료 기준 텀블러·다회용컵은 1개당 300원입니다.', recommendedIncentiveIds: ['tumbler-reusable-cup'] },
  { id: 'reusable-container-rate', category: 'life', prompt: '공식 참여 실적으로 인정되는 다회용기 이용 1회의 인센티브는 얼마일까요?', options: ['100원', '300원', '500원', '1,000원'], answerIndex: 2, explanation: '제공된 공식 인센티브 자료 기준 다회용기 이용은 1회당 500원입니다.', recommendedIncentiveIds: ['reusable-container', 'personal-container-takeout'] },
  { id: 'receipt-rate', category: 'life', prompt: '전자영수증을 1건 발급받으면 공식 기준으로 얼마의 인센티브가 적립될까요?', options: ['10원', '50원', '100원', '300원'], answerIndex: 0, explanation: '전자영수증은 1건당 10원이며, 공식 자료에는 연간 70,000원 한도가 안내되어 있습니다.', recommendedIncentiveIds: ['electronic-receipt'] },
  { id: 'bike-rate', category: 'transport', prompt: '공유자전거를 1km 이용했을 때 공식 인센티브 기준은 얼마일까요?', options: ['50원', '100원', '300원', '500원'], answerIndex: 1, explanation: '제공된 공식 인센티브 자료 기준 공유자전거 이용은 1km당 100원입니다.', recommendedIncentiveIds: ['shared-bike'] },
  { id: 'zero-emission-car', category: 'transport', prompt: '공식 기준에서 무공해차 대여 실적은 어떤 단위로 인센티브를 계산할까요?', options: ['대여 1회', '주행 1km', '하루 이용', '충전 1회'], answerIndex: 1, explanation: '무공해차 대여는 공식 참여 실적으로 인정되는 주행거리를 기준으로 km당 인센티브를 계산합니다.', recommendedIncentiveIds: ['zero-emission-car-rental'] },
  { id: 'leftover-rate', category: 'food', prompt: '잔반제로 실천 1회의 공식 인센티브는 얼마일까요?', options: ['50원', '100원', '300원', '500원'], answerIndex: 1, explanation: '제공된 공식 인센티브 자료 기준 잔반제로 실천은 1회당 100원입니다.', recommendedIncentiveIds: ['zero-leftover-meal'] },
  { id: 'recycling-rate', category: 'resource', prompt: '고품질 재활용품을 1kg 배출했을 때 공식 인센티브는 얼마일까요?', options: ['100원', '200원', '300원', '500원'], answerIndex: 2, explanation: '고품질 재활용품 배출은 공식 기준 1kg당 300원입니다. 인정 품목과 배출 방법을 참여기업에서 확인해야 합니다.', recommendedIncentiveIds: ['high-quality-recycling'] },
  { id: 'phone-return-rate', category: 'resource', prompt: '폐휴대폰 1개를 공식 경로로 반납했을 때 인센티브는 얼마일까요?', options: ['100원', '300원', '500원', '1,000원'], answerIndex: 3, explanation: '제공된 공식 인센티브 자료 기준 폐휴대폰은 1개당 1,000원입니다.', recommendedIncentiveIds: ['used-mobile-phone-return'] },
  { id: 'shopping-bag-rate', category: 'life', prompt: '장바구니를 1회 이용했을 때 공식 인센티브는 얼마일까요?', options: ['10원', '50원', '100원', '300원'], answerIndex: 1, explanation: '제공된 공식 인센티브 자료 기준 장바구니 이용은 1회당 50원입니다.', recommendedIncentiveIds: ['shopping-bag'] },
  { id: 'personal-container-rate', category: 'food', prompt: '개인용기로 식품을 포장한 1회의 공식 인센티브는 얼마일까요?', options: ['100원', '300원', '500원', '1,000원'], answerIndex: 2, explanation: '개인용기 식품 포장은 공식 기준 1회당 500원입니다. 참여기업에서 인정하는 방식인지 확인해야 합니다.', recommendedIncentiveIds: ['personal-container-takeout'] },
];

const activityQuizCategory: Record<string, GreenQuizQuestion['category']> = {
  'tumbler-reusable-cup': 'life',
  'shopping-bag': 'life',
  'electronic-receipt': 'life',
  'refill-station': 'life',
  'reusable-container': 'life',
  'eco-friendly-product': 'life',
  'recycled-material-product': 'life',
  'personal-container-takeout': 'food',
  'zero-leftover-meal': 'food',
  'shared-bike': 'transport',
  'zero-emission-car-rental': 'transport',
  'high-quality-recycling': 'resource',
  'used-mobile-phone-return': 'resource',
  'tree-planting': 'resource',
  'balcony-solar-installation': 'life',
};

export const getActivityQuizCategory = (incentiveId?: string, fallback?: Exclude<ChallengeCategory, 'all'>): GreenQuizQuestion['category'] =>
  (incentiveId && activityQuizCategory[incentiveId]) || fallback || 'general';

/** Selects and personalizes the daily question from the user's most recent green activity. */
export const generateDailyGreenQuiz = (
  dayKey: string,
  activityCategory: GreenQuizQuestion['category'],
  activityTitle?: string,
): GreenQuizQuestion & { personalizationLabel: string } => {
  const activityQuestions = questionBank.filter((question) => question.category === activityCategory);
  const generalQuestions = questionBank.filter((question) => question.category === 'general');
  const pool = activityQuestions.length
    ? [...activityQuestions, ...activityQuestions, ...generalQuestions]
    : generalQuestions;
  const dayNumber = Number(dayKey.replaceAll('-', '')) || 0;
  const selected = pool[dayNumber % pool.length];
  return {
    ...selected,
    id: `${selected.id}-${dayKey}`,
    personalizationLabel: activityTitle
      ? `최근 실천한 ‘${activityTitle}’와 관련된 문제예요.`
      : '환경 실천 기본 지식에서 오늘의 문제를 골랐어요.',
  };
};
