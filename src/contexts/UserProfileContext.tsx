import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { 
  onAuthStateChanged, 
  getUserData, 
  syncLocalDataToFirestore, 
  updateCloudProfile, 
  updateCloudProgress,
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

// ============================================================
// Context
// ============================================================

interface UserProfileContextType {
  user: User | null;
  isLoadingAuth: boolean;
  profile: UserProfile | null;
  progress: LearningProgress;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  clearProfile: () => void;
  setProgress: (progress: LearningProgress) => void;
  updateProgress: (updates: Partial<LearningProgress>) => void;
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

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Initial load from local storage (for guest users)
  const [profile, setProfileState] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(PROFILE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [progress, setProgressState] = useState<LearningProgress>(() => {
    try {
      const stored = localStorage.getItem(PROGRESS_KEY);
      return stored ? { ...defaultProgress, ...JSON.parse(stored) } : defaultProgress;
    } catch {
      return defaultProgress;
    }
  });

  // Check if user has any coding history (from the old gamification system)
  const hasStartedCoding = Boolean(
    localStorage.getItem('codeStart_score') ||
    localStorage.getItem('learnercraft_problems_solved')
  );

  const isReturningUser = Boolean(profile) || hasStartedCoding;

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // When a user logs in, try to sync local data up (if it's a new account)
        const localXp = parseInt(localStorage.getItem('codeStart_score') || '0', 10);
        const localStreak = parseInt(localStorage.getItem('codeStart_dailyStreak') || '0', 10);
        
        await syncLocalDataToFirestore(firebaseUser.uid, profile, progress, {
          xp: localXp,
          streak: localStreak
        });

        // Pull canonical data from cloud
        const cloudData = await getUserData(firebaseUser.uid);
        if (cloudData) {
          setProfileState(cloudData.profile);
          setProgressState(cloudData.progress);
        }
      } else {
        setUser(null);
      }
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []); // Run once on mount

  // Persist profile locally (always fallback)
  useEffect(() => {
    if (profile) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    }
  }, [profile]);

  // Persist progress locally (always fallback)
  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);

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

  const clearProfile = useCallback(() => {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(PROGRESS_KEY);
    setProfileState(null);
    setProgressState(defaultProgress);
  }, []);

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
        setProfile,
        updateProfile,
        clearProfile,
        setProgress,
        updateProgress,
        logout,
        isReturningUser,
        hasStartedCoding,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

// ============================================================
// Hook
// ============================================================

export const useUserProfile = (): UserProfileContextType => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};
