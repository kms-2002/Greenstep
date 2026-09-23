export type ChallengeCategory = 'all' | 'transport' | 'life' | 'food' | 'resource';

export interface User {
  id: string;
  studentId?: string;
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
  profileAvatarId?: string;
}

export interface AuthUser {
  studentId: string;
  password?: string;
  nickname: string;
  university: string;
  department: string;
  grade: string;
  profileAvatarId?: string;
  createdAt: string;
}

export interface AvatarOption {
  id: string;
  name: string;
  icon: string;
  bgColor: string;
  textColor: string;
  image?: string;
}

export const CUTE_AVATARS: AvatarOption[] = [
  {
    id: 'avatar-jinu',
    name: '지누 마스코트',
    icon: '🦖',
    bgColor: 'bg-[#EBF7F4] border-teal-200',
    textColor: 'text-teal-700',
    image: '/jinu_clean.png',
  },
  {
    id: 'avatar-sprout',
    name: '새싹 지킴이',
    icon: '🌱',
    bgColor: 'bg-emerald-50 border-emerald-200',
    textColor: 'text-emerald-700',
  },
  {
    id: 'avatar-tumbler',
    name: '텀블러 마스터',
    icon: '☕',
    bgColor: 'bg-amber-50 border-amber-200',
    textColor: 'text-amber-700',
  },
  {
    id: 'avatar-rider',
    name: '에코 라이더',
    icon: '🚲',
    bgColor: 'bg-sky-50 border-sky-200',
    textColor: 'text-sky-700',
  },
  {
    id: 'avatar-tree',
    name: '숲 가꾸기',
    icon: '🌲',
    bgColor: 'bg-green-50 border-green-200',
    textColor: 'text-green-700',
  },
];


export interface Challenge {
  id: string;
  title: string;
  category: ChallengeCategory;
  categoryName: string;
  categoryIcon: string;
  description: string;
  detailGuide: string;
  carbonReduction: number; // kg CO2e per action
  unitDescription: string;
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
  carbonReduction: number;
  points: number;
  isCurrentUser?: boolean;
  avatarUrl?: string;
}

export interface DepartmentRank {
  rank: number;
  department: string;
  university: string;
  totalCarbonReduction: number;
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

// ==========================================
// Next.js App Router + Supabase Board Types
// ==========================================
export type PostCategory = 'all' | 'verification' | 'tip' | 'free' | 'dept';

export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  authorNickname: string;
  authorDepartment: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorNickname: string;
  authorUniversity: string;
  authorDepartment: string;
  authorGrade: string;
  authorAvatar?: string;
  category: PostCategory;
  categoryName: string;
  title: string;
  content: string;
  imageUrl?: string;
  challengeTag?: string;
  carbonSavedTag?: number;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  createdAt: string;
}
