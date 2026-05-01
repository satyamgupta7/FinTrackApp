import { Colors } from '@/src/config/theme';
import { LOANS, SCHEDULE } from '@/src/config/loanData';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { formatINR } from '@/src/utils/helpers';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SCREEN_W = Dimensions.get('window').width;
const PADDING = 16;
const COL_MONTH = (SCREEN_W - PADDING * 2) * 0.24;
const COL_AMT = (SCREEN_W - PADDING * 2 - COL_MONTH) / 3;

export default function LoanDetailScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const s = styles(colors);
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const isAll = id === 'all';
  const loan = !isAll ? LOANS.find((l) => l.id === id) : null;

  const fmt = (v: number | null) => (v != null ? formatINR(v) : '—');

  // match schedule month format e.g. "Jul-25"
  const now = new Date();
  const currentMonthKey = now.toLocaleString('en-US', { month: 'short' }) + '-' + String(now.getFullYear()).slice(2);

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{isAll ? 'Combined Schedule' : `${loan?.name} Detail`}</Text>
      </View>

      {/* Summary Cards */}
      <View style={s.summaryRow}>
        {LOANS.map((l) => (
          <View key={l.id} style={[s.summaryCard, { borderTopColor: l.color }]}>
            <Text style={[s.summaryName, { color: l.color }]}>{l.name}</Text>
            <View style={s.summaryItem}>
              <Text style={s.summaryKey}>EMI</Text>
              <Text style={s.summaryVal}>{formatINR(l.emi)}</Text>
            </View>
            <View style={s.summaryItem}>
              <Text style={s.summaryKey}>Orig. Term</Text>
              <Text style={s.summaryVal}>{l.origTerm} mo</Text>
            </View>
            <View style={s.summaryItem}>
              <Text style={s.summaryKey}>Due Term</Text>
              <Text style={s.summaryVal}>{l.dueTerm} mo</Text>
            </View>
            <View style={s.summaryItem}>
              <Text style={s.summaryKey}>Outstanding</Text>
              <Text style={[s.summaryVal, { color: colors.expense }]}>{formatINR(l.remaining)}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Table */}
      <ScrollView style={s.tableContainer}>
        <View style={{ paddingHorizontal: PADDING }}>
            {/* Table Header */}
            <View style={[s.tableRow, s.tableHead]}>
              <Text style={[s.cell, s.cellMonth, s.headText]}>Month</Text>
              <Text style={[s.cell, s.cellAmt, s.headText]}>Loan 1 O/S</Text>
              <Text style={[s.cell, s.cellAmt, s.headText]}>Loan 2 O/S</Text>
              <Text style={[s.cell, s.cellAmt, s.headText]}>Total O/S</Text>
            </View>

            {SCHEDULE.map((row, i) => {
              const isOpening = row.month === 'Opening';
              const isCurrentMonth = row.month === currentMonthKey;
              return (
                <View
                  key={i}
                  style={[
                    s.tableRow,
                    i % 2 === 0 && s.tableRowAlt,
                    isOpening && s.tableRowOpening,
                    isCurrentMonth && s.tableRowCurrent,
                  ]}
                >
                  <Text style={[s.cell, s.cellMonth, isOpening && s.openingText, isCurrentMonth && s.currentText]}>{row.month}</Text>
                  <Text style={[s.cell, s.cellAmt, isCurrentMonth && s.currentText]}>{fmt(row.loan1Os)}</Text>
                  <Text style={[s.cell, s.cellAmt, isCurrentMonth && s.currentText]}>{fmt(row.loan2Os)}</Text>
                  <Text style={[s.cell, s.cellAmt, s.totalCell, isCurrentMonth && s.currentText]}>{formatINR(row.totalOs)}</Text>
                </View>
              );
            })}
        </View>
      </ScrollView>
      {/* Bottom Nav */}
      <View style={s.bottomNav}>
        {[
          { label: 'Dashboard', icon: 'home',    route: '/(tabs)/dashboard' },
          { label: 'Savings',   icon: 'wallet',  route: '/(tabs)/savings' },
          { label: 'Loans',     icon: 'cash',    route: '/(tabs)/loans' },
          { label: 'Expenses',  icon: 'receipt', route: '/(tabs)/expenses' },
        ].map((tab) => (
          <TouchableOpacity key={tab.label} style={s.navItem} onPress={() => router.push(tab.route as any)}>
            <Ionicons name={tab.icon as any} size={22} color={colors.icon} />
            <Text style={s.navLabel}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 52, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border },
    backBtn: { marginRight: 12 },
    headerTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
    summaryRow: { flexDirection: 'row', gap: 12, padding: 16, paddingBottom: 8 },
    summaryCard: { flex: 1, backgroundColor: colors.card, borderRadius: 12, padding: 12, borderTopWidth: 3, elevation: 1 },
    summaryName: { fontSize: 13, fontWeight: '700', marginBottom: 8 },
    summaryItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    summaryKey: { fontSize: 11, color: colors.icon },
    summaryVal: { fontSize: 11, fontWeight: '600', color: colors.text },
    tableContainer: { flex: 1 },
    bottomNav: { flexDirection: 'row', backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border, paddingBottom: 20, paddingTop: 10 },
    navItem: { flex: 1, alignItems: 'center', gap: 3 },
    navLabel: { fontSize: 10, color: colors.icon },
    tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border },
    tableRowAlt: { backgroundColor: colors.background },
    tableRowOpening: { backgroundColor: colors.tint + '15' },
    tableRowCurrent: { backgroundColor: '#1B5E2030' },
    tableHead: { backgroundColor: colors.tint },
    headText: { color: '#fff', fontWeight: '700' },
    cell: { paddingVertical: 8, paddingHorizontal: 6, fontSize: 12, color: colors.text, textAlign: 'right' },
    cellMonth: { width: COL_MONTH, textAlign: 'left', fontWeight: '600' },
    cellAmt: { width: COL_AMT },
    openingText: { color: colors.tint, fontWeight: '700' },
    currentText: { color: '#1B5E20', fontWeight: '700' },
    totalCell: { fontWeight: '700', color: colors.text },
  });
