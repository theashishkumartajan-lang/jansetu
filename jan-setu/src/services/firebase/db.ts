import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./config";
import { Issue, Prediction, Notification } from "@/types";

// Issues Collection
export const issuesCollection = collection(db, "issues");

export async function createIssue(issue: Partial<Issue>): Promise<string> {
  const docRef = await addDoc(issuesCollection, {
    ...issue,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getAllIssues(): Promise<Issue[]> {
  const q = query(issuesCollection, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    resolvedAt: doc.data().resolvedAt?.toDate() || undefined,
  })) as Issue[];
}

export async function updateIssueStatus(id: string, updates: Partial<Issue>) {
  const issueRef = doc(db, "issues", id);
  await updateDoc(issueRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteIssue(id: string) {
  await deleteDoc(doc(db, "issues", id));
}

export function subscribeToIssues(callback: (issues: Issue[]) => void) {
  const q = query(issuesCollection, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const issues = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      resolvedAt: doc.data().resolvedAt?.toDate() || undefined,
    })) as Issue[];
    callback(issues);
  });
}

// Predictions Collection
export const predictionsCollection = collection(db, "predictions");

export async function getAllPredictions(): Promise<Prediction[]> {
  const snapshot = await getDocs(predictionsCollection);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Prediction[];
}

export async function createPrediction(prediction: Partial<Prediction>) {
  await addDoc(predictionsCollection, prediction);
}

// Users Collection
export const usersCollection = collection(db, "users");

export async function updateUserPoints(userId: string, points: number) {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { points });
}

export async function updateUserBadges(userId: string, badges: string[]) {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { badges });
}

export async function incrementUserReports(userId: string) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const current = userSnap.data().reportsCount || 0;
    await updateDoc(userRef, { reportsCount: current + 1 });
  }
}

// Notifications Collection
export const notificationsCollection = collection(db, "notifications");

export async function createNotification(notification: Partial<Notification>) {
  await addDoc(notificationsCollection, {
    ...notification,
    createdAt: serverTimestamp(),
  });
}

export async function getUserNotifications(userId: string): Promise<Notification[]> {
  const q = query(
    notificationsCollection,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as Notification[];
}

export async function markNotificationAsRead(notificationId: string) {
  const notifRef = doc(db, "notifications", notificationId);
  await updateDoc(notifRef, { read: true });
}
