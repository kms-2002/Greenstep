import React, { createContext, useContext, useEffect, useState } from 'react';
import type {
  Badge,
  CarbonFactor,
  Challenge,
  DepartmentRank,
  Participation,
  PersonalRank,
  User,
} from '../types';
import {
  INITIAL_BADGES,
  INITIAL_CHALLENGES,
  INITIAL_DEPARTMENT_RANKS,
  INITIAL_PERSONAL_RANKS,
  INITIAL_USER,
} from '../mock/initialData';
import { INITIAL_CARBON_FACTORS, calculateTreeInfo } from '../utils/carbonCalculator';
import confetti from 'canvas-confetti';

export type TabType = 'home' | 'challenge' | 'ranking' | 'activity' | 'my';
export type ViewMode = 'mobile' | 'admin';

interface CompletionResult {
  challengeTitle: string;
  carbonSaved: number;
  pointsEarned: number;
  unlockedBadge?: Badge;
  leveledUp?: boolean;
  newLevel?: number;
}

interface AppContextType {
  user: User;
  isAuthenticated: boolean;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  challenges: Challenge[];
  participations: Participation[];
  badges: Badge[];
  personalRanks: PersonalRank[];
  departmentRanks: DepartmentRank[];
  carbonFactors: CarbonFactor[];

  selectedChallenge: Challenge | null;
  setSelectedChallenge: (c: Challenge | null) => void;

  isVerificationOpen: boolean;
  setIsVerificationOpen: (open: boolean) => void;
  challengeToVerify: Challenge | null;
  setChallengeToVerify: (c: Challenge | null) => void;

  isSuccessModalOpen: boolean;
  setIsSuccessModalOpen: (open: boolean) => void;
  completionResult: CompletionResult | null;

  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Actions
  login: (nickname: string, university: string, department: string, grade: string) => void;
  logout: () => void;
  updateProfile: (updated: Partial<User>) => void;
  joinChallenge: (challengeId: string) => void;
  completeCertification: (challengeId: string, imageSrc?: string) => void;

