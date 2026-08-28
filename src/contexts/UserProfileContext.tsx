import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { 
  onAuthStateChanged, 
  getUserData, 
  syncLocalDataToFirestore, 
  updateCloudProfile, 
  updateCloudProgress,
  updateCloudActivityLog,
  signOut
} from '@/integrations/firebase/auth';

// ============================================================
// Types
// ============================================================

export type UserLevel = 'beginner' | 'basics' | 'intermediate' | 'advanced';
export type UserGoal = 'learn-programming' | 'exam-prep' | 'dsa-practice' | 'upskill-job' | 'other';
export type TimeCommitment = '30min' | '1hour' | '2hours' | 'weekends';
export type UserPath = 'new-to-coding' | 'exam-prep' | 'specific-goal';

export interface UserProfile {
  name: string;
  college?: string;
  year?: string;
  goal: UserGoal;
  goalText?: string; 
  level: UserLevel;
  timeCommitment: TimeCommitment;
  path?: UserPath;
  onboardingComplete: boolean;
  createdAt: number;
  lastActiveAt: number;
}

export interface LearningProgress {
  currentChapter: number;
  currentLesson: number;
  completedLessons: string[]; 
  guidedMode: boolean;
}

export interface ActivityLogEntry {
  id: string;
  title: string;
  description: string;
  xpEarned: number;
  type: 'exam' | 'practice' | 'plan' | 'tutor' | 'system';
  timestamp: number;
}

// ============================================================
// Context
// ============================================================

interface UserProfileContextType {
  user: User | null;
  isLoadingAuth: boolean;
  profile: UserProfile | null;
  progress: LearningProgress;
  activityLog: ActivityLogEntry[];
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  clearProfile: () => void;
  setProgress: (progress: LearningProgress) => void;
  updateProgress: (updates: Partial<LearningProgress>) => void;
  logActivity: (title: string, description: string, xpEarned: number, type: ActivityLogEntry['type']) => void;
  logout: () => Promise<void>;
  isReturningUser: boolean;
  hasStartedCoding: boolean;
}

const defaultProgress: LearningProgress = {
  currentChapter: 1,
  currentLesson: 1,
  completedLessons: [],
  guidedMode: true,
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

// ============================================================
// Provider
// ============================================================

const PROFILE_KEY = 'learnercraft_profile';
const PROGRESS_KEY = 'learnercraft_learning_progress';
const ACTIVITY_KEY = 'learnercraft_activity';

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const [profile, setProfileState] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(PROFILE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const [progress, setProgressState] = useState<LearningProgress>(() => {
    try {
      const stored = localStorage.getItem(PROGRESS_KEY);
      return stored ? { ...defaultProgress, ...JSON.parse(stored) } : defaultProgress;
    } catch { return defaultProgress; }
  });

  const [activityLog, setActivityLogState] = useState<ActivityLogEntry[]>(() => {
    try {
      const stored = localStorage.getItem(ACTIVITY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  const hasStartedCoding = Boolean(
    localStorage.getItem('codeStart_score') ||
    localStorage.getItem('learnercraft_problems_solved')
  );

  const isReturningUser = Boolean(profile) || hasStartedCoding;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        const localXp = parseInt(localStorage.getItem('codeStart_score') || '0', 10);
        const localStreak = parseInt(localStorage.getItem('codeStart_dailyStreak') || '0', 10);
        
        await syncLocalDataToFirestore(firebaseUser.uid, profile, progress, activityLog, {
          xp: localXp,
          streak: localStreak
        });

        const cloudData = await getUserData(firebaseUser.uid);
        if (cloudData) {
          setProfileState(cloudData.profile);
          setProgressState(cloudData.progress);
          if (cloudData.activityLog) {
            setActivityLogState(cloudData.activityLog);
          }
        }
      } else {
        setUser(null);
      }
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (profile) localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activityLog));
  }, [activityLog]);

  const setProfile = useCallback((newProfile: UserProfile) => {
    const fullProfile = { ...newProfile, lastActiveAt: Date.now() };
    setProfileState(fullProfile);
    if (user) updateCloudProfile(user.uid, fullProfile);
  }, [user]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfileState(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates, lastActiveAt: Date.now() };
      if (user) updateCloudProfile(user.uid, updated);
      return updated;
    });
  }, [user]);

  const setProgress = useCallback((newProgress: LearningProgress) => {
    setProgressState(newProgress);
    if (user) updateCloudProgress(user.uid, newProgress);
  }, [user]);

  const updateProgress = useCallback((updates: Partial<LearningProgress>) => {
    setProgressState(prev => {
      const updated = { ...prev, ...updates };
      if (user) updateCloudProgress(user.uid, updated);
      return updated;
    });
  }, [user]);

  const logActivity = useCallback((title: string, description: string, xpEarned: number, type: ActivityLogEntry['type']) => {
    setActivityLogState(prev => {
      const newEntry: ActivityLogEntry = {
        id: Math.random().toString(36).substring(7),
        title,
        description,
        xpEarned,
        type,
        timestamp: Date.now()
      };
      const updated = [newEntry, ...prev].slice(0, 50); // Keep last 50 locally
      if (user) updateCloudActivityLog(user.uid, updated);
      return updated;
    });
  }, [user]);

  const clearProfile = useCallback(() => {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(ACTIVITY_KEY);
    setProfileState(null);
    setProgressState(defaultProgress);
    setActivityLogState([]);
  }, []);

  const logout = useCallback(async () => {
    await signOut();
    clearProfile();
  }, [clearProfile]);

  return (
    <UserProfileContext.Provider
      value={{
        user,
        isLoadingAuth,
        profile,
        progress,
        activityLog,
        setProfile,
        updateProfile,
        clearProfile,
        setProgress,
        updateProgress,
        logActivity,
        logout,
        isReturningUser,
        hasStartedCoding,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = (): UserProfileContextType => {
  const context = useContext(UserProfileContext);
  if (!context) throw new Error('useUserProfile must be used within a UserProfileProvider');
  return context;
};
