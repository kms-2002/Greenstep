export type ChallengeCategory = 'all' | 'transport' | 'life' | 'food' | 'resource';

export interface User {
  id: string;
  nickname: string;
  university: string;
  department: string;
  grade: string;
  level: number;
  points: number;
  totalCarbonReduction: number; // in kg CO2e
  todayCarbonReduction: number;
  weekCarbonReduction: number;
  consecutiveDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  profileImage?: string;
}

export interface Challenge {
  id: string;
  title: string;
  category: ChallengeCategory;
  categoryName: string;
  categoryIcon: string;
  description: string;
  detailGuide: string;
  carbonReduction: number; // kg CO2e per action
  unitDescription: string; // e.g. "1회 실천", "10km 이동"
  rewardPoints: number;
  participantsCount: number;
  verificationMethod: string;
  imageUrl: string;
  isPopular?: boolean;
  isRecommended?: boolean;
  startDate?: string;
  endDate?: string;
  active: boolean;
}

export interface Participation {
  id: string;
  userId: string;
  challengeId: string;
  status: 'in_progress' | 'completed';
  joinedAt: string;
  completedAt?: string;
  verificationImage?: string;
  aiVerificationScore?: number;
  carbonSaved: number;
  pointsEarned: number;
}

export interface Certification {
  id: string;
  participationId: string;
  challengeId: string;
  userId: string;
  imageUrl: string;
  aiStatus: 'verified' | 'pending' | 'rejected';
  aiConfidence: number;
  detectedObjects: string[];
  createdAt: string;
}

export interface CarbonFactor {
  id: string;
  action: string;
  category: ChallengeCategory;
  unit: string;
  factorKgCO2e: number;
  description: string;
  source: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'starter' | 'streak' | 'carbon' | 'category' | 'master';
  requirementType: 'count' | 'streak' | 'carbon' | 'specific_challenge';
  requirementValue: number;
  targetCategory?: ChallengeCategory;
  unlockedAt?: string;
}

export interface UserBadge {
  userId: string;
  badgeId: string;
  acquiredAt: string;
}

export interface PersonalRank {
  rank: number;
  userId: string;
  nickname: string;
  university: string;
  department: string;
  carbonReduction: number; // kg CO2e
  points: number;
  isCurrentUser?: boolean;
  avatarUrl?: string;
}

export interface DepartmentRank {
  rank: number;
  department: string;
  university: string;
  totalCarbonReduction: number; // kg CO2e
  participantCount: number;
  avgCarbonReduction: number;
  isUserDept?: boolean;
}

export interface FriendRank {
  rank: number;
  nickname: string;
  department: string;
  carbonReduction: number;
  streak: number;
  isCurrentUser?: boolean;
}

export interface AdminKPIs {
  totalUsers: number;
  activeParticipants: number;
  totalCarbonReduction: number;
  monthlyParticipationRate: number;
}

export interface ActivityHistoryItem {
  date: string;
  dayName: string;
  carbonSaved: number; // kg CO2e
  count: number;
}

export interface ActionBreakdownItem {
  category: string;
  name: string;
  icon: string;
  count: number;
  carbonSaved: number;
}
