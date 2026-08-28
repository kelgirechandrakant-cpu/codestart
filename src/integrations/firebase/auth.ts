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
      return userDoc.data() as { profile: UserProfile; progress: LearningProgress };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user data from Firestore:", error);
    return null;
  }
};

/**
 * Syncs the local profile and progress to Firestore.
 * This is called right after a new user signs up, so their "Try It Free"
 * progress isn't lost.
 */
export const syncLocalDataToFirestore = async (
  uid: string, 
  localProfile: UserProfile | null, 
  localProgress: LearningProgress,
  additionalStats: any = {}
) => {
  if (!db) return;
  
  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    
    // If the document doesn't exist, this is a new signup. We push local data.
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
        stats: additionalStats, // e.g. xp, streak
        createdAt: new Date().toISOString()
      });
      return true; // Indicates new sync happened
    }
    
    return false; // User already exists, we should use cloud data instead
  } catch (error) {
    console.error("Error syncing local data to Firestore:", error);
    return false;
  }
};

/**
 * Updates just the profile in Firestore
 */
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
