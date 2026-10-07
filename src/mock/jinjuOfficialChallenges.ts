import type { Challenge, ChallengeCategory } from '../types';
import { getOfficialIncentiveActivity } from '../data/officialIncentives';

type OfficialChallengeInput = {
  id: string;
  incentiveId: string;
  quantity: number;
  title: string;
  category: Exclude<ChallengeCategory, 'all'>;
  categoryName: string;
  categoryIcon: string;
  description: string;
  detailGuide: string;
  unitDescription: string;
  verificationMethod: string;
  imageUrl: string;
};

const officialChallenge = (input: OfficialChallengeInput): Challenge => {
  const activity = getOfficialIncentiveActivity(input.incentiveId);
  if (!activity?.amountKRW || !activity.unit) {
    throw new Error(`A priced official incentive is required for challenge ${input.id}`);
  }

  return {
    id: input.id,
    title: input.title,
    category: input.category,
    categoryName: input.categoryName,
    categoryIcon: input.categoryIcon,
    description: input.description,
    detailGuide: input.detailGuide,
    carbonReduction: 0,
    unitDescription: input.unitDescription,
    rewardPoints: activity.amountKRW * input.quantity,
    officialIncentiveId: activity.id,
    officialIncentiveQuantity: input.quantity,
    participantsCount: 0,
    verificationMethod: input.verificationMethod,
    imageUrl: input.imageUrl,
    active: true,
  };
};

const jinju = '진주시 또는 경상국립대 인근';
const participantRule = '공식 참여기업에서 인정하는 활동만 해당하며, 참여기업의 앱·영수증 등 실적을 인증해야 합니다.';

