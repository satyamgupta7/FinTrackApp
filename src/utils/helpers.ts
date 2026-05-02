import { CURRENCY } from '@/src/config/common.constants';

export function getGreeting(firstName: string): string {
  const hour = new Date().getHours();
  if (hour < 12) return `Good Morning, ${firstName} 🌅`;
  if (hour < 17) return `Good Afternoon, ${firstName} ☀️`;
  return `Good Evening, ${firstName} 🌙`;
}

export function formatINR(amount: number): string {
  const abs = Math.abs(amount);
  const formatted = `${CURRENCY}${abs.toLocaleString('en-IN')}`;
  return amount < 0 ? `-${formatted}` : formatted;
}
