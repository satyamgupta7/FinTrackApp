import { OWNER_CLERK_ID } from '@/src/config/common.constants';
import { LOANS } from '@/src/config/loanData';
import { EXPENSE_DATA, YearData } from '@/src/config/expenseData';
import { DEFAULT_NEW_USER_LOANS, DEFAULT_NEW_USER_SAVINGS, DEFAULT_NEW_USER_EXPENSES } from '@/src/config/defaultData';
import {
  fetchLoans, fetchSavings, fetchExpenseData,
  saveLoan, saveSavingGoal, saveExpenseData,
  deleteLoan, deleteSavingGoal,
  isUserInitialized, markUserInitialized,
} from '@/src/services/firestore';
import { useAuth } from '@clerk/clerk-expo';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export type SavingGoal = {
  id: string;
  name: string;
  target: number;
  saved: number;
  color: string;
};

export type Loan = {
  id: string;
  name: string;
  total: number;
  remaining: number;
  emi: number;
  origTerm: number;
  dueTerm: number;
  dueDate: string;
  color: string;
};

export type Category = {
  key: string;
  label: string;
  color: string;
  isSystem?: boolean;
};

export const SYSTEM_CATEGORIES: Category[] = [
  { key: 'paycheck',   label: 'PAYCHECK',    color: '#1B5E20', isSystem: true },
  { key: 'emi',        label: 'EMI',         color: '#E65100', isSystem: true },
  { key: 'invest',     label: 'INVEST',      color: '#1565C0', isSystem: true },
  { key: 'rent',       label: 'RENT',        color: '#6A1B9A', isSystem: true },
  { key: 'insurance',  label: 'INSURANCE',   color: '#00695C', isSystem: true },
  { key: 'medicine',   label: 'MEDICINE',    color: '#B71C1C', isSystem: true },
  { key: 'personal',   label: 'PERSONAL',    color: '#37474F', isSystem: true },
  { key: 'credit',     label: 'CREDIT',      color: '#F57F17', isSystem: true },
  { key: 'familyCash', label: 'FAMILY/CASH', color: '#4E342E', isSystem: true },
  { key: 'totalSpend', label: 'TOTAL SPEND', color: '#B71C1C', isSystem: true },
  { key: 'saving',     label: 'SAVING',      color: '#1B5E20', isSystem: true },
];

export const DEFAULT_SAVINGS: SavingGoal[] = [
  { id: 'default-1', name: 'Emergency Fund', target: 300000, saved: 0, color: '#1565C0' },
  { id: 'default-2', name: 'Mutual Fund',    target: 150000, saved: 0, color: '#6A1B9A' },
];

const OWNER_SAVINGS: SavingGoal[] = [
  { id: 'default-1', name: 'Emergency Fund', target: 300000, saved: 200000, color: '#1565C0' },
  { id: 'default-2', name: 'Mutual Fund',    target: 150000, saved: 65000,  color: '#6A1B9A' },
];

type FinanceStore = {
  savings: SavingGoal[];
  loans: Loan[];
  expenseData: YearData[];
  categories: Category[];
  loading: boolean;
  setSavings: (updater: (prev: SavingGoal[]) => SavingGoal[]) => Promise<void>;
  setLoans: (updater: (prev: Loan[]) => Loan[]) => Promise<void>;
  setExpenseData: (updater: (prev: YearData[]) => YearData[]) => Promise<void>;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  addOrUpdateLoan: (loan: Loan) => Promise<void>;
  removeLoan: (id: string) => Promise<void>;
  addOrUpdateSaving: (goal: SavingGoal) => Promise<void>;
  removeSaving: (id: string) => Promise<void>;
};

