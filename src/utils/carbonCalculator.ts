import type { CarbonFactor, Challenge, Participation } from '../types';

export const INITIAL_CARBON_FACTORS: CarbonFactor[] = [
  {
    id: 'cf-1',
    action: 'GNU 캠퍼스 텀블러 지참 (일회용 컵 대체)',
    category: 'life',
    unit: '1회',
    factorKgCO2e: 0.1,
    description: '가좌캠 카페/학식 텀블러 할인 및 종이/플라스틱 컵 제조/폐기 과정 절감',
    source: '한국환경산업기술원 (KEITI) 탄소발자국 데이터',
  },
  {
    id: 'cf-2',
    action: '진주 시내버스 & GNU 통학버스 이용',
    category: 'transport',
    unit: '1회 (약 10km)',
    factorKgCO2e: 1.2,
    description: '자가용 이동 대비 진주시 시내버스/통학버스 이용 시 탄소 감축량',
    source: '국토교통부 대중교통 탄소배출계수 산정 가이드',
  },
  {
    id: 'cf-3',
    action: '진주 남강 자전거길 라이딩',
    category: 'transport',
    unit: '1회 (약 5km)',
    factorKgCO2e: 0.8,
    description: '명품 자전거 도시 진주 남강 자전거 도로 이용 시 탄소 감축량',
    source: '한국교통연구원 맑은공기 교통지표',
  },
  {
    id: 'cf-4',
    action: 'GNU 가좌캠퍼스 도보 이동',
    category: 'transport',
    unit: '1회 (약 2km)',
    factorKgCO2e: 0.4,
    description: '경영대학 및 가좌캠퍼스 2km 이내 도보 이동 시 절감량',
    source: '환경부 생활 속 탄소중립 실천 가이드북',
  },
  {
    id: 'cf-5',
    action: 'GNU 가좌캠 학식 잔반 제로',
    category: 'food',
    unit: '1식',
    factorKgCO2e: 0.5,
    description: '학생식당 잔반 남기지 않기를 통한 메탄가스 발생 감축',
    source: '환경부 음식물류 폐기물 발생 억제 지침',
  },
  {
    id: 'cf-6',
    action: '진주 로컬푸드 & 채식 한 끼',
    category: 'food',
    unit: '1식',
    factorKgCO2e: 1.5,
    description: '진주 로컬푸드 유통 탄소 절감 및 육류 대비 채식 식단 감축',
    source: 'UN FAO 축산업 탄소발자국 보고서',
  },
  {
    id: 'cf-7',
    action: '진주 남강변 줍깅 (플로깅)',
    category: 'resource',
    unit: '1회 줍깅',
    factorKgCO2e: 1.0,
    description: '남강 산책로 쓰레기 수거 및 하천 수질 환경 보호 실천',
    source: '진주시 환경보전 및 탄소중립 실천포인트',
  },
  {
    id: 'cf-8',
    action: '투명 페트병 라벨 떼고 분리배출',
    category: 'resource',
    unit: '1회 배출',
    factorKgCO2e: 0.3,
    description: '라벨 수거 분리배출을 통한 재활용률 향상 절감량',
    source: '한국순환자원유통지원센터',
  },
];

// Tree level calculations
export interface TreeStage {
  level: number;
  name: string;
  emoji: string;
  minCarbon: number;
  maxCarbon: number;
  description: string;
  stageName: string;
}

export const TREE_STAGES: TreeStage[] = [
  { level: 1, name: '새싹 단계', emoji: '🌱', minCarbon: 0, maxCarbon: 5, description: '작은 씨앗이 첫 싹을 틔웠어요!', stageName: 'Sprout' },
  { level: 2, name: '어린 줄기', emoji: '🌿', minCarbon: 5, maxCarbon: 15, description: '초록빛 잎사귀가 자라나고 있어요.', stageName: 'Sapling' },
  { level: 3, name: '성장하는 나무', emoji: '🪴', minCarbon: 15, maxCarbon: 30, description: '줄기가 굵어지며 푸른 그늘을 만듭니다.', stageName: 'Young Tree' },
  { level: 4, name: '풍성한 숲나무', emoji: '🌳', minCarbon: 30, maxCarbon: 50, description: '풍성한 나뭇잎이 깨끗한 산소를 뿜어내요.', stageName: 'Mature Tree' },
  { level: 5, name: '울창한 탄소숲', emoji: '🌲', minCarbon: 50, maxCarbon: 100, description: '지구를 지키는 울창한 거목으로 완성되었어요!', stageName: 'Forest Giant' },
];

export function calculateTreeInfo(totalCarbon: number) {
  let currentStage = TREE_STAGES[0];
  let calculatedLevel = 1;

  if (totalCarbon < 5) {
    currentStage = TREE_STAGES[0];
    calculatedLevel = Math.max(1, Math.floor(1 + (totalCarbon / 5) * 4));
  } else if (totalCarbon < 15) {
    currentStage = TREE_STAGES[1];
    calculatedLevel = Math.floor(5 + ((totalCarbon - 5) / 10) * 4);
  } else if (totalCarbon < 30) {
    currentStage = TREE_STAGES[2];
    calculatedLevel = Math.floor(9 + ((totalCarbon - 15) / 15) * 3);
  } else if (totalCarbon < 50) {
    currentStage = TREE_STAGES[3];
    calculatedLevel = Math.floor(12 + ((totalCarbon - 30) / 20) * 7);
  } else {
    currentStage = TREE_STAGES[4];
    calculatedLevel = Math.min(20, Math.floor(19 + ((totalCarbon - 50) / 50)));
  }

  const minC = currentStage.minCarbon;
  const maxC = currentStage.maxCarbon;
  const progressPercent = Math.min(100, Math.max(0, ((totalCarbon - minC) / (maxC - minC)) * 100));
  const remainingCarbon = Math.max(0, maxC - totalCarbon);

  return {
    level: calculatedLevel,
    stage: currentStage,
    progressPercent: Math.round(progressPercent),
    remainingCarbon: parseFloat(remainingCarbon.toFixed(1)),
    totalCarbon: parseFloat(totalCarbon.toFixed(1)),
  };
}

export function formatCarbon(value: number): string {
  return `${value.toFixed(1)}kg CO₂e`;
}

export function generateRecommendation(userHistory: Participation[], allChallenges: Challenge[]) {
  const categoryCounts: Record<string, number> = {
    transport: 0,
    life: 0,
    food: 0,
    resource: 0,
  };

  userHistory.forEach((p) => {
    const ch = allChallenges.find((c) => c.id === p.challengeId);
    if (ch && categoryCounts[ch.category] !== undefined) {
      categoryCounts[ch.category]++;
    }
  });

  let topCategory = 'transport';
  let maxCount = -1;
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topCategory = cat;
    }
  });

  const catNames: Record<string, string> = {
    transport: '이동 🚍',
    life: '생활 🥤',
    food: '음식 🍚',
    resource: '자원 ♻️',
  };

  const recommendedChallenge = allChallenges.find((c) => c.category === topCategory && c.active) || allChallenges[0];

  return {
    reason: `최근 ${catNames[topCategory] || '친환경'} 관련 챌린지를 많이 실천하셨네요!`,
    challenge: recommendedChallenge,
  };
}
