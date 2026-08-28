import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User 
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "./config";
import { UserProfile, LearningProgress } from "@/contexts/UserProfileContext";

const googleProvider = new GoogleAuthProvider();

// ============================================================================
// Auth Actions
// ============================================================================

export const signInWithGoogle = async () => {
  if (!auth || !isFirebaseConfigured()) {
    throw new Error("Firebase is not configured. Please add credentials to .env");
  }
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, pass: string) => {
  if (!auth) throw new Error("Firebase not configured");
  const result = await signInWithEmailAndPassword(auth, email, pass);
  return result.user;
};

export const signUpWithEmail = async (email: string, pass: string) => {
  if (!auth) throw new Error("Firebase not configured");
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  return result.user;
};

export const signOut = async () => {
  if (!auth) return;
  return firebaseSignOut(auth);
};

export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  if (!auth) return () => {};
  return firebaseOnAuthStateChanged(auth, callback);
};

// ============================================================================
// Database Sync Actions
// ============================================================================

/**
 * Fetches the user profile and progress from Firestore.
 */
export const getUserData = async (uid: string) => {
  if (!db) return null;
  
  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as { profile: UserProfile; progress: LearningProgress; activityLog?: any[] };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user data from Firestore:", error);
    return null;
  }
};

/**
 * Syncs the local profile and progress to Firestore.
 */
export const syncLocalDataToFirestore = async (
  uid: string, 
  localProfile: UserProfile | null, 
  localProgress: LearningProgress,
  localActivityLog: any[] = [],
  additionalStats: any = {}
) => {
  if (!db) return;
  
  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        profile: localProfile || {
          name: "New Learner",
          goal: "other",
          level: "beginner",
          timeCommitment: "30min",
          onboardingComplete: false,
          createdAt: Date.now(),
          lastActiveAt: Date.now()
        },
        progress: localProgress,
        activityLog: localActivityLog,
        stats: additionalStats,
        createdAt: new Date().toISOString()
      });
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error syncing local data to Firestore:", error);
    return false;
  }
};

export const updateCloudActivityLog = async (uid: string, activityLog: any[]) => {
  if (!db) return;
  try {
    const userDocRef = doc(db, "users", uid);
    // Keep max 20 activities in cloud to avoid bloated docs
    await updateDoc(userDocRef, { activityLog: activityLog.slice(0, 20) });
  } catch (error) {
    console.error("Error updating cloud activity log:", error);
  }
};

export const updateCloudProfile = async (uid: string, profileUpdates: Partial<UserProfile>) => {
  if (!db) return;
  try {
    const userDocRef = doc(db, "users", uid);
    // Use dot notation for nested updates to avoid overwriting the whole document
    const updates: Record<string, any> = {};
    Object.keys(profileUpdates).forEach(key => {
      updates[`profile.${key}`] = (profileUpdates as any)[key];
    });
    updates['profile.lastActiveAt'] = Date.now();
    
    await updateDoc(userDocRef, updates);
  } catch (error) {
    console.error("Error updating cloud profile:", error);
  }
};

/**
 * Updates just the progress in Firestore
 */
export const updateCloudProgress = async (uid: string, progressUpdates: Partial<LearningProgress>) => {
  if (!db) return;
  try {
    const userDocRef = doc(db, "users", uid);
    const updates: Record<string, any> = {};
    Object.keys(progressUpdates).forEach(key => {
      updates[`progress.${key}`] = (progressUpdates as any)[key];
    });
    
    await updateDoc(userDocRef, updates);
  } catch (error) {
    console.error("Error updating cloud progress:", error);
  }
};
