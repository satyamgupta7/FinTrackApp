import { db } from '@/src/config/firebase';
import {
  collection, addDoc, getDocs, doc,
  setDoc, deleteDoc, serverTimestamp,
} from 'firebase/firestore';

// ── Transactions ──
export async function saveTransaction(userId: string, data: object) {
  return addDoc(collection(db, 'users', userId, 'transactions'), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function fetchTransactions(userId: string) {
  const snap = await getDocs(collection(db, 'users', userId, 'transactions'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ── Savings ──
export async function saveSavingGoal(userId: string, goal: object & { id?: string }) {
  const { id, ...data } = goal as any;
  return setDoc(doc(db, 'users', userId, 'savings', id), data);
}

export async function fetchSavings(userId: string) {
  const snap = await getDocs(collection(db, 'users', userId, 'savings'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function deleteSavingGoal(userId: string, goalId: string) {
  return deleteDoc(doc(db, 'users', userId, 'savings', goalId));
}

// ── Loans ──
export async function saveLoan(userId: string, loan: object & { id?: string }) {
  const { id, ...data } = loan as any;
  return setDoc(doc(db, 'users', userId, 'loans', id), data);
}

export async function fetchLoans(userId: string) {
  const snap = await getDocs(collection(db, 'users', userId, 'loans'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function deleteLoan(userId: string, loanId: string) {
  return deleteDoc(doc(db, 'users', userId, 'loans', loanId));
}

// ── Expense Data ──
export async function saveExpenseData(userId: string, data: object[]) {
  return setDoc(doc(db, 'users', userId, 'meta', 'expenseData'), { data });
}

export async function fetchExpenseData(userId: string) {
  const snap = await getDocs(collection(db, 'users', userId, 'meta'));
  const metaDoc = snap.docs.find(d => d.id === 'expenseData');
  return metaDoc ? (metaDoc.data().data as object[]) : null;
}

// ── User Profile ──
export async function saveUserProfile(userId: string, profile: object) {
  return setDoc(doc(db, 'users', userId), profile, { merge: true });
}

// ── Init Flag ──
export async function isUserInitialized(userId: string): Promise<boolean> {
  const snap = await getDocs(collection(db, 'users', userId, 'meta'));
  return snap.docs.some(d => d.id === 'initialized');
}

export async function markUserInitialized(userId: string) {
  return setDoc(doc(db, 'users', userId, 'meta', 'initialized'), { at: serverTimestamp() });
}