  // Admin Actions
  addAdminChallenge: (newCh: Omit<Challenge, 'id' | 'participantsCount' | 'active'>) => void;
  updateAdminChallenge: (updatedCh: Challenge) => void;
  deleteAdminChallenge: (id: string) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Updated storage key to force cache invalidation for Jinju City & GNU challenges
const STORAGE_KEY = 'greenstep_app_state_gnu_v3';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_user`);
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(`${STORAGE_KEY}_auth`) === 'true';
  });

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [viewMode, setViewMode] = useState<ViewMode>('mobile');

  // Always initialize or reset with Jinju x GNU challenges
  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_challenges`);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Verify if parsed data contains Jinju challenges, otherwise fallback to INITIAL_CHALLENGES
      if (Array.isArray(parsed) && parsed.some((c: Challenge) => c.title.includes('진주') || c.title.includes('GNU'))) {
        return parsed;
      }
    }
    return INITIAL_CHALLENGES;
  });

  const [participations, setParticipations] = useState<Participation[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_participations`);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'p-1',
        userId: INITIAL_USER.id,
        challengeId: 'ch-life-1',
        status: 'completed',
        joinedAt: '2026-09-10T10:00:00Z',
        completedAt: '2026-09-10T10:15:00Z',
        carbonSaved: 0.1,
        pointsEarned: 10,
      },
      {
        id: 'p-2',
        userId: INITIAL_USER.id,
        challengeId: 'ch-transport-1',
        status: 'completed',
        joinedAt: '2026-09-11T09:00:00Z',
        completedAt: '2026-09-11T09:30:00Z',
        carbonSaved: 1.2,
        pointsEarned: 30,
      },
      {
        id: 'p-3',
        userId: INITIAL_USER.id,
        challengeId: 'ch-resource-1',
        status: 'completed',
        joinedAt: '2026-09-11T12:30:00Z',
        completedAt: '2026-09-11T13:00:00Z',
        carbonSaved: 1.0,
        pointsEarned: 35,
      },
    ];
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_badges`);
    return saved ? JSON.parse(saved) : INITIAL_BADGES;
  });

  const [personalRanks, setPersonalRanks] = useState<PersonalRank[]>(INITIAL_PERSONAL_RANKS);
  const [departmentRanks, setDepartmentRanks] = useState<DepartmentRank[]>(INITIAL_DEPARTMENT_RANKS);
  const [carbonFactors] = useState<CarbonFactor[]>(INITIAL_CARBON_FACTORS);

  // Modals
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [challengeToVerify, setChallengeToVerify] = useState<Challenge | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [completionResult, setCompletionResult] = useState<CompletionResult | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_auth`, String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_challenges`, JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_participations`, JSON.stringify(participations));
  }, [participations]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_badges`, JSON.stringify(badges));
  }, [badges]);

  // Update Ranks whenever user changes
  useEffect(() => {
    setPersonalRanks((prev) =>
      prev
        .map((r) =>
          r.isCurrentUser
            ? {
                ...r,
                nickname: user.nickname,
                department: user.department,
                carbonReduction: user.totalCarbonReduction,
                points: user.points,
              }
            : r
        )
        .sort((a, b) => b.carbonReduction - a.carbonReduction)
        .map((r, idx) => ({ ...r, rank: idx + 1 }))
    );

    setDepartmentRanks((prev) =>
      prev
        .map((d) =>
          d.department === user.department
            ? {
                ...d,
                totalCarbonReduction: parseFloat(
                  (d.totalCarbonReduction + user.todayCarbonReduction * 0.1).toFixed(1)
                ),
              }
            : d
        )
        .sort((a, b) => b.totalCarbonReduction - a.totalCarbonReduction)
        .map((d, idx) => ({ ...d, rank: idx + 1 }))
    );
  }, [user.totalCarbonReduction, user.nickname, user.department, user.points]);

  const login = (nickname: string, university: string, department: string, grade: string) => {
    setUser((prev) => ({
      ...prev,
      nickname,
      university,
      department,
      grade,
    }));
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAuthModalOpen(true);
  };

  const updateProfile = (updated: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  const joinChallenge = (challengeId: string) => {
    const existing = participations.find((p) => p.challengeId === challengeId && p.status === 'in_progress');
    if (!existing) {
      const newPart: Participation = {
        id: `p-${Date.now()}`,
        userId: user.id,
        challengeId,
        status: 'in_progress',
        joinedAt: new Date().toISOString(),
        carbonSaved: 0,
        pointsEarned: 0,
      };
      setParticipations((prev) => [newPart, ...prev]);
    }
  };

  const completeCertification = (challengeId: string, imageSrc?: string) => {
    const targetChallenge = challenges.find((c) => c.id === challengeId);
    if (!targetChallenge) return;

    const carbonSaved = targetChallenge.carbonReduction;
    const pointsEarned = targetChallenge.rewardPoints;

    const prevTree = calculateTreeInfo(user.totalCarbonReduction);

    const newTotalCarbon = parseFloat((user.totalCarbonReduction + carbonSaved).toFixed(2));
    const newTodayCarbon = parseFloat((user.todayCarbonReduction + carbonSaved).toFixed(2));
    const newWeekCarbon = parseFloat((user.weekCarbonReduction + carbonSaved).toFixed(2));
    const newPoints = user.points + pointsEarned;
    const newStreak = user.consecutiveDays + 1;

    const nextTree = calculateTreeInfo(newTotalCarbon);
    const leveledUp = nextTree.level > prevTree.level;

    let newlyUnlockedBadge: Badge | undefined;

    setBadges((prevBadges) => {
      return prevBadges.map((b) => {
        if (!b.unlockedAt) {
          let unlock = false;
          if (b.requirementType === 'count' && participations.length + 1 >= b.requirementValue) {
            unlock = true;
          } else if (b.requirementType === 'streak' && newStreak >= b.requirementValue) {
            unlock = true;
          } else if (b.requirementType === 'carbon' && newTotalCarbon >= b.requirementValue) {
            unlock = true;
          }

          if (unlock) {
            newlyUnlockedBadge = { ...b, unlockedAt: new Date().toISOString().split('T')[0] };
            return newlyUnlockedBadge;
          }
        }
        return b;
      });
    });

    setUser((prev) => ({
      ...prev,
      totalCarbonReduction: newTotalCarbon,
      todayCarbonReduction: newTodayCarbon,
      weekCarbonReduction: newWeekCarbon,
      points: newPoints,
      consecutiveDays: newStreak,
      level: nextTree.level,
    }));

    setParticipations((prev) => {
      const existingIdx = prev.findIndex((p) => p.challengeId === challengeId && p.status === 'in_progress');
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          status: 'completed',
          completedAt: new Date().toISOString(),
          verificationImage: imageSrc || targetChallenge.imageUrl,
          aiVerificationScore: 98.4,
          carbonSaved,
          pointsEarned,
        };
        return updated;
      } else {
        return [
          {
            id: `p-${Date.now()}`,
            userId: user.id,
            challengeId,
            status: 'completed',
            joinedAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
            verificationImage: imageSrc || targetChallenge.imageUrl,
            aiVerificationScore: 98.4,
            carbonSaved,
            pointsEarned,
          },
          ...prev,
        ];
      }
    });

    setChallenges((prev) =>
      prev.map((c) => (c.id === challengeId ? { ...c, participantsCount: c.participantsCount + 1 } : c))
    );

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#34D399', '#F59E0B', '#6366F1'],
      });
    } catch {
      // Fallback
    }

    setCompletionResult({
      challengeTitle: targetChallenge.title,
      carbonSaved,
      pointsEarned,
      unlockedBadge: newlyUnlockedBadge,
      leveledUp,
      newLevel: nextTree.level,
    });

    setIsVerificationOpen(false);
    setIsSuccessModalOpen(true);
  };

  const addAdminChallenge = (newChData: Omit<Challenge, 'id' | 'participantsCount' | 'active'>) => {
    const newId = `ch-custom-${Date.now()}`;
    const newChallenge: Challenge = {
      ...newChData,
      id: newId,
      participantsCount: 0,
      active: true,
    };
    setChallenges((prev) => [newChallenge, ...prev]);
  };

  const updateAdminChallenge = (updatedCh: Challenge) => {
    setChallenges((prev) => prev.map((c) => (c.id === updatedCh.id ? updatedCh : c)));
  };

  const deleteAdminChallenge = (id: string) => {
    setChallenges((prev) => prev.filter((c) => c.id !== id));
  };

  const resetAllData = () => {
    localStorage.clear();
    setUser(INITIAL_USER);
    setChallenges(INITIAL_CHALLENGES);
    setBadges(INITIAL_BADGES);
    setIsAuthenticated(true);
    window.location.reload();
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        activeTab,
        setActiveTab,
        viewMode,
        setViewMode,
        challenges,
        participations,
        badges,
        personalRanks,
        departmentRanks,
        carbonFactors,

        selectedChallenge,
        setSelectedChallenge,

        isVerificationOpen,
        setIsVerificationOpen,
        challengeToVerify,
        setChallengeToVerify,

        isSuccessModalOpen,
        setIsSuccessModalOpen,
        completionResult,

        isAuthModalOpen,
        setIsAuthModalOpen,

        login,
        logout,
        updateProfile,
        joinChallenge,
        completeCertification,

        addAdminChallenge,
        updateAdminChallenge,
        deleteAdminChallenge,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
