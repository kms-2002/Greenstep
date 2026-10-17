import { verificationRequest } from '../lib/challengeVerification';
import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import type {
  Badge,
  CarbonFactor,
  Challenge,
  DepartmentRank,
  Participation,
  PersonalRank,
  User,
} from '../types';
import { INITIAL_BADGES, INITIAL_CHALLENGES } from '../mock/initialData';
import { INITIAL_CARBON_FACTORS } from '../utils/carbonCalculator';
import type { CarbonEstimate, WasteMeasurement } from '../lib/carbonEstimate';
import { backend, emptyUser, loadAccount, rpc, type Member } from '../lib/backend';

export type TabType = 'home' | 'challenge' | 'ranking' | 'quiz' | 'my';
export type ViewMode = 'mobile' | 'admin';

interface CompletionResult {
  carbonEstimate: CarbonEstimate;
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
  authInitialTab: 'login' | 'signup';
  openAuthModal: (tab?: 'login' | 'signup') => void;

  // Actions
  refreshAccount: () => Promise<void>;
  members: Member[];
  refreshMembers: () => Promise<void>;
  loading: boolean;
  logout: () => void;
  updateProfile: (updated: Partial<User>) => void;
  joinChallenge: (challengeId: string) => void;
  completeCertification: (challengeId: string, imageSrc?: string, measurement?: WasteMeasurement, ticket?: string) => Promise<void>;