export const JINJU_OFFICIAL_CHALLENGES: Challenge[] = [
  officialChallenge({
    id: 'ch-official-electronic-receipt', incentiveId: 'electronic-receipt', quantity: 1,
    title: 'GNU·진주 참여매장 전자영수증 발급', category: 'resource', categoryName: '자원', categoryIcon: '🧾',
    description: `${jinju}에서 참여매장을 이용할 때 종이 영수증 대신 전자영수증을 발급받으세요.`,
    detailGuide: `${participantRule} 전자영수증 1건의 발급 내역을 제출하세요. 연간 공식 상한은 70,000원입니다.`,
    unitDescription: '전자영수증 1건 발급', verificationMethod: '참여매장 앱 또는 전자영수증 발급 내역',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=600',
  }),
  officialChallenge({
    id: 'ch-official-single-use-cup-return', incentiveId: 'single-use-cup-return', quantity: 1,
    title: '진주 참여매장 일회용컵 반환', category: 'life', categoryName: '생활', categoryIcon: '🥤',
    description: '진주 지역 공식 참여매장에서 안내하는 방법으로 사용한 일회용컵을 반환하세요.',
    detailGuide: `${participantRule} 반환한 컵 1개의 참여 실적을 확인할 수 있는 내역을 제출하세요.`,
    unitDescription: '일회용컵 1개 반환', verificationMethod: '참여매장 또는 회수 시스템의 반환 내역',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=600',
  }),
  officialChallenge({
    id: 'ch-official-refill-station', incentiveId: 'refill-station', quantity: 1,
    title: '진주 리필스테이션 이용', category: 'life', categoryName: '생활', categoryIcon: '🧴',
    description: '세제·화장품 등 내용물을 다시 채워 포장재 사용을 줄여보세요.',
    detailGuide: `${participantRule} 리필스테이션 이용 1회의 결제 또는 참여 내역을 제출하세요.`,
    unitDescription: '리필스테이션 1회 이용', verificationMethod: '참여 매장의 결제 또는 앱 이용 내역',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=600',
  }),
  officialChallenge({
    id: 'ch-official-reusable-container', incentiveId: 'reusable-container', quantity: 1,
    title: '진주 참여매장 다회용기 이용', category: 'life', categoryName: '생활', categoryIcon: '🥡',
    description: '참여매장에서 다회용기를 이용해 일회용 포장용기를 줄이세요.',
    detailGuide: `${participantRule} 다회용기 이용 1회의 매장 또는 앱 내역을 제출하세요.`,
    unitDescription: '다회용기 1회 이용', verificationMethod: '참여매장의 다회용기 이용 내역',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=600',
  }),
  officialChallenge({
    id: 'ch-official-zero-emission-car', incentiveId: 'zero-emission-car-rental', quantity: 5,
    title: '진주 무공해차량 5km 이용', category: 'transport', categoryName: '이동', categoryIcon: '🚙',
    description: '진주에서 공식 참여기업의 전기·수소 차량을 대여해 이동하세요.',
    detailGuide: `${participantRule} 무공해차량 5km 이용을 기준으로 하며, 참여기업이 인정하는 대여·주행 내역을 제출하세요.`,
    unitDescription: '무공해차량 5km 이용', verificationMethod: '참여기업 대여 내역 및 주행 거리',
    imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=600',
  }),
  officialChallenge({
    id: 'ch-official-eco-product', incentiveId: 'eco-friendly-product', quantity: 1,
    title: '진주 참여매장 친환경제품 구매', category: 'life', categoryName: '생활', categoryIcon: '🌱',
    description: '공식 참여매장에서 대상 친환경제품을 구매하고 실천을 인증하세요.',
    detailGuide: `${participantRule} 대상 제품 구매 1건의 영수증이나 참여기업 앱 내역을 제출하세요.`,
    unitDescription: '대상 친환경제품 1건 구매', verificationMethod: '대상 제품 영수증 또는 참여기업 앱 내역',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
  }),
  officialChallenge({
    id: 'ch-official-used-phone', incentiveId: 'used-mobile-phone-return', quantity: 1,
    title: '폐휴대폰 1개 반납', category: 'resource', categoryName: '자원', categoryIcon: '📱',
    description: '진주시 또는 경상국립대에서 안내하는 공식 수거·참여 경로로 폐휴대폰을 반납하세요.',
    detailGuide: `${participantRule} 폐휴대폰 1개의 반납 확인 내역을 제출하세요.`,
    unitDescription: '폐휴대폰 1개 반납', verificationMethod: '공식 수거처 또는 참여기업의 반납 확인 내역',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600',
  }),
  officialChallenge({
    id: 'ch-official-tree-planting', incentiveId: 'tree-planting', quantity: 1,
    title: '진주·GNU 공식 나무심기 참여', category: 'resource', categoryName: '자원', categoryIcon: '🌳',
    description: '진주시나 경상국립대가 주관하는 공식 나무심기 활동에 참여하세요.',
    detailGuide: `${participantRule} 주관기관 또는 참여기업이 인정하는 나무심기 1회 참여 내역을 제출하세요.`,
    unitDescription: '공식 나무심기 1회 참여', verificationMethod: '주관기관 또는 참여기업의 활동 확인 내역',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600',
  }),
  officialChallenge({
    id: 'ch-official-balcony-solar', incentiveId: 'balcony-solar-installation', quantity: 1,
    title: '진주 주거지 베란다 태양광 설치', category: 'life', categoryName: '생활', categoryIcon: '☀️',
    description: '진주시 내 주거지에 가정용 베란다 태양광을 설치하고 공식 참여 실적을 확인하세요.',
    detailGuide: `${participantRule} 설치 1회의 공식 신청·완료 확인 자료를 제출하세요.`,
    unitDescription: '가정용 베란다 태양광 1회 설치', verificationMethod: '공식 참여기업의 설치 완료 확인 내역',
    imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=600',
  }),
  officialChallenge({
    id: 'ch-official-recycled-material-product', incentiveId: 'recycled-material-product', quantity: 1,
    title: '재생원료 사용제품 구매', category: 'life', categoryName: '생활', categoryIcon: '♻️',
    description: '재생원료 사용제품으로 표시된 대상 제품을 진주 지역 참여매장에서 구매하세요.',
    detailGuide: `${participantRule} 대상 제품 1건의 구매 증빙을 제출하세요.`,
    unitDescription: '재생원료 사용제품 1건 구매', verificationMethod: '제품 표시와 참여매장 구매 내역',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600',
  }),
  officialChallenge({
    id: 'ch-official-personal-container', incentiveId: 'personal-container-takeout', quantity: 1,
    title: 'GNU·진주 참여매장 개인용기 포장', category: 'food', categoryName: '음식', categoryIcon: '🍱',
    description: '진주 지역 참여매장에서 개인용기로 식품을 포장해 일회용 용기를 줄이세요.',
    detailGuide: `${participantRule} 개인용기 식품 포장 1회의 매장 또는 앱 실적을 제출하세요.`,
    unitDescription: '개인용기 식품 포장 1회', verificationMethod: '참여매장 이용 내역과 개인용기 포장 인증',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600',
  }),
];
