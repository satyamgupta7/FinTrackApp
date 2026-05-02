import Constants from 'expo-constants';

// ── App ─────────────────────────────────────────────────────────────────────
export const APP_VERSION = '1.0.0';
export const APP_NAME    = 'FinTrack';
export const APP_TAGLINE = 'Your personal finance companion';

// ── Auth ────────────────────────────────────────────────────────────────────
export const OWNER_CLERK_ID: string = Constants.expoConfig?.extra?.ownerClerkId ?? '';
export const CLERK_PUBLISHABLE_KEY  = Constants.expoConfig?.extra?.clerkPublishableKey as string;

// ── Currency ────────────────────────────────────────────────────────────────
export const CURRENCY         = '₹';
export const DEFAULT_CURRENCY = 'INR';

export const CURRENCIES = [
  { code: 'INR', symbol: '₹',   name: 'Indian Rupee',    flag: '🇮🇳' },
  { code: 'USD', symbol: '$',   name: 'US Dollar',        flag: '🇺🇸' },
  { code: 'EUR', symbol: '€',   name: 'Euro',             flag: '🇪🇺' },
  { code: 'GBP', symbol: '£',   name: 'British Pound',    flag: '🇬🇧' },
  { code: 'JPY', symbol: '¥',   name: 'Japanese Yen',     flag: '🇯🇵' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham',       flag: '🇦🇪' },
  { code: 'SGD', symbol: 'S$',  name: 'Singapore Dollar', flag: '🇸🇬' },
  { code: 'CAD', symbol: 'C$',  name: 'Canadian Dollar',  flag: '🇨🇦' },
] as const;

// ── Routes ──────────────────────────────────────────────────────────────────
export const ROUTES = {
  SIGN_IN:           '/(auth)/sign-in'  as const,
  SIGN_UP:           '/(auth)/sign-up'  as const,
  DASHBOARD:         '/(tabs)/dashboard' as const,
  SAVINGS:           '/(tabs)/savings'   as const,
  LOANS:             '/(tabs)/loans'     as const,
  EXPENSES:          '/(tabs)/expenses'  as const,
  MORE:              '/(tabs)/more'      as const,
  LOAN_DETAIL:       '/loan-detail'      as const,
  PROFILE:           '/profile'          as const,
  BUDGET_PLANNER:    '/budget-planner'   as const,
  REPORTS:           '/reports'          as const,
  NOTIFICATIONS:     '/notifications'    as const,
  CURRENCY_SETTINGS: '/currency-settings' as const,
  SECURITY:          '/security'         as const,
  HELP:              '/help'             as const,
  ABOUT:             '/about'            as const,
} as const;

export const STACK_SCREENS = [
  '(auth)', '(tabs)', 'loan-detail', 'profile',
  'budget-planner', 'reports', 'notifications',
  'currency-settings', 'security', 'help', 'about',
] as const;

// ── Color Palettes ──────────────────────────────────────────────────────────
export const PALETTE = {
  blue:       '#1565C0',
  purple:     '#6A1B9A',
  teal:       '#00695C',
  orange:     '#E65100',
  red:        '#B71C1C',
  green:      '#1B5E20',
  grey:       '#37474F',
  amber:      '#F57F17',
  brown:      '#4E342E',
  blueGrey:   '#546E7A',
  slateGrey:  '#37474F',
} as const;

export const GOAL_COLORS: string[] = [PALETTE.blue, PALETTE.purple, PALETTE.teal, PALETTE.orange, PALETTE.red, PALETTE.green];
export const LOAN_COLORS: string[] = [PALETTE.orange, PALETTE.blue, PALETTE.brown, PALETTE.green, PALETTE.purple, PALETTE.red];
export const CAT_COLORS:  string[] = [PALETTE.green, PALETTE.orange, PALETTE.blue, PALETTE.purple, PALETTE.teal, PALETTE.red, PALETTE.grey, PALETTE.amber, PALETTE.brown];

// ── Quick Actions (Dashboard) ────────────────────────────────────────────────
export const QUICK_ACTIONS = [
  { label: 'Reports',  icon: 'bar-chart-outline',  color: PALETTE.purple, route: ROUTES.REPORTS        },
  { label: 'Budget',   icon: 'calculator-outline', color: PALETTE.green,  route: ROUTES.BUDGET_PLANNER },
  { label: 'Expenses', icon: 'receipt-outline',    color: PALETTE.orange, route: ROUTES.EXPENSES       },
  { label: 'Loans',    icon: 'cash-outline',       color: PALETTE.blue,   route: ROUTES.LOANS          },
] as const;

// ── More Menu ────────────────────────────────────────────────────────────────
export const MORE_MENU_ITEMS = [
  { id: '1', label: 'Profile',             icon: 'person-outline',             color: PALETTE.blue,     route: ROUTES.PROFILE           },
  { id: '2', label: 'Budget Planner',      icon: 'calculator-outline',         color: PALETTE.green,    route: ROUTES.BUDGET_PLANNER    },
  { id: '3', label: 'Reports & Analytics', icon: 'bar-chart-outline',          color: PALETTE.purple,   route: ROUTES.REPORTS           },
  { id: '4', label: 'Notifications',       icon: 'notifications-outline',      color: PALETTE.orange,   route: ROUTES.NOTIFICATIONS     },
  { id: '5', label: 'Currency Settings',   icon: 'globe-outline',              color: PALETTE.teal,     route: ROUTES.CURRENCY_SETTINGS },
  { id: '6', label: 'Security',            icon: 'shield-checkmark-outline',   color: PALETTE.red,      route: ROUTES.SECURITY          },
  { id: '7', label: 'Help & Support',      icon: 'help-circle-outline',        color: PALETTE.grey,     route: ROUTES.HELP              },
  { id: '8', label: 'About',               icon: 'information-circle-outline', color: PALETTE.blueGrey, route: ROUTES.ABOUT             },
] as const;

// ── Bottom Nav (Loan Detail) ─────────────────────────────────────────────────
export const BOTTOM_TABS = [
  { label: 'Dashboard', icon: 'home',    route: ROUTES.DASHBOARD },
  { label: 'Savings',   icon: 'wallet',  route: ROUTES.SAVINGS   },
  { label: 'Loans',     icon: 'cash',    route: ROUTES.LOANS     },
  { label: 'Expenses',  icon: 'receipt', route: ROUTES.EXPENSES  },
] as const;

// ── About Screen ─────────────────────────────────────────────────────────────
export const FEATURES = [
  { icon: 'wallet-outline',    color: PALETTE.blue,   text: 'Track savings goals with progress' },
  { icon: 'cash-outline',      color: PALETTE.orange, text: 'Manage loans & EMI schedules' },
  { icon: 'receipt-outline',   color: PALETTE.purple, text: 'Monthly expense tracking & categories' },
  { icon: 'bar-chart-outline', color: PALETTE.green,  text: 'Reports & analytics dashboard' },
  { icon: 'calculator-outline',color: PALETTE.teal,   text: 'Budget planner with actuals' },
  { icon: 'cloud-outline',     color: PALETTE.grey,   text: 'Cloud sync via Firebase' },
] as const;

export const BUILT_WITH = [
  { label: 'React Native + Expo', icon: 'phone-portrait-outline', color: PALETTE.blue   },
  { label: 'Expo Router',         icon: 'navigate-outline',       color: PALETTE.purple },
  { label: 'Clerk Auth',          icon: 'shield-outline',         color: PALETTE.green  },
  { label: 'Firebase Firestore',  icon: 'cloud-outline',          color: PALETTE.orange },
] as const;

// ── Help Screen ──────────────────────────────────────────────────────────────
export const FAQS = [
  { q: 'How do I add a new loan?',           a: 'Go to the Loans tab and tap the "Add" button in the top right corner.' },
  { q: 'How do I track my savings?',          a: 'Navigate to the Savings tab to add and manage your savings goals.' },
  { q: 'Can I edit expense data?',            a: 'Yes, go to the Expenses tab, tap the pencil icon on any month column to edit values.' },
  { q: 'How is Net Worth calculated?',        a: 'Net Worth = Total Savings − Total Loan Remaining.' },
  { q: 'How do I change my password?',        a: 'Go to More → Security → Change Password.' },
  { q: 'Is my data backed up?',               a: 'Yes, all your data is securely stored in Firebase Firestore and synced across devices.' },
  { q: 'How do I add a custom category?',     a: 'In the Expenses tab, tap "Add Category" to create a custom expense category.' },
  { q: 'Can I delete a month from expenses?', a: 'Yes, tap the trash icon in the column header of any month in the Expenses tab.' },
] as const;

export const HELP_CONTACTS = [
  { icon: 'mail-outline', color: PALETTE.blue,  label: 'Email Support', sub: 'support@fintrack.app', url: 'mailto:support@fintrack.app' },
  { icon: 'logo-github',  color: PALETTE.grey,  label: 'GitHub',        sub: 'Report bugs & feature requests', url: 'https://github.com' },
] as const;

// ── Notifications ────────────────────────────────────────────────────────────
export const INITIAL_NOTIFICATIONS = [
  { id: '1', title: 'EMI Reminders',     desc: 'Get reminded 3 days before EMI due date',  icon: 'calendar-outline',           color: PALETTE.orange, enabled: true  },
  { id: '2', title: 'Budget Alerts',      desc: 'Alert when spending exceeds budget limit', icon: 'warning-outline',            color: PALETTE.amber,  enabled: true  },
  { id: '3', title: 'Savings Milestones', desc: 'Celebrate when you hit a savings goal',    icon: 'trophy-outline',             color: PALETTE.blue,   enabled: true  },
  { id: '4', title: 'Monthly Summary',    desc: 'Monthly income & expense summary report',  icon: 'bar-chart-outline',          color: PALETTE.purple, enabled: false },
  { id: '5', title: 'Loan Payoff Alert',  desc: 'Notify when a loan is fully paid off',     icon: 'checkmark-circle-outline',   color: PALETTE.green,  enabled: true  },
  { id: '6', title: 'Overspend Warning',  desc: 'Alert when total spend exceeds income',    icon: 'alert-circle-outline',       color: PALETTE.red,    enabled: true  },
  { id: '7', title: 'Weekly Digest',      desc: 'Weekly summary of your finances',          icon: 'newspaper-outline',          color: PALETTE.teal,   enabled: false },
  { id: '8', title: 'App Updates',        desc: 'Get notified about new features',          icon: 'information-circle-outline', color: PALETTE.blueGrey, enabled: false },
] as const;

// ── Budget Planner ───────────────────────────────────────────────────────────
export const DEFAULT_BUDGETS = [
  { key: 'emi',        label: 'EMI',         color: PALETTE.orange, budget: 45780 },
  { key: 'invest',     label: 'Investment',  color: PALETTE.blue,   budget: 10000 },
  { key: 'rent',       label: 'Rent',        color: PALETTE.purple, budget: 7000  },
  { key: 'insurance',  label: 'Insurance',   color: PALETTE.teal,   budget: 2000  },
  { key: 'medicine',   label: 'Medicine',    color: PALETTE.red,    budget: 5000  },
  { key: 'personal',   label: 'Personal',    color: PALETTE.grey,   budget: 5000  },
  { key: 'credit',     label: 'Credit Card', color: PALETTE.amber,  budget: 15000 },
  { key: 'familyCash', label: 'Family/Cash', color: PALETTE.brown,  budget: 10000 },
] as const;

// ── Expenses Screen ──────────────────────────────────────────────────────────
export const MONTHS_LIST = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] as const;
export const INCOME_KEYS   = new Set(['paycheck']);
export const FIXED_KEYS    = new Set(['emi', 'invest', 'rent', 'insurance', 'medicine']);
export const VARIABLE_KEYS = new Set(['personal', 'credit', 'familyCash']);
