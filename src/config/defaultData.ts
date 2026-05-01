import { SavingGoal, Loan } from '@/src/context/FinanceContext';
import { YearData } from '@/src/config/expenseData';

export const DEFAULT_NEW_USER_LOANS: Loan[] = [
  { id: '1', name: 'Loan 1', total: 0, remaining: 0, emi: 29698, origTerm: 0, dueTerm: 0, dueDate: '', color: '#E65100' },
  { id: '2', name: 'Loan 2', total: 0, remaining: 0, emi: 0,     origTerm: 0, dueTerm: 0, dueDate: '', color: '#1565C0' },
];

export const DEFAULT_NEW_USER_SAVINGS: SavingGoal[] = [
  { id: 'default-1', name: 'Emergency Fund', target: 300000, saved: 0, color: '#1565C0' },
  { id: 'default-2', name: 'Mutual Fund',    target: 150000, saved: 0, color: '#6A1B9A' },
];

export const DEFAULT_NEW_USER_EXPENSES: YearData[] = [
  {
    year: '2026',
    months: [
      { month: 'Aug-26', paycheck: 100000, emi: 29698, invest: 0, rent: 0, insurance: 0, medicine: 0, personal: 0, credit: 0, familyCash: 0, totalSpend: 29698, saving: null },
    ],
  },
];
