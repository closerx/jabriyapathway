import { db, auth } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  onSnapshot,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// User Profile
export async function updateUserVerification(uid: string, isEmailVerified: boolean, verificationCode?: string) {
  const path = `users/${uid}`;
  try {
    const docRef = doc(db, 'users', uid);
    const updateData: any = { isEmailVerified, updatedAt: serverTimestamp() };
    if (verificationCode !== undefined) {
      updateData.verificationCode = verificationCode;
    }
    await updateDoc(docRef, updateData);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function saveUserProfile(uid: string, profile: any) {
  const path = `users/${uid}`;
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    
    // Remove any potential non-serializable fields if they sneaked in
    const cleanedData = { ...profile };
    // Usually user profiles are clean, but let's be safe
    
    if (docSnap.exists()) {
      // It's an update, do not modify createdAt or other protected fields unnecessarily
      delete cleanedData.createdAt;
      await updateDoc(docRef, {
        ...cleanedData,
        updatedAt: serverTimestamp(),
      });
    } else {
      // It's a create
      await setDoc(docRef, {
        ...cleanedData,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getUserProfile(uid: string) {
  const path = `users/${uid}`;
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// Patients
export function subscribeToPatients(callback: (patients: any[]) => void) {
  const path = 'patients';
  const q = query(collection(db, 'patients'));
  return onSnapshot(q, (snapshot) => {
    const patients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(patients);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
}

export async function addPatient(patientData: any) {
  const path = 'patients';
  try {
    const docRef = doc(collection(db, 'patients'));
    
    // Create a copy and remove non-serializable fields
    const cleanedData = { ...patientData };
    // Remove functions or components if any exist
    
    await setDoc(docRef, {
      ...cleanedData,
      createdBy: auth.currentUser?.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updatePatient(patientId: string, patientData: any) {
  const path = `patients/${patientId}`;
  try {
    const docRef = doc(db, 'patients', patientId);
    
    // Create a copy and remove non-serializable fields
    const cleanedData = { ...patientData };
    
    await updateDoc(docRef, {
      ...cleanedData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// Goals
export function subscribeToGoals(callback: (goals: any[]) => void) {
  const path = 'goals';
  const q = query(collection(db, 'goals'));
  return onSnapshot(q, (snapshot) => {
    const goals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(goals);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
}

export async function updateGoal(goalId: string, goalData: any) {
  const path = `goals/${goalId}`;
  try {
    const docRef = doc(db, 'goals', goalId);
    
    // Create a copy and remove non-serializable fields like Lucide icons
    const cleanedData = { ...goalData };
    if ('icon' in cleanedData) delete cleanedData.icon;
    
    await setDoc(docRef, {
      ...cleanedData,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function batchUpdateGoals(goals: any[]) {
  // Simple loop for now as we don't have a large list
  for (const goal of goals) {
    await updateGoal(goal.id, goal);
  }
}
