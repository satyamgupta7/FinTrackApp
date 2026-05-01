import { Colors } from '@/src/config/theme';
import { useFinance } from '@/src/context/FinanceContext';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { formatINR, getGreeting } from '@/src/utils/helpers';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BAR_W = Dimensions.get('window').width - 64;

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const s = styles(colors);
  const { savings, loans, expenseData } = useFinance();
  const { user } = useUser();
  const router = useRouter();

  const firstName = user?.firstName ?? 'User';

  const totalSavings = savings.reduce((sum, g) => sum + g.saved, 0);
  const totalLoanDue = loans.reduce((sum, l) => sum + l.remaining, 0);
  const totalEMI     = loans.reduce((sum, l) => sum + l.emi, 0);
  const networth     = totalSavings - totalLoanDue;

  // Last 3 months analysis
  const allMonths  = expenseData.flatMap(y => y.months);
  const last3      = allMonths.slice(-3);
  const latest     = allMonths[allMonths.length - 1];
  const avgIncome  = last3.length ? Math.round(last3.reduce((s, m) => s + m.paycheck, 0) / last3.length) : 0;
  const avgSpend   = last3.length ? Math.round(last3.reduce((s, m) => s + m.totalSpend, 0) / last3.length) : 0;
  const avgSaving  = last3.length ? Math.round(last3.reduce((s, m) => s + (m.saving ?? 0), 0) / last3.length) : 0;
  const savingRate = avgIncome > 0 ? Math.round(((avgIncome - avgSpend) / avgIncome) * 100) : 0;

  // Spend breakdown for latest month
  const breakdown = latest ? [
    { label: 'EMI',        val: latest.emi,        color: '#E65100' },
    { label: 'Invest',     val: latest.invest,     color: '#1565C0' },
    { label: 'Rent',       val: latest.rent,       color: '#6A1B9A' },
    { label: 'Medicine',   val: latest.medicine,   color: '#B71C1C' },
    { label: 'Personal',   val: latest.personal,   color: '#37474F' },
    { label: 'Credit',     val: latest.credit,     color: '#F57F17' },
    { label: 'Family',     val: latest.familyCash, color: '#4E342E' },
  ].filter(c => c.val > 0) : [];
  const totalBreakdown = breakdown.reduce((s, c) => s + c.val, 0);

  // Loan health
  const totalLoanOriginal = loans.reduce((s, l) => s + l.total, 0);
  const loanPaidPct = totalLoanOriginal > 0 ? Math.round(((totalLoanOriginal - totalLoanDue) / totalLoanOriginal) * 100) : 0;

  // Savings health
  const totalSavingsTarget = savings.reduce((s, g) => s + g.target, 0);
  const savingsProgressPct = totalSavingsTarget > 0 ? Math.round((totalSavings / totalSavingsTarget) * 100) : 0;

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={s.greeting}>{getGreeting(firstName)}</Text>
      <Text style={s.subtitle}>Your Financial Overview</Text>

      {/* Net Worth */}
      <View style={s.networthCard}>
        <Text style={s.networthLabel}>Net Worth</Text>
        <Text style={s.networthAmount}>{formatINR(networth)}</Text>
        <Text style={s.networthSub}>{networth >= 0 ? '↑ Positive net worth' : '↓ Liabilities exceed assets'}</Text>
      </View>

      {/* Stat Cards */}
      <View style={s.statsRow}>
        <TouchableOpacity style={[s.statCard, { borderLeftColor: colors.saving }]} onPress={() => router.push('/(tabs)/savings')}>
          <Text style={s.statLabel}>Total Savings</Text>
          <Text style={[s.statAmount, { color: colors.saving }]}>{formatINR(totalSavings)}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.statCard, { borderLeftColor: colors.expense }]} onPress={() => router.push('/(tabs)/loans')}>
          <Text style={s.statLabel}>Loan Due</Text>
          <Text style={[s.statAmount, { color: colors.expense }]}>{formatINR(totalLoanDue)}</Text>
        </TouchableOpacity>
      </View>
      <View style={s.statsRow}>
        <View style={[s.statCard, { borderLeftColor: colors.income }]}>
          <Text style={s.statLabel}>Avg Income</Text>
          <Text style={[s.statAmount, { color: colors.income }]}>{formatINR(avgIncome)}</Text>
        </View>
        <View style={[s.statCard, { borderLeftColor: colors.loan }]}>
          <Text style={s.statLabel}>Monthly EMI</Text>
          <Text style={[s.statAmount, { color: colors.loan }]}>{formatINR(totalEMI)}</Text>
        </View>
      </View>

      {/* Saving Rate */}
      <View style={s.card}>
        <View style={s.cardHeader}>
          <Text style={s.cardTitle}>Saving Rate</Text>
          <Text style={[s.cardBadge, { color: savingRate >= 20 ? colors.income : savingRate >= 0 ? '#F57F17' : colors.expense }]}>
            {savingRate}%
          </Text>
        </View>
        <View style={s.progressBg}>
          <View style={[s.progressFill, {
            width: `${Math.min(100, Math.max(0, savingRate))}%` as any,
            backgroundColor: savingRate >= 20 ? colors.income : savingRate >= 0 ? '#F57F17' : colors.expense,
          }]} />
        </View>
        <View style={s.cardRow}>
          <Text style={s.cardMeta}>Avg Income: <Text style={{ color: colors.income, fontWeight: '700' }}>{formatINR(avgIncome)}</Text></Text>
          <Text style={s.cardMeta}>Avg Spend: <Text style={{ color: colors.expense, fontWeight: '700' }}>{formatINR(avgSpend)}</Text></Text>
        </View>
        <Text style={[s.cardHint, { color: savingRate >= 20 ? colors.income : '#F57F17' }]}>
          {savingRate >= 20 ? '✓ Great! You are saving well.' : savingRate >= 0 ? '⚠ Try to save at least 20% of income.' : '✗ Spending exceeds income.'}
        </Text>
      </View>

      {/* Spend Breakdown */}
      {breakdown.length > 0 && (
        <View style={s.card}>
          <Text style={s.cardTitle}>Spend Breakdown — {latest?.month}</Text>
          {breakdown.map(c => (
            <View key={c.label} style={s.breakRow}>
              <View style={[s.dot, { backgroundColor: c.color }]} />
              <Text style={s.breakLabel}>{c.label}</Text>
              <View style={s.breakBarBg}>
                <View style={[s.breakBarFill, {
                  width: `${totalBreakdown > 0 ? (c.val / totalBreakdown) * 100 : 0}%` as any,
                  backgroundColor: c.color,
                }]} />
              </View>
              <Text style={[s.breakAmt, { color: c.color }]}>{formatINR(c.val)}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Loan & Savings Health */}
      <View style={s.statsRow}>
        <TouchableOpacity style={s.healthCard} onPress={() => router.push('/(tabs)/loans')}>
          <View style={s.healthHeader}>
            <Ionicons name="cash-outline" size={18} color={colors.loan} />
            <Text style={s.healthTitle}>Loan Health</Text>
          </View>
          <Text style={[s.healthPct, { color: colors.loan }]}>{loanPaidPct}% paid</Text>
          <View style={s.progressBg}>
            <View style={[s.progressFill, { width: `${loanPaidPct}%` as any, backgroundColor: colors.loan }]} />
          </View>
          <Text style={s.healthSub}>{formatINR(totalLoanDue)} remaining</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.healthCard} onPress={() => router.push('/(tabs)/savings')}>
          <View style={s.healthHeader}>
            <Ionicons name="wallet-outline" size={18} color={colors.saving} />
            <Text style={s.healthTitle}>Savings Goal</Text>
          </View>
          <Text style={[s.healthPct, { color: colors.saving }]}>{savingsProgressPct}% reached</Text>
          <View style={s.progressBg}>
            <View style={[s.progressFill, { width: `${Math.min(100, savingsProgressPct)}%` as any, backgroundColor: colors.saving }]} />
          </View>
          <Text style={s.healthSub}>{formatINR(totalSavings)} of {formatINR(totalSavingsTarget)}</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <Text style={s.sectionTitle}>Quick Actions</Text>
      <View style={s.actionsRow}>
        {[
          { label: 'Reports',  icon: 'bar-chart-outline',  color: '#6A1B9A', route: '/reports'        },
          { label: 'Budget',   icon: 'calculator-outline', color: '#1B5E20', route: '/budget-planner' },
          { label: 'Expenses', icon: 'receipt-outline',    color: '#E65100', route: '/(tabs)/expenses' },
          { label: 'Loans',    icon: 'cash-outline',       color: '#1565C0', route: '/(tabs)/loans'   },
        ].map(a => (
          <TouchableOpacity key={a.label} style={s.actionBtn} onPress={() => router.push(a.route as any)}>
            <View style={[s.actionIcon, { backgroundColor: a.color + '18' }]}>
              <Ionicons name={a.icon as any} size={22} color={a.color} />
            </View>
            <Text style={s.actionLabel}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = (colors: typeof Colors.light) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  greeting: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 2 },
  subtitle: { fontSize: 13, color: colors.icon, marginBottom: 16 },
  networthCard: { backgroundColor: '#1565C0', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 16 },
  networthLabel: { color: '#fff', fontSize: 14, opacity: 0.85 },
  networthAmount: { color: '#fff', fontSize: 34, fontWeight: '800', marginTop: 4 },
  networthSub: { color: '#fff', fontSize: 12, opacity: 0.75, marginTop: 6 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  statCard: { flex: 1, backgroundColor: colors.card, borderRadius: 12, padding: 16, borderLeftWidth: 4, elevation: 1 },
  statLabel: { fontSize: 12, color: colors.icon, marginBottom: 4 },
  statAmount: { fontSize: 16, fontWeight: '700' },
  card: { backgroundColor: colors.card, borderRadius: 14, padding: 16, marginBottom: 12, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  cardBadge: { fontSize: 18, fontWeight: '800' },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  cardMeta: { fontSize: 12, color: colors.icon },
  cardHint: { fontSize: 12, fontWeight: '600', marginTop: 8 },
  progressBg: { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 4 },
  breakRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  dot: { width: 9, height: 9, borderRadius: 5 },
  breakLabel: { width: 56, fontSize: 12, color: colors.text },
  breakBarBg: { flex: 1, height: 7, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' },
  breakBarFill: { height: 7, borderRadius: 4 },
  breakAmt: { width: 68, fontSize: 11, fontWeight: '700', textAlign: 'right' },
  healthCard: { flex: 1, backgroundColor: colors.card, borderRadius: 14, padding: 14, elevation: 1 },
  healthHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  healthTitle: { fontSize: 13, fontWeight: '700', color: colors.text },
  healthPct: { fontSize: 18, fontWeight: '800', marginBottom: 6 },
  healthSub: { fontSize: 11, color: colors.icon, marginTop: 6 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 10, marginTop: 4 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  actionBtn: { alignItems: 'center', gap: 6 },
  actionIcon: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  actionLabel: { fontSize: 12, color: colors.text, fontWeight: '600' },
});