  // Admin Actions
  addAdminChallenge: (newCh: Omit<Challenge, 'id' | 'participantsCount' | 'active'>) => void;
  updateAdminChallenge: (updatedCh: Challenge) => void;
  deleteAdminChallenge: (id: string) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user,setUser]=useState<User>(emptyUser);
  const [isAuthenticated,setIsAuthenticated]=useState(false);
  const [loading,setLoading]=useState(true);
  const [syncError,setSyncError]=useState('');
  const accountId=useRef<string | null>(null);
  const [activeTab,setActiveTab]=useState<TabType>('home');
  const [viewMode,setViewMode]=useState<ViewMode>('mobile');
  const [challenges,setChallenges]=useState<Challenge[]>(INITIAL_CHALLENGES);
  const [participations,setParticipations]=useState<Participation[]>([]);
  const [members,setMembers]=useState<Member[]>([]);
  const badges: Badge[]=INITIAL_BADGES.map(b=>{
    const completed=participations.filter(p=>p.status==='completed');
    const reached=b.requirementType==='count'?completed.length>=b.requirementValue:b.requirementType==='streak'?user.consecutiveDays>=b.requirementValue:b.requirementType==='carbon'?user.totalCarbonReduction>=b.requirementValue:false;
    return {...b,unlockedAt:reached?user.lastActiveDate:undefined};
  });
  const personalRanks: PersonalRank[]=members.map((m,i)=>({rank:i+1,userId:m.id,nickname:m.nickname,university:m.university,department:m.department,carbonReduction:m.carbonReduction,points:m.points,isCurrentUser:m.id===user.id}));
  const departmentRanks: DepartmentRank[]=[];
  const carbonFactors=INITIAL_CARBON_FACTORS;
  const refreshMembers=useCallback(async()=>{
    const id=accountId.current;if(!id)return;
    const data=await rpc<Member[]>('gs_members');if(accountId.current===id)setMembers(data);
  },[]);
  const refreshAccount=useCallback(async()=>{
    const id=accountId.current;if(!id)return;
    const data=await loadAccount(id);
    if(accountId.current!==id)return;
    setUser(data.user);setParticipations(data.participations);setIsAuthenticated(true);setSyncError('');
  },[]);
  useEffect(()=>{
    let active=true;
    const {data:{subscription}}=backend.auth.onAuthStateChange((_event,session)=>{
      const next=session?.user.id??null;
      if(next!==accountId.current){
        accountId.current=next;setUser(emptyUser);setParticipations([]);setMembers([]);setIsAuthenticated(false);
        setSelectedChallenge(null);setChallengeToVerify(null);setIsVerificationOpen(false);setIsSuccessModalOpen(false);
      }
      if(!next){setLoading(false);return;}
      setLoading(true);
      // Schedule outside the Auth callback to avoid holding the session lock.
      setTimeout(()=>{
        if(!active || accountId.current!==next)return;
        Promise.all([refreshAccount(),refreshMembers()]).then(()=>{
          if(active && accountId.current===next){setIsAuthModalOpen(false);if(sessionStorage.getItem('greenstep_pending_invite'))setActiveTab('my');}
        }).catch(e=>{if(active && accountId.current===next)setSyncError(e.message);})
          .finally(()=>{if(active && accountId.current===next)setLoading(false);});
      },0);
    });
    const params=new URLSearchParams(location.search);const invite=params.get('invite');
    if(invite && /^[0-9a-f-]{36}$/i.test(invite)){
      sessionStorage.setItem('greenstep_pending_invite',invite);params.delete('invite');
      history.replaceState(null,'',location.pathname+(params.size?'?'+params.toString():'')+location.hash);
    }
    const sync=()=>{if(accountId.current)Promise.all([refreshAccount(),refreshMembers()]).catch(e=>setSyncError(e.message));};
    window.addEventListener('focus',sync);
    const timer=window.setInterval(()=>{if(document.visibilityState==='visible')sync();},60000);
    return()=>{active=false;subscription.unsubscribe();window.removeEventListener('focus',sync);window.clearInterval(timer);};
  },[refreshAccount,refreshMembers]);

  // Modals
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [challengeToVerify, setChallengeToVerify] = useState<Challenge | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [completionResult, setCompletionResult] = useState<CompletionResult | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'signup'>('signup');

  const openAuthModal = (tab: 'login' | 'signup' = 'signup') => {
    setAuthInitialTab(tab);
    setIsAuthModalOpen(true);
  };

  const logout=()=>{
    backend.auth.signOut().then(({error})=>{if(error)setSyncError(error.message);else {setActiveTab('home');setIsAuthModalOpen(false);}});
  };
  const updateProfile=(updated:Partial<User>)=>{
    rpc('gs_update_profile',{p:updated}).then(refreshAccount).then(refreshMembers).catch(e=>setSyncError(e.message));
  };
  const joinChallenge=(challengeId:string)=>{
    rpc('gs_join',{p_challenge:challengeId}).then(refreshAccount).catch(e=>setSyncError(e.message));
  };
  const completing=useRef(false);
  const pendingCompletion=useRef<{key:string;id:string;path?:string}|null>(null);
  const completeCertification=async(challengeId:string,imageSrc?:string,measurement?:WasteMeasurement,ticket?:string)=>{
    if(completing.current)throw new Error('저장 중입니다. 잠시 기다려주세요.');
    if(!accountId.current || !imageSrc)throw new Error('로그인과 인증 사진이 필요합니다.');
    completing.current=true;
    const id=accountId.current;
    try{
      if(!ticket)throw new Error('카메라를 열고 새로 촬영해주세요.');
      const key=id+':'+ticket;
      let pending=pendingCompletion.current;
      if(!pending || pending.key!==key){
        const verified=await verificationRequest({mode:'verify',ticket,image:imageSrc});
        pending={key,id:verified.participationId,path:verified.path};pendingCompletion.current=pending;
      }
      const result=await rpc('gs_complete',{p_id:pending.id,p_image:pending.path,p_baseline:measurement?.baselineGrams??null,p_actual:measurement?.actualGrams??null});
      if(accountId.current!==id)return;
      await refreshAccount();await refreshMembers();
      setCompletionResult({challengeTitle:challenges.find(c=>c.id===challengeId)?.title??'',carbonSaved:Number(result.carbon_saved),pointsEarned:result.points,carbonEstimate:result.carbon_estimate});
      pendingCompletion.current=null;setIsVerificationOpen(false);setIsSuccessModalOpen(true);
    }finally{completing.current=false;}
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

  const resetAllData=()=>{setSyncError('실제 계정의 데이터는 이 버튼으로 초기화하지 않습니다.');};

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
        authInitialTab,
        openAuthModal,

        refreshAccount,
        refreshMembers,
        members,
        loading,
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
      {syncError && <div role="alert" className="fixed top-3 left-1/2 -translate-x-1/2 z-[100] max-w-sm rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-800">서버 연결: {syncError}<button className="ml-2 underline" onClick={()=>{setSyncError('');refreshAccount().then(refreshMembers).catch(e=>setSyncError(e.message));}}>다시 연결</button><button className="ml-2 underline" onClick={logout}>로그아웃</button></div>}
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
