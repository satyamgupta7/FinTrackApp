import { Colors } from '@/src/config/theme';
import { useFinance } from '@/src/context/FinanceContext';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { formatINR } from '@/src/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SCREEN_W = Dimensions.get('window').width - 40;

export default function ReportsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const s = styles(colors);
  const router = useRouter();
  const { expenseData, loans, savings } = useFinance();

  const allMonths = expenseData.flatMap(y => y.months);
  const last6 = allMonths.slice(-6);

  const totalIncome  = allMonths.reduce((s, m) => s + m.paycheck, 0);
  const totalSpend   = allMonths.reduce((s, m) => s + m.totalSpend, 0);
  const totalSaving  = allMonths.reduce((s, m) => s + (m.saving ?? 0), 0);
  const totalLoanDue = loans.reduce((s, l) => s + l.remaining, 0);
  const totalSaved   = savings.reduce((s, g) => s + g.saved, 0);

  const maxSpend = Math.max(...last6.map(m => m.totalSpend), 1);

  // Category breakdown from latest month
  const latest = allMonths[allMonths.length - 1];
  const catBreakdown = latest ? [
    { label: 'EMI',         val: latest.emi,        color: '#E65100' },
    { label: 'Investment',  val: latest.invest,     color: '#1565C0' },
    { label: 'Rent',        val: latest.rent,       color: '#6A1B9A' },
    { label: 'Insurance',   val: latest.insurance,  color: '#00695C' },
    { label: 'Medicine',    val: latest.medicine,   color: '#B71C1C' },
    { label: 'Personal',    val: latest.personal,   color: '#37474F' },
    { label: 'Credit',      val: latest.credit,     color: '#F57F17' },
    { label: 'Family/Cash', val: latest.familyCash, color: '#4E342E' },
  ].filter(c => c.val > 0) : [];

  const totalCat = catBreakdown.reduce((s, c) => s + c.val, 0);

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 20 }}>
      <TouchableOpacity style={s.back} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </TouchableOpacity>
      <Text style={s.pageTitle}>Reports & Analytics</Text>

      {/* Overview Cards */}
      <View style={s.grid}>
        {[
          { label: 'Total Income',   val: totalIncome,  color: colors.income },
          { label: 'Total Spend',    val: totalSpend,   color: colors.expense },
          { label: 'Net Saving',     val: totalSaving,  color: totalSaving >= 0 ? colors.income : colors.expense },
          { label: 'Loan Remaining', val: totalLoanDue, color: colors.loan },
          { label: 'Total Saved',    val: totalSaved,   color: colors.saving },
          { label: 'Net Worth',      val: totalSaved - totalLoanDue, color: (totalSaved - totalLoanDue) >= 0 ? colors.income : colors.expense },
        ].map(item => (
          <View key={item.label} style={s.gridCard}>
            <Text style={s.gridLabel}>{item.label}</Text>
            <Text style={[s.gridAmt, { color: item.color }]}>{formatINR(item.val)}</Text>
          </View>
        ))}
      </View>

      {/* Spend Bar Chart — Last 6 months */}
      <View style={s.card}>
        <Text style={s.cardTitle}>Monthly Spend — Last 6 Months</Text>
        <View style={s.barChart}>
          {last6.map(m => {
            const h = Math.max(4, (m.totalSpend / maxSpend) * 120);
            const saving = m.saving ?? 0;
            return (
              <View key={m.month} style={s.barCol}>
                <Text style={s.barAmt}>{formatINR(m.totalSpend)}</Text>
                <View style={[s.bar, { height: h, backgroundColor: colors.expense }]} />
                <Text style={s.barLabel}>{m.month.slice(0, 3)}</Text>
                <Text style={[s.barSaving, { color: saving >= 0 ? colors.income : colors.expense }]}>
                  {saving >= 0 ? '+' : ''}{formatINR(saving)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Income vs Spend */}
      <View style={s.card}>
        <Text style={s.cardTitle}>Income vs Spend — Last 6 Months</Text>
        {last6.map(m => {
          const incPct = m.paycheck > 0 ? 100 : 0;
          const spendPct = m.paycheck > 0 ? Math.min(100, (m.totalSpend / m.paycheck) * 100) : 0;
          return (
            <View key={m.month} style={s.compareRow}>
              <Text style={s.compareMonth}>{m.month}</Text>
              <View style={{ flex: 1 }}>
                <View style={s.compareBg}>
                  <View style={[s.compareIncome, { width: `${incPct}%` as any }]} />
                </View>
                <View style={[s.compareBg, { marginTop: 3 }]}>
                  <View style={[s.compareSpend, { width: `${spendPct}%` as any }]} />
                </View>
              </View>
              <View style={s.compareAmts}>
                <Text style={[s.compareAmt, { color: colors.income }]}>{formatINR(m.paycheck)}</Text>
                <Text style={[s.compareAmt, { color: colors.expense }]}>{formatINR(m.totalSpend)}</Text>
              </View>
            </View>
          );
        })}
        <View style={s.legend}>
          <View style={s.legendItem}><View style={[s.legendDot, { backgroundColor: colors.income }]} /><Text style={s.legendText}>Income</Text></View>
          <View style={s.legendItem}><View style={[s.legendDot, { backgroundColor: colors.expense }]} /><Text style={s.legendText}>Spend</Text></View>
        </View>
      </View>

      {/* Category Breakdown */}
      {catBreakdown.length > 0 && (
        <View style={s.card}>
          <Text style={s.cardTitle}>Category Breakdown — {latest?.month}</Text>
          {catBreakdown.map(c => (
            <View key={c.label} style={s.catRow}>
              <View style={[s.catDot, { backgroundColor: c.color }]} />
              <Text style={s.catLabel}>{c.label}</Text>
              <View style={s.catBarBg}>
                <View style={[s.catBarFill, { width: `${totalCat > 0 ? (c.val / totalCat) * 100 : 0}%` as any, backgroundColor: c.color }]} />
              </View>
              <Text style={[s.catAmt, { color: c.color }]}>{formatINR(c.val)}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Loan Summary */}
      <View style={s.card}>
        <Text style={s.cardTitle}>Loan Overview</Text>
        {loans.map(l => {
          const pct = l.total > 0 ? ((l.total - l.remaining) / l.total) * 100 : 0;
          return (
            <View key={l.id} style={s.loanRow}>
              <View style={s.loanTop}>
                <Text style={s.loanName}>{l.name}</Text>
                <Text style={[s.loanPct, { color: l.color }]}>{Math.round(pct)}% paid</Text>
              </View>
              <View style={s.loanBarBg}>
                <View style={[s.loanBarFill, { width: `${pct}%` as any, backgroundColor: l.color }]} />
              </View>
              <View style={s.loanAmts}>
                <Text style={s.loanAmt}>Remaining: <Text style={{ color: colors.expense }}>{formatINR(l.remaining)}</Text></Text>
                <Text style={s.loanAmt}>EMI: <Text style={{ color: l.color }}>{formatINR(l.emi)}</Text></Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = (colors: typeof Colors.light) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  back: { marginBottom: 8 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  gridCard: { width: (SCREEN_W - 10) / 2, backgroundColor: colors.card, borderRadius: 12, padding: 14, elevation: 1 },
  gridLabel: { fontSize: 11, color: colors.icon, marginBottom: 4 },
  gridAmt: { fontSize: 15, fontWeight: '800' },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 16, elevation: 1 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 14 },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 160 },
  barCol: { alignItems: 'center', flex: 1 },
  bar: { width: 28, borderRadius: 4, marginVertical: 4 },
  barAmt: { fontSize: 8, color: colors.icon, marginBottom: 2 },
  barLabel: { fontSize: 9, color: colors.text, fontWeight: '600', marginTop: 2 },
  barSaving: { fontSize: 8, fontWeight: '600', marginTop: 1 },
  compareRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  compareMonth: { width: 48, fontSize: 10, color: colors.text, fontWeight: '600' },
  compareBg: { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  compareIncome: { height: 6, backgroundColor: '#1B5E20', borderRadius: 3 },
  compareSpend: { height: 6, backgroundColor: '#B71C1C', borderRadius: 3 },
  compareAmts: { width: 80, alignItems: 'flex-end' },
  compareAmt: { fontSize: 9, fontWeight: '600' },
  legend: { flexDirection: 'row', gap: 16, marginTop: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, color: colors.icon },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  catDot: { width: 10, height: 10, borderRadius: 5 },
  catLabel: { width: 80, fontSize: 12, color: colors.text },
  catBarBg: { flex: 1, height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' },
  catBarFill: { height: 8, borderRadius: 4 },
  catAmt: { width: 70, fontSize: 11, fontWeight: '700', textAlign: 'right' },
  loanRow: { marginBottom: 14 },
  loanTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  loanName: { fontSize: 13, fontWeight: '700', color: colors.text },
  loanPct: { fontSize: 12, fontWeight: '600' },
  loanBarBg: { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden', marginBottom: 6 },
  loanBarFill: { height: 8, borderRadius: 4 },
  loanAmts: { flexDirection: 'row', justifyContent: 'space-between' },
  loanAmt: { fontSize: 11, color: colors.icon },
});
