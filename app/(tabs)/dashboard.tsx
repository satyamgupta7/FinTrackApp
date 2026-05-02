import { useTheme } from '@/src/hooks/useTheme';
import { useFinance } from '@/src/context/FinanceContext';
import { formatINR, getGreeting } from '@/src/utils/helpers';
import { QUICK_ACTIONS, ROUTES } from '@/src/config/common.constants';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const { colors, styles: g } = useTheme();
  const { savings, loans, expenseData } = useFinance();
  const { user } = useUser();
  const router = useRouter();
  const firstName = user?.firstName ?? 'User';

  const stats = useMemo(() => {
    const totalSavings       = savings.reduce((sum, g) => sum + g.saved, 0);
    const totalLoanDue       = loans.reduce((sum, l) => sum + l.remaining, 0);
    const totalEMI           = loans.reduce((sum, l) => sum + l.emi, 0);
    const totalLoanOriginal  = loans.reduce((sum, l) => sum + l.total, 0);
    const totalSavingsTarget = savings.reduce((sum, g) => sum + g.target, 0);
    const allMonths = expenseData.flatMap(y => y.months);
    const last3     = allMonths.slice(-3);
    const latest    = allMonths[allMonths.length - 1];
    const avgIncome  = last3.length ? Math.round(last3.reduce((s, m) => s + m.paycheck, 0) / last3.length) : 0;
    const avgSpend   = last3.length ? Math.round(last3.reduce((s, m) => s + m.totalSpend, 0) / last3.length) : 0;
    const savingRate  = avgIncome > 0 ? Math.round(((avgIncome - avgSpend) / avgIncome) * 100) : 0;
    const loanPaidPct = totalLoanOriginal > 0 ? Math.round(((totalLoanOriginal - totalLoanDue) / totalLoanOriginal) * 100) : 0;
    const savingsPct  = totalSavingsTarget > 0 ? Math.round((totalSavings / totalSavingsTarget) * 100) : 0;
    const breakdown = latest ? [
      { label: 'EMI',      val: latest.emi,        color: '#E65100' },
      { label: 'Invest',   val: latest.invest,     color: '#1565C0' },
      { label: 'Rent',     val: latest.rent,       color: '#6A1B9A' },
      { label: 'Medicine', val: latest.medicine,   color: '#B71C1C' },
      { label: 'Personal', val: latest.personal,   color: '#37474F' },
      { label: 'Credit',   val: latest.credit,     color: '#F57F17' },
      { label: 'Family',   val: latest.familyCash, color: '#4E342E' },
    ].filter(c => c.val > 0) : [];
    return {
      totalSavings, totalLoanDue, totalEMI, totalSavingsTarget,
      avgIncome, avgSpend, savingRate, loanPaidPct, savingsPct,
      breakdown, latest,
      totalBreakdown: breakdown.reduce((s, c) => s + c.val, 0),
      networth: totalSavings - totalLoanDue,
    };
  }, [savings, loans, expenseData]);

  const { totalSavings, totalLoanDue, totalEMI, totalSavingsTarget,
          avgIncome, avgSpend, savingRate, loanPaidPct, savingsPct,
          breakdown, totalBreakdown, latest, networth } = stats;

  const savingRateColor = savingRate >= 20 ? colors.income : savingRate >= 0 ? '#F57F17' : colors.expense;

  return (
    <ScrollView style={g.container} contentContainerStyle={g.scrollContent}>
      <Text style={g.greeting}>{getGreeting(firstName)}</Text>
      <Text style={[g.metaText, { marginBottom: 16 }]}>Your Financial Overview</Text>

      <View style={g.networthCard}>
        <Text style={g.networthLabel}>Net Worth</Text>
        <Text style={g.networthAmount}>{formatINR(networth)}</Text>
        <Text style={g.networthSub}>{networth >= 0 ? '↑ Positive net worth' : '↓ Liabilities exceed assets'}</Text>
      </View>

      <View style={g.statsRow}>
        <TouchableOpacity style={[g.statCard, { borderLeftColor: colors.saving }]} onPress={() => router.push(ROUTES.SAVINGS)}>
          <Text style={g.statLabel}>Total Savings</Text>
          <Text style={[g.statAmount, { color: colors.saving }]}>{formatINR(totalSavings)}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[g.statCard, { borderLeftColor: colors.expense }]} onPress={() => router.push(ROUTES.LOANS)}>
          <Text style={g.statLabel}>Loan Due</Text>
          <Text style={[g.statAmount, { color: colors.expense }]}>{formatINR(totalLoanDue)}</Text>
        </TouchableOpacity>
      </View>
      <View style={g.statsRow}>
        <View style={[g.statCard, { borderLeftColor: colors.income }]}>
          <Text style={g.statLabel}>Avg Income</Text>
          <Text style={[g.statAmount, { color: colors.income }]}>{formatINR(avgIncome)}</Text>
        </View>
        <View style={[g.statCard, { borderLeftColor: colors.loan }]}>
          <Text style={g.statLabel}>Monthly EMI</Text>
          <Text style={[g.statAmount, { color: colors.loan }]}>{formatINR(totalEMI)}</Text>
        </View>
      </View>

      <View style={g.card}>
        <View style={g.cardHeader}>
          <Text style={g.sectionTitleSm}>Saving Rate</Text>
          <Text style={[g.cardBadge, { color: savingRateColor }]}>{savingRate}%</Text>
        </View>
        <View style={g.progressBg}>
          <View style={[g.progressFill, { width: `${Math.min(100, Math.max(0, savingRate))}%` as `${number}%`, backgroundColor: savingRateColor }]} />
        </View>
        <View style={g.cardRow}>
          <Text style={g.metaText}>Avg Income: <Text style={{ color: colors.income, fontWeight: '700' }}>{formatINR(avgIncome)}</Text></Text>
          <Text style={g.metaText}>Avg Spend: <Text style={{ color: colors.expense, fontWeight: '700' }}>{formatINR(avgSpend)}</Text></Text>
        </View>
        <Text style={[g.metaText, { color: savingRateColor, fontWeight: '600', marginTop: 8 }]}>
          {savingRate >= 20 ? '✓ Great! You are saving well.' : savingRate >= 0 ? '⚠ Try to save at least 20% of income.' : '✗ Spending exceeds income.'}
        </Text>
      </View>

      {breakdown.length > 0 && (
        <View style={g.card}>
          <Text style={g.sectionTitleSm}>Spend Breakdown — {latest?.month}</Text>
          {breakdown.map(c => (
            <View key={c.label} style={g.breakRow}>
              <View style={[g.dot, { backgroundColor: c.color }]} />
              <Text style={g.breakLabel}>{c.label}</Text>
              <View style={g.breakBarBg}>
                <View style={[g.breakBarFill, { width: `${totalBreakdown > 0 ? (c.val / totalBreakdown) * 100 : 0}%` as `${number}%`, backgroundColor: c.color }]} />
              </View>
              <Text style={[g.breakAmt, { color: c.color }]}>{formatINR(c.val)}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={g.statsRow}>
        <TouchableOpacity style={[g.card, { flex: 1, marginBottom: 12 }]} onPress={() => router.push(ROUTES.LOANS)}>
          <View style={g.healthHeader}>
            <Ionicons name="cash-outline" size={18} color={colors.loan} />
            <Text style={[g.rowTitle, { fontSize: 13 }]}>Loan Health</Text>
          </View>
          <Text style={[g.healthPct, { color: colors.loan }]}>{loanPaidPct}% paid</Text>
          <View style={g.progressBg}>
            <View style={[g.progressFill, { width: `${loanPaidPct}%` as `${number}%`, backgroundColor: colors.loan }]} />
          </View>
          <Text style={[g.metaText, { marginTop: 6, fontSize: 11 }]}>{formatINR(totalLoanDue)} remaining</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[g.card, { flex: 1, marginBottom: 12 }]} onPress={() => router.push(ROUTES.SAVINGS)}>
          <View style={g.healthHeader}>
            <Ionicons name="wallet-outline" size={18} color={colors.saving} />
            <Text style={[g.rowTitle, { fontSize: 13 }]}>Savings Goal</Text>
          </View>
          <Text style={[g.healthPct, { color: colors.saving }]}>{savingsPct}% reached</Text>
          <View style={g.progressBg}>
            <View style={[g.progressFill, { width: `${Math.min(100, savingsPct)}%` as `${number}%`, backgroundColor: colors.saving }]} />
          </View>
          <Text style={[g.metaText, { marginTop: 6, fontSize: 11 }]}>{formatINR(totalSavings)} of {formatINR(totalSavingsTarget)}</Text>
        </TouchableOpacity>
      </View>

      <Text style={[g.sectionTitle, { marginTop: 4 }]}>Quick Actions</Text>
      <View style={g.actionsRow}>
        {QUICK_ACTIONS.map(a => (
          <TouchableOpacity key={a.label} style={g.actionBtn} onPress={() => router.push(a.route as any)}>
            <View style={[g.actionIcon, { backgroundColor: a.color + '18' }]}>
              <Ionicons name={a.icon as any} size={22} color={a.color} />
            </View>
            <Text style={[g.metaText, { fontWeight: '600', fontSize: 12 }]}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
