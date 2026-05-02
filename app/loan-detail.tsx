import { useTheme } from '@/src/hooks/useTheme';
import { LOANS, SCHEDULE } from '@/src/config/loanData';
import { formatINR } from '@/src/utils/helpers';
import { BOTTOM_TABS } from '@/src/config/common.constants';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function LoanDetailScreen() {
  const { colors, styles: g } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const isAll = id === 'all';
  const now = new Date();
  const currentMonthKey = now.toLocaleString('en-US', { month: 'short' }) + '-' + String(now.getFullYear()).slice(2);
  const fmt = (v: number | null) => v != null ? formatINR(v) : '—';

  return (
    <View style={g.container}>
      <View style={g.loanDetailHeader}>
        <TouchableOpacity onPress={() => router.back()} style={g.loanDetailBackBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={g.loanDetailTitle}>{isAll ? 'Combined Schedule' : `${LOANS.find(l => l.id === id)?.name} Detail`}</Text>
      </View>

      <View style={g.loanDetailSummaryRow}>
        {LOANS.map(l => (
          <View key={l.id} style={[g.cardSm, g.loanDetailSummaryCard, { borderTopColor: l.color }]}>
            <Text style={[g.loanDetailSummaryName, { color: l.color }]}>{l.name}</Text>
            {[
              { k: 'EMI',         v: formatINR(l.emi) },
              { k: 'Orig. Term',  v: `${l.origTerm} mo` },
              { k: 'Due Term',    v: `${l.dueTerm} mo` },
              { k: 'Outstanding', v: formatINR(l.remaining) },
            ].map(row => (
              <View key={row.k} style={g.loanDetailSummaryItem}>
                <Text style={g.metaText}>{row.k}</Text>
                <Text style={g.loanDetailSummaryVal}>{row.v}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 16 }}>
          <View style={[g.tableRow, { backgroundColor: colors.tint }]}>
            <Text style={[g.tableCell, g.tableCellMonth, g.tableHeadText]}>Month</Text>
            <Text style={[g.tableCell, g.tableCellAmt, g.tableHeadText]}>Loan 1 O/S</Text>
            <Text style={[g.tableCell, g.tableCellAmt, g.tableHeadText]}>Loan 2 O/S</Text>
            <Text style={[g.tableCell, g.tableCellAmt, g.tableHeadText]}>Total O/S</Text>
          </View>
          {SCHEDULE.map((row, i) => {
            const isOpening      = row.month === 'Opening';
            const isCurrentMonth = row.month === currentMonthKey;
            return (
              <View key={i} style={[
                g.tableRow,
                i % 2 === 0 && { backgroundColor: colors.background },
                isOpening      && { backgroundColor: colors.tint + '15' },
                isCurrentMonth && { backgroundColor: '#1B5E2030' },
              ]}>
                <Text style={[g.tableCell, g.tableCellMonth, isOpening && { color: colors.tint, fontWeight: '700' }, isCurrentMonth && g.tableCurrentText]}>{row.month}</Text>
                <Text style={[g.tableCell, g.tableCellAmt, isCurrentMonth && g.tableCurrentText]}>{fmt(row.loan1Os)}</Text>
                <Text style={[g.tableCell, g.tableCellAmt, isCurrentMonth && g.tableCurrentText]}>{fmt(row.loan2Os)}</Text>
                <Text style={[g.tableCell, g.tableCellAmt, g.tableTotalCell, isCurrentMonth && g.tableCurrentText]}>{formatINR(row.totalOs)}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={g.bottomNav}>
        {BOTTOM_TABS.map(tab => (
          <TouchableOpacity key={tab.label} style={g.bottomNavItem} onPress={() => router.push(tab.route)}>
            <Ionicons name={tab.icon as any} size={22} color={colors.icon} />
            <Text style={[g.metaText, { fontSize: 10 }]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
