import type { Challenge } from '../types';
import { getOfficialIncentiveActivity } from '../data/officialIncentives';

/** Convert the official KRW rate to prototype points using the defined challenge quantity. */
export const getChallengeRewardPoints = (challenge: Challenge): number => {
  const officialActivity = getOfficialIncentiveActivity(challenge.officialIncentiveId);
  if (officialActivity?.amountKRW !== null && officialActivity?.amountKRW !== undefined) {
    return Math.round(officialActivity.amountKRW * (challenge.officialIncentiveQuantity ?? 1));
  }
  return challenge.rewardPoints;
};
