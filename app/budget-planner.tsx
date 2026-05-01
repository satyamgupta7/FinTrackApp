import { Colors } from '@/src/config/theme';
import { useFinance } from '@/src/context/FinanceContext';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { formatINR } from '@/src/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type BudgetItem = { key: string; label: string; color: string; budget: number };

const DEFAULT_BUDGETS: BudgetItem[] = [
  { key: 'emi',       label: 'EMI',         color: '#E65100', budget: 45780 },
  { key: 'invest',    label: 'Investment',  color: '#1565C0', budget: 10000 },
  { key: 'rent',      label: 'Rent',        color: '#6A1B9A', budget: 7000  },
  { key: 'insurance', label: 'Insurance',   color: '#00695C', budget: 2000  },
  { key: 'medicine',  label: 'Medicine',    color: '#B71C1C', budget: 5000  },
  { key: 'personal',  label: 'Personal',    color: '#37474F', budget: 5000  },
  { key: 'credit',    label: 'Credit Card', color: '#F57F17', budget: 15000 },
  { key: 'familyCash',label: 'Family/Cash', color: '#4E342E', budget: 10000 },
];

export default function BudgetPlannerScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const s = styles(colors);
  const router = useRouter();
  const { expenseData } = useFinance();

  const [budgets, setBudgets] = useState<BudgetItem[]>(DEFAULT_BUDGETS);
  const [income, setIncome] = useState('130000');
  const [editItem, setEditItem] = useState<BudgetItem | null>(null);
  const [editVal, setEditVal] = useState('');

  // Get latest month actuals
  const allMonths = expenseData.flatMap(y => y.months);
  const latest = allMonths[allMonths.length - 1];

  const totalBudget = budgets.reduce((s, b) => s + b.budget, 0);
  const incomeNum = Number(income) || 0;
  const remaining = incomeNum - totalBudget;

  function handleEdit(item: BudgetItem) {
    setEditItem(item);
    setEditVal(String(item.budget));
  }

  function handleSave() {
    if (!editItem) return;
    setBudgets(prev => prev.map(b => b.key === editItem.key ? { ...b, budget: Number(editVal) || 0 } : b));
    setEditItem(null);
  }

  return (
    <View style={s.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <TouchableOpacity style={s.back} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={s.pageTitle}>Budget Planner</Text>

        {/* Income */}
        <View style={s.incomeCard}>
          <Text style={s.incomeLabel}>Monthly Income</Text>
          <TextInput
            style={s.incomeInput}
            value={income}
            onChangeText={setIncome}
            keyboardType="numeric"
            placeholderTextColor="#fff"
          />
        </View>

        {/* Summary */}
        <View style={s.summaryRow}>
          <View style={[s.summaryCard, { borderTopColor: colors.expense }]}>
            <Text style={s.summaryLabel}>Total Budgeted</Text>
            <Text style={[s.summaryAmt, { color: colors.expense }]}>{formatINR(totalBudget)}</Text>
          </View>
          <View style={[s.summaryCard, { borderTopColor: remaining >= 0 ? colors.income : colors.expense }]}>
            <Text style={s.summaryLabel}>Remaining</Text>
            <Text style={[s.summaryAmt, { color: remaining >= 0 ? colors.income : colors.expense }]}>{formatINR(Math.abs(remaining))}</Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={s.progressCard}>
          <View style={s.progressHeader}>
            <Text style={s.progressLabel}>Budget Used</Text>
            <Text style={s.progressPct}>{incomeNum > 0 ? Math.round((totalBudget / incomeNum) * 100) : 0}%</Text>
          </View>
          <View style={s.progressBg}>
            <View style={[s.progressFill, {
              width: `${Math.min(100, incomeNum > 0 ? (totalBudget / incomeNum) * 100 : 0)}%` as any,
              backgroundColor: totalBudget > incomeNum ? colors.expense : colors.tint,
            }]} />
          </View>
        </View>

        {/* Budget Items */}
        <Text style={s.sectionTitle}>Budget Breakdown</Text>
        {budgets.map(item => {
          const actual = latest ? (latest as any)[item.key] ?? 0 : 0;
          const pct = item.budget > 0 ? Math.min(100, (actual / item.budget) * 100) : 0;
          const over = actual > item.budget;
          return (
            <View key={item.key} style={s.budgetRow}>
              <View style={[s.dot, { backgroundColor: item.color }]} />
              <View style={{ flex: 1 }}>
                <View style={s.budgetTop}>
                  <Text style={s.budgetLabel}>{item.label}</Text>
                  <TouchableOpacity onPress={() => handleEdit(item)}>
                    <Text style={[s.budgetAmt, { color: item.color }]}>{formatINR(item.budget)}</Text>
                  </TouchableOpacity>
                </View>
                <View style={s.barBg}>
                  <View style={[s.barFill, { width: `${pct}%` as any, backgroundColor: over ? colors.expense : item.color }]} />
                </View>
                <View style={s.budgetBottom}>
                  <Text style={s.actualText}>Actual: {formatINR(actual)}</Text>
                  {over && <Text style={s.overText}>Over by {formatINR(actual - item.budget)}</Text>}
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <Modal visible={!!editItem} transparent animationType="slide">
        <View style={s.overlay}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>Edit Budget — {editItem?.label}</Text>
            <Text style={s.fieldLabel}>Budget Amount (₹)</Text>
            <TextInput style={s.input} value={editVal} onChangeText={setEditVal} keyboardType="numeric" placeholderTextColor={colors.icon} />
            <View style={s.modalBtns}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => setEditItem(null)}><Text style={s.cancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={s.saveBtn} onPress={handleSave}><Text style={s.saveText}>Save</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = (colors: typeof Colors.light) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  back: { marginBottom: 8 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 20 },
  incomeCard: { backgroundColor: colors.tint, borderRadius: 16, padding: 20, marginBottom: 16 },
  incomeLabel: { color: '#fff', fontSize: 13, opacity: 0.85, marginBottom: 6 },
  incomeInput: { color: '#fff', fontSize: 28, fontWeight: '800' },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  summaryCard: { flex: 1, backgroundColor: colors.card, borderRadius: 12, padding: 14, borderTopWidth: 3, elevation: 1 },
  summaryLabel: { fontSize: 11, color: colors.icon, marginBottom: 4 },
  summaryAmt: { fontSize: 16, fontWeight: '800' },
  progressCard: { backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 20, elevation: 1 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progressLabel: { fontSize: 13, color: colors.text, fontWeight: '600' },
  progressPct: { fontSize: 13, fontWeight: '800', color: colors.tint },
  progressBg: { height: 10, backgroundColor: colors.border, borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: 10, borderRadius: 5 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 12 },
  budgetRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: colors.card, borderRadius: 12, padding: 14, marginBottom: 10, elevation: 1 },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 5 },
  budgetTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  budgetLabel: { fontSize: 14, fontWeight: '600', color: colors.text },
  budgetAmt: { fontSize: 14, fontWeight: '700' },
  barBg: { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden', marginBottom: 4 },
  barFill: { height: 6, borderRadius: 3 },
  budgetBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  actualText: { fontSize: 11, color: colors.icon },
  overText: { fontSize: 11, color: colors.expense, fontWeight: '600' },
  overlay: { flex: 1, backgroundColor: '#00000066', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 12 },
  fieldLabel: { fontSize: 12, color: colors.icon, marginBottom: 4, marginTop: 10 },
  input: { backgroundColor: colors.background, borderRadius: 10, padding: 12, fontSize: 14, color: colors.text, borderWidth: 1, borderColor: colors.border },
  modalBtns: { flexDirection: 'row', gap: 12, marginTop: 20 },
  cancelBtn: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  cancelText: { color: colors.text, fontWeight: '600' },
  saveBtn: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: colors.tint, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '700' },
});
