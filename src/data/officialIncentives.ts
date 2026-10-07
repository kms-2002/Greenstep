import type { OfficialIncentiveActivity } from '../types';

const SOURCE_URL = 'https://cpoint.or.kr/netzero/site/cntnts/CNTNTS_002.do';
const COMMON = {
  payoutOrganization: '한국환경산업기술원',
  payoutTiming: '실천 활동 후 익월 말일부터 지급',
  sourceUrl: SOURCE_URL,
  sourceCheckedOn: '2026-10-07',
};

/** 2026 official incentive catalog transcribed from the supplied workbook and checked against the official page. */
export const OFFICIAL_INCENTIVE_ACTIVITIES: OfficialIncentiveActivity[] = [
  { id: 'electronic-receipt', officialName: '전자영수증 발급', appActivityName: '전자영수증', amountKRW: 10, unit: '건', annualLimitKRW: 70_000, ...COMMON },
  { id: 'tumbler-reusable-cup', officialName: '텀블러·다회용컵 이용', appActivityName: '텀블러·다회용컵', amountKRW: 300, unit: '개', annualLimitKRW: null, ...COMMON },
  { id: 'single-use-cup-return', officialName: '일회용컵 반환', appActivityName: '일회용컵', amountKRW: 100, unit: '개', annualLimitKRW: null, ...COMMON },
  { id: 'refill-station', officialName: '리필스테이션 이용', appActivityName: '리필스테이션', amountKRW: 500, unit: '회', annualLimitKRW: null, ...COMMON },
  { id: 'reusable-container', officialName: '다회용기 이용', appActivityName: '다회용기', amountKRW: 500, unit: '회', annualLimitKRW: null, ...COMMON },
  { id: 'zero-emission-car-rental', officialName: '무공해차 대여', appActivityName: '무공해차', amountKRW: 100, unit: 'km', annualLimitKRW: null, ...COMMON },
  { id: 'eco-friendly-product', officialName: '친환경제품 구매', appActivityName: '친환경제품', amountKRW: 500, unit: '건', annualLimitKRW: null, ...COMMON },
  { id: 'high-quality-recycling', officialName: '고품질 재활용품 배출', appActivityName: '고품질 재활용품', amountKRW: 300, unit: 'kg', annualLimitKRW: null, ...COMMON },
  { id: 'used-mobile-phone-return', officialName: '폐휴대폰 반납', appActivityName: '폐휴대폰', amountKRW: 1_000, unit: '개', annualLimitKRW: null, ...COMMON },
  { id: 'future-generation-action', officialName: '미래세대실천행동', appActivityName: '미래세대실천행동', amountKRW: null, unit: null, annualLimitKRW: null, ...COMMON, note: '기후행동1.5℃ 운영계획에 따름' },
  { id: 'shared-bike', officialName: '공유자전거 이용', appActivityName: '공유자전거', amountKRW: 100, unit: 'km', annualLimitKRW: null, ...COMMON },
  { id: 'zero-leftover-meal', officialName: '잔반제로 실천', appActivityName: '잔반제로', amountKRW: 100, unit: '회', annualLimitKRW: null, ...COMMON },
  { id: 'tree-planting', officialName: '나무심기', appActivityName: '나무심기', amountKRW: 3_000, unit: '회', annualLimitKRW: null, ...COMMON },
  { id: 'balcony-solar-installation', officialName: '가정용 베란다 태양광 설치', appActivityName: '가정용 베란다 태양광', amountKRW: 10_000, unit: '회', annualLimitKRW: null, ...COMMON },
  { id: 'recycled-material-product', officialName: '재생원료 사용제품 구매', appActivityName: '재생원료 사용제품', amountKRW: 100, unit: '건', annualLimitKRW: null, ...COMMON },
  { id: 'shopping-bag', officialName: '장바구니 이용', appActivityName: '장바구니', amountKRW: 50, unit: '회', annualLimitKRW: null, ...COMMON },
  { id: 'personal-container-takeout', officialName: '개인용기 식품 포장', appActivityName: '개인용기 식품 포장', amountKRW: 500, unit: '회', annualLimitKRW: null, ...COMMON },
];

export const getOfficialIncentiveActivity = (id?: string) =>
  id ? OFFICIAL_INCENTIVE_ACTIVITIES.find((activity) => activity.id === id) : undefined;
