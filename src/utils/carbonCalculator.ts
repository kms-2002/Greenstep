import { FOOD_WASTE_FACTOR } from '../lib/carbonEstimate';
import type { CarbonFactor, Challenge, Participation } from '../types';

export const INITIAL_CARBON_FACTORS: CarbonFactor[] = [{
  id: FOOD_WASTE_FACTOR.id,
  action: '음식물쓰레기 감축 (측정 무게 기준)', category: 'food', unit: '감축량 1kg',
  factorKgCO2e: FOOD_WASTE_FACTOR.factor_kg_co2e_per_unit,
  description: '제공된 창원시 자료 기반 추정치. 식사 1회에 적용하지 않음. 진주시 공인 계수 아님.',
  source: FOOD_WASTE_FACTOR.source_citation,
}];
// Tree level calculations
export interface TreeStage {
  level: number;
  minLevel: number;
  maxLevel: number;
  name: string;
  emoji: string;
  minCarbon: number;
  maxCarbon: number;
  description: string;
  stageName: string;
  fruitBearing?: boolean;
}

export const TREE_STAGES: TreeStage[] = [
  { level: 1, minLevel: 1, maxLevel: 5, name: '새싹', emoji: '🌱', minCarbon: 0, maxCarbon: 5, description: '작은 씨앗이 싹을 틔우고 있어요. 첫 실천부터 차근차근 키워봐요!', stageName: 'Sprout' },
  { level: 2, minLevel: 6, maxLevel: 10, name: '어린 나무', emoji: '🌿', minCarbon: 5, maxCarbon: 15, description: '새잎이 돋고 줄기가 자라나는 시기예요. 꾸준한 실천이 힘이 됩니다.', stageName: 'Sapling' },
  { level: 3, minLevel: 11, maxLevel: 15, name: '성장하는 나무', emoji: '🌳', minCarbon: 15, maxCarbon: 30, description: '줄기가 굵어지고 가지가 넓게 뻗어가고 있어요.', stageName: 'Growing Tree' },
  { level: 4, minLevel: 16, maxLevel: 20, name: '열매 맺은 울창한 나무', emoji: '🌳', minCarbon: 30, maxCarbon: 50, description: '울창한 가지마다 열매가 열렸어요! 꾸준한 실천이 풍성한 결실로 이어졌습니다.', stageName: 'Fruitful Tree', fruitBearing: true },
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
    currentStage = TREE_STAGES[3];
    calculatedLevel = Math.min(20, Math.floor(19 + ((totalCarbon - 50) / 50)));
  }

  const levelStage = TREE_STAGES.find((treeStage) => calculatedLevel >= treeStage.minLevel && calculatedLevel <= treeStage.maxLevel) ?? TREE_STAGES[3];

  const minC = currentStage.minCarbon;
  const maxC = currentStage.maxCarbon;
  const progressPercent = Math.min(100, Math.max(0, ((totalCarbon - minC) / (maxC - minC)) * 100));
  const remainingCarbon = Math.max(0, maxC - totalCarbon);

  return {
    level: calculatedLevel,
    stage: levelStage,
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
