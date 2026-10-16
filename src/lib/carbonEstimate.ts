import reference from '../data/carbonReference.json';
import type { Challenge } from '../types';

export interface WasteMeasurement { baselineGrams: number; actualGrams: number }
export interface CarbonEstimate {
  status: 'estimated' | 'not_calculated';
  calculationVersion: string;
  estimatedKgCO2e: number | null;
  reason?: string;
  factorId?: string;
  factorKgCO2ePerUnit?: number;
  baselineWasteKg?: number;
  actualWasteKg?: number;
  reducedQuantityKg?: number;
}
export const FOOD_WASTE_FACTOR = reference.factors.find(f => f.source_number === 214)!;
export const supportsWasteMeasurement = (challenge: Challenge) =>
  challenge.officialIncentiveId === 'zero-leftover-meal';

export function estimateCarbon(challenge: Challenge, measurement?: WasteMeasurement): CarbonEstimate {
  const base = { calculationVersion: 'changwon-20261016-v1' };
  if (!supportsWasteMeasurement(challenge)) return { ...base, status: 'not_calculated', estimatedKgCO2e: null, reason: '이 활동에 적용할 개인 실천 기준이 확인되지 않았어요.' };
  if (!measurement) return { ...base, status: 'not_calculated', estimatedKgCO2e: null, reason: '음식물쓰레기 감축 무게를 입력하지 않아 계산하지 않았어요.' };
  const { baselineGrams, actualGrams } = measurement;
  if (![baselineGrams, actualGrams].every(v => Number.isFinite(v) && v >= 0) || actualGrams > baselineGrams) {
    throw new Error('무게는 0 이상이며, 실천 후 무게는 비교 기준 무게보다 클 수 없어요.');
  }
  const reducedQuantityKg = (baselineGrams - actualGrams) / 1000;
  return { ...base, status: 'estimated', factorId: FOOD_WASTE_FACTOR.id,
    factorKgCO2ePerUnit: FOOD_WASTE_FACTOR.factor_kg_co2e_per_unit,
    baselineWasteKg: baselineGrams / 1000, actualWasteKg: actualGrams / 1000,
    reducedQuantityKg,
    estimatedKgCO2e: Number((reducedQuantityKg * FOOD_WASTE_FACTOR.factor_kg_co2e_per_unit).toFixed(6)) };
}
