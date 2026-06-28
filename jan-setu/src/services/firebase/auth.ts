import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config";
import { User } from "@/types";

export async function signInWithGoogle() {
  const { googleProvider } = await import("./config");
  const result = await signInWithPopup(auth, googleProvider);
  const firebaseUser = result.user;

  // Check if user exists in Firestore
  const userRef = doc(db, "users", firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // Create new user document
    const newUser: Partial<User> = {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || "Anonymous",
      email: firebaseUser.email || "",
      trustScore: 50,
      points: 0,
      streak: 0,
      badges: [],
      role: "citizen",
      avatar: firebaseUser.photoURL || undefined,
      area: "Mumbai",
      reportsCount: 0,
      verifiedCount: 0,
      joinedAt: new Date(),
    };
    await setDoc(userRef, {
      ...newUser,
      joinedAt: serverTimestamp(),
    });
  }

  return firebaseUserToAppUser(firebaseUser);
}

export async function signUpWithEmail(name: string, email: string, password: string) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName: name });

  const userRef = doc(db, "users", result.user.uid);
  await setDoc(userRef, {
    id: result.user.uid,
    name,
    email,
    trustScore: 50,
    points: 0,
    streak: 0,
    badges: [],
    role: "citizen",
    area: "Mumbai",
    reportsCount: 0,
    verifiedCount: 0,
    joinedAt: serverTimestamp(),
  });

  return firebaseUserToAppUser(result.user);
}

export async function signInWithEmail(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return firebaseUserToAppUser(result.user);
}

export async function signOutUser() {
  await signOut(auth);
}

export async function getUserProfile(uid: string): Promise<User | null> {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const data = userSnap.data();
    return {
      ...data,
      id: uid,
      joinedAt: data.joinedAt?.toDate() || new Date(),
    } as User;
  }
  return null;
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const profile = await getUserProfile(firebaseUser.uid);
      callback(profile);
    } else {
      callback(null);
    }
  });
}

function firebaseUserToAppUser(fbUser: FirebaseUser): User {
  return {
    id: fbUser.uid,
    name: fbUser.displayName || "Anonymous",
    email: fbUser.email || "",
    trustScore: 50,
    points: 0,
    streak: 0,
    badges: [],
    role: "citizen",
    avatar: fbUser.photoURL || undefined,
    area: "Mumbai",
    reportsCount: 0,
    verifiedCount: 0,
    joinedAt: new Date(),
  };
}
