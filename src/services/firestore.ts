import { db } from '@/src/config/firebase';
import {
  collection, addDoc, getDocs, doc,
  setDoc, deleteDoc, getDoc, serverTimestamp,
} from 'firebase/firestore';
import type { Loan, SavingGoal } from '@/src/context/FinanceContext';
import type { YearData } from '@/src/config/expenseData';

// ── Transactions ──
export async function saveTransaction(userId: string, data: Record<string, unknown>) {
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
export async function saveSavingGoal(userId: string, goal: SavingGoal) {
  const { id, ...data } = goal;
  return setDoc(doc(db, 'users', userId, 'savings', id), data);
}

export async function fetchSavings(userId: string): Promise<SavingGoal[]> {
  const snap = await getDocs(collection(db, 'users', userId, 'savings'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as SavingGoal));
}

export async function deleteSavingGoal(userId: string, goalId: string) {
  return deleteDoc(doc(db, 'users', userId, 'savings', goalId));
}

// ── Loans ──
export async function saveLoan(userId: string, loan: Loan) {
  const { id, ...data } = loan;
  return setDoc(doc(db, 'users', userId, 'loans', id), data);
}

export async function fetchLoans(userId: string): Promise<Loan[]> {
  const snap = await getDocs(collection(db, 'users', userId, 'loans'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Loan));
}

export async function deleteLoan(userId: string, loanId: string) {
  return deleteDoc(doc(db, 'users', userId, 'loans', loanId));
}

// ── Expense Data ──
export async function saveExpenseData(userId: string, data: YearData[]) {
  return setDoc(doc(db, 'users', userId, 'meta', 'expenseData'), { data });
}

export async function fetchExpenseData(userId: string): Promise<YearData[] | null> {
  const snap = await getDoc(doc(db, 'users', userId, 'meta', 'expenseData'));
  return snap.exists() ? (snap.data().data as YearData[]) : null;
}

// ── User Profile ──
export async function saveUserProfile(userId: string, profile: Record<string, unknown>) {
  return setDoc(doc(db, 'users', userId), profile, { merge: true });
}

// ── Init Flag ──
export async function isUserInitialized(userId: string): Promise<boolean> {
  const snap = await getDoc(doc(db, 'users', userId, 'meta', 'initialized'));
  return snap.exists();
}

export async function markUserInitialized(userId: string) {
  return setDoc(doc(db, 'users', userId, 'meta', 'initialized'), { at: serverTimestamp() });
}
