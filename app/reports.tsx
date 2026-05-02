import { useTheme } from '@/src/hooks/useTheme';
import { useFinance } from '@/src/context/FinanceContext';
import { formatINR } from '@/src/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ReportsScreen() {
  const { colors, styles: g } = useTheme();
  const router = useRouter();
  const { expenseData, loans, savings } = useFinance();

  const stats = useMemo(() => {
    const allMonths = expenseData.flatMap(y => y.months);
    const last6     = allMonths.slice(-6);
    const latest    = allMonths[allMonths.length - 1];
    const totalIncome  = allMonths.reduce((s, m) => s + m.paycheck, 0);
    const totalSpend   = allMonths.reduce((s, m) => s + m.totalSpend, 0);
    const totalSaving  = allMonths.reduce((s, m) => s + (m.saving ?? 0), 0);
    const totalLoanDue = loans.reduce((s, l) => s + l.remaining, 0);
    const totalSaved   = savings.reduce((s, g) => s + g.saved, 0);
    const maxSpend     = Math.max(...last6.map(m => m.totalSpend), 1);
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
    return { last6, latest, totalIncome, totalSpend, totalSaving, totalLoanDue, totalSaved, maxSpend, catBreakdown, totalCat: catBreakdown.reduce((s, c) => s + c.val, 0) };
  }, [expenseData, loans, savings]);

  const { last6, latest, totalIncome, totalSpend, totalSaving, totalLoanDue, totalSaved, maxSpend, catBreakdown, totalCat } = stats;

  return (
    <ScrollView style={g.container} contentContainerStyle={g.scrollContent20}>
      <TouchableOpacity style={g.back} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </TouchableOpacity>
      <Text style={g.pageTitle}>Reports & Analytics</Text>

      <View style={g.reportsGrid}>
        {[
          { label: 'Total Income',   val: totalIncome,  color: colors.income },
          { label: 'Total Spend',    val: totalSpend,   color: colors.expense },
          { label: 'Net Saving',     val: totalSaving,  color: totalSaving >= 0 ? colors.income : colors.expense },
          { label: 'Loan Remaining', val: totalLoanDue, color: colors.loan },
          { label: 'Total Saved',    val: totalSaved,   color: colors.saving },
          { label: 'Net Worth',      val: totalSaved - totalLoanDue, color: (totalSaved - totalLoanDue) >= 0 ? colors.income : colors.expense },
        ].map(item => (
          <View key={item.label} style={[g.cardSm, g.reportsGridCard]}>
            <Text style={g.metaText}>{item.label}</Text>
            <Text style={[g.reportsGridAmt, { color: item.color }]}>{formatINR(item.val)}</Text>
          </View>
        ))}
      </View>

      <View style={g.card}>
        <Text style={[g.sectionTitleSm, { marginBottom: 14 }]}>Monthly Spend — Last 6 Months</Text>
        <View style={g.barChart}>
          {last6.map(m => {
            const h = Math.max(4, (m.totalSpend / maxSpend) * 120);
            const saving = m.saving ?? 0;
            return (
              <View key={m.month} style={g.barCol}>
                <Text style={g.barAmt}>{formatINR(m.totalSpend)}</Text>
                <View style={[g.bar, { height: h, backgroundColor: colors.expense }]} />
                <Text style={g.barLabel}>{m.month.slice(0, 3)}</Text>
                <Text style={[g.barSaving, { color: saving >= 0 ? colors.income : colors.expense }]}>{saving >= 0 ? '+' : ''}{formatINR(saving)}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={g.card}>
        <Text style={[g.sectionTitleSm, { marginBottom: 14 }]}>Income vs Spend — Last 6 Months</Text>
        {last6.map(m => {
          const spendPct = m.paycheck > 0 ? Math.min(100, (m.totalSpend / m.paycheck) * 100) : 0;
          return (
            <View key={m.month} style={g.compareRow}>
              <Text style={g.compareMonth}>{m.month}</Text>
              <View style={{ flex: 1 }}>
                <View style={g.progressBgSm}><View style={[g.progressFillSm, { width: '100%', backgroundColor: colors.income }]} /></View>
                <View style={[g.progressBgSm, { marginTop: 3 }]}><View style={[g.progressFillSm, { width: `${spendPct}%` as `${number}%`, backgroundColor: colors.expense }]} /></View>
              </View>
              <View style={g.compareAmts}>
                <Text style={[g.compareAmt, { color: colors.income }]}>{formatINR(m.paycheck)}</Text>
                <Text style={[g.compareAmt, { color: colors.expense }]}>{formatINR(m.totalSpend)}</Text>
              </View>
            </View>
          );
        })}
        <View style={g.legend}>
          <View style={g.legendItem}><View style={[g.legendDot, { backgroundColor: colors.income }]} /><Text style={g.legendText}>Income</Text></View>
          <View style={g.legendItem}><View style={[g.legendDot, { backgroundColor: colors.expense }]} /><Text style={g.legendText}>Spend</Text></View>
        </View>
      </View>

      {catBreakdown.length > 0 && (
        <View style={g.card}>
          <Text style={[g.sectionTitleSm, { marginBottom: 14 }]}>Category Breakdown — {latest?.month}</Text>
          {catBreakdown.map(c => (
            <View key={c.label} style={g.catRow}>
              <View style={[g.dotSm, { backgroundColor: c.color }]} />
              <Text style={g.catLabel}>{c.label}</Text>
              <View style={g.progressBgSm}><View style={[g.progressFillSm, { width: `${totalCat > 0 ? (c.val / totalCat) * 100 : 0}%` as `${number}%`, backgroundColor: c.color }]} /></View>
              <Text style={[g.catAmt, { color: c.color }]}>{formatINR(c.val)}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={g.card}>
        <Text style={[g.sectionTitleSm, { marginBottom: 14 }]}>Loan Overview</Text>
        {loans.map(l => {
          const pct = l.total > 0 ? ((l.total - l.remaining) / l.total) * 100 : 0;
          return (
            <View key={l.id} style={g.loanRow}>
              <View style={g.loanTop}><Text style={g.rowTitle}>{l.name}</Text><Text style={[g.loanPct, { color: l.color }]}>{Math.round(pct)}% paid</Text></View>
              <View style={g.progressBgSm}><View style={[g.progressFillSm, { width: `${pct}%` as `${number}%`, backgroundColor: l.color }]} /></View>
              <View style={g.loanAmts}>
                <Text style={g.metaText}>Remaining: <Text style={{ color: colors.expense }}>{formatINR(l.remaining)}</Text></Text>
                <Text style={g.metaText}>EMI: <Text style={{ color: l.color }}>{formatINR(l.emi)}</Text></Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
