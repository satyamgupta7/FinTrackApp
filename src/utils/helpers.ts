import { CURRENCY } from '@/src/config/constants';

export function getGreeting(firstName: string): string {
  const hour = new Date().getHours();
  if (hour < 12) return `Good Morning, ${firstName} 🌅`;
  if (hour < 17) return `Good Afternoon, ${firstName} ☀️`;
  return `Good Evening, ${firstName} 🌙`;
}

export function formatINR(amount: number): string {
  return `${CURRENCY}${amount.toLocaleString('en-IN')}`;
}