const FinanceContext = createContext<FinanceStore | null>(null);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const { userId } = useAuth();
  const [savings, setSavingsState]         = useState<SavingGoal[]>(DEFAULT_SAVINGS);
  const [loans, setLoansState]             = useState<Loan[]>(LOANS);
  const [expenseData, setExpenseDataState] = useState<YearData[]>(EXPENSE_DATA);
  const [categories, setCategories]        = useState<Category[]>(SYSTEM_CATEGORIES);
  const [loading, setLoading]              = useState(true);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [firestoreLoans, firestoreSavings, firestoreExpenses, initialized] = await Promise.all([
          fetchLoans(userId),
          fetchSavings(userId),
          fetchExpenseData(userId),
          isUserInitialized(userId),
        ]);

        if (cancelled) return;

        const hasLoans    = firestoreLoans.length > 0;
        const hasSavings  = firestoreSavings.length > 0;
        const hasExpenses = firestoreExpenses != null && firestoreExpenses.length > 0;

        if (hasLoans)    setLoansState(firestoreLoans);
        if (hasSavings)  setSavingsState(firestoreSavings);
        if (hasExpenses) setExpenseDataState(firestoreExpenses!);

        if (!initialized) {
          const isOwner    = userId === OWNER_CLERK_ID;
          const seedLoans    = isOwner ? LOANS         : DEFAULT_NEW_USER_LOANS;
          const seedSavings  = isOwner ? OWNER_SAVINGS : DEFAULT_NEW_USER_SAVINGS;
          const seedExpenses = isOwner ? EXPENSE_DATA  : DEFAULT_NEW_USER_EXPENSES;

          await Promise.all([
            !hasLoans    && Promise.all(seedLoans.map(l => saveLoan(userId, l))),
            !hasSavings  && Promise.all(seedSavings.map(g => saveSavingGoal(userId, g))),
            !hasExpenses && saveExpenseData(userId, seedExpenses),
            markUserInitialized(userId),
          ].filter(Boolean));

          if (cancelled) return;
          if (!hasLoans)    setLoansState(seedLoans);
          if (!hasSavings)  setSavingsState(seedSavings);
          if (!hasExpenses) setExpenseDataState(seedExpenses);
        }
      } catch (e) {
        if (!cancelled) console.warn('Firestore error, using local defaults', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [userId]);

  const addOrUpdateLoan = useCallback(async (loan: Loan) => {
    setLoansState(prev =>
      prev.find(l => l.id === loan.id)
        ? prev.map(l => l.id === loan.id ? loan : l)
        : [...prev, loan]
    );
    if (userId) await saveLoan(userId, loan);
  }, [userId]);

  const removeLoan = useCallback(async (id: string) => {
    setLoansState(prev => prev.filter(l => l.id !== id));
    if (userId) await deleteLoan(userId, id);
  }, [userId]);

  const addOrUpdateSaving = useCallback(async (goal: SavingGoal) => {
    setSavingsState(prev =>
      prev.find(g => g.id === goal.id)
        ? prev.map(g => g.id === goal.id ? goal : g)
        : [...prev, goal]
    );
    if (userId) await saveSavingGoal(userId, goal);
  }, [userId]);

  const removeSaving = useCallback(async (id: string) => {
    setSavingsState(prev => prev.filter(g => g.id !== id));
    if (userId) await deleteSavingGoal(userId, id);
  }, [userId]);

  // Use functional updater + ref pattern to avoid stale closure on batch saves
  const setSavings = useCallback(async (updater: (prev: SavingGoal[]) => SavingGoal[]) => {
    if (!userId) { setSavingsState(updater); return; }
    const next = await new Promise<SavingGoal[]>(resolve => {
      setSavingsState(prev => { const n = updater(prev); resolve(n); return n; });
    });
    await Promise.all(next.map(g => saveSavingGoal(userId, g)));
  }, [userId]);

  const setLoans = useCallback(async (updater: (prev: Loan[]) => Loan[]) => {
    if (!userId) { setLoansState(updater); return; }
    const next = await new Promise<Loan[]>(resolve => {
      setLoansState(prev => { const n = updater(prev); resolve(n); return n; });
    });
    await Promise.all(next.map(l => saveLoan(userId, l)));
  }, [userId]);

  const setExpenseData = useCallback(async (updater: (prev: YearData[]) => YearData[]) => {
    if (!userId) { setExpenseDataState(updater); return; }
    const next = await new Promise<YearData[]>(resolve => {
      setExpenseDataState(prev => { const n = updater(prev); resolve(n); return n; });
    });
    await saveExpenseData(userId, next);
  }, [userId]);

  return (
    <FinanceContext.Provider value={{
      savings, loans, expenseData, categories, loading,
      setSavings, setLoans, setExpenseData, setCategories,
      addOrUpdateLoan, removeLoan, addOrUpdateSaving, removeSaving,
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used inside FinanceProvider');
  return ctx;
}
