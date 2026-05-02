import { useTheme } from '@/src/hooks/useTheme';
import { useFinance } from '@/src/context/FinanceContext';
import { formatINR } from '@/src/utils/helpers';
import { DEFAULT_BUDGETS } from '@/src/config/common.constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

type BudgetItem = { key: string; label: string; color: string; budget: number };

export default function BudgetPlannerScreen() {
  const { colors, styles: g } = useTheme();
  const router = useRouter();
  const { expenseData } = useFinance();

  const [budgets, setBudgets] = useState<BudgetItem[]>(DEFAULT_BUDGETS.map(b => ({ ...b })));
  const [income, setIncome]   = useState('130000');
  const [editItem, setEditItem] = useState<BudgetItem | null>(null);
  const [editVal, setEditVal]   = useState('');

  const latest      = expenseData.flatMap(y => y.months).at(-1);
  const totalBudget = budgets.reduce((s, b) => s + b.budget, 0);
  const incomeNum   = Number(income) || 0;
  const remaining   = incomeNum - totalBudget;
  const usedPct     = incomeNum > 0 ? Math.min(100, (totalBudget / incomeNum) * 100) : 0;

  function handleSave() {
    if (!editItem) return;
    setBudgets(prev => prev.map(b => b.key === editItem.key ? { ...b, budget: Number(editVal) || 0 } : b));
    setEditItem(null);
  }

  return (
    <View style={g.container}>
      <ScrollView contentContainerStyle={g.scrollContent20}>
        <TouchableOpacity style={g.back} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={g.pageTitle}>Budget Planner</Text>

        <View style={[g.incomeCard, { backgroundColor: colors.tint }]}>
          <Text style={g.incomeLabel}>Monthly Income</Text>
          <TextInput style={g.incomeInput} value={income} onChangeText={setIncome} keyboardType="numeric" placeholderTextColor="#fff" />
        </View>

        <View style={g.statsRow}>
          <View style={[g.cardSm, g.budgetSummaryCard, { borderTopColor: colors.expense }]}>
            <Text style={g.metaText}>Total Budgeted</Text>
            <Text style={[g.budgetSummaryAmt, { color: colors.expense }]}>{formatINR(totalBudget)}</Text>
          </View>
          <View style={[g.cardSm, g.budgetSummaryCard, { borderTopColor: remaining >= 0 ? colors.income : colors.expense }]}>
            <Text style={g.metaText}>Remaining</Text>
            <Text style={[g.budgetSummaryAmt, { color: remaining >= 0 ? colors.income : colors.expense }]}>{formatINR(Math.abs(remaining))}</Text>
          </View>
        </View>

        <View style={g.card}>
          <View style={g.progressHeader}>
            <Text style={g.rowTitle}>Budget Used</Text>
            <Text style={[g.rowTitle, { color: colors.tint }]}>{Math.round(usedPct)}%</Text>
          </View>
          <View style={g.progressBg}>
            <View style={[g.progressFill, { width: `${usedPct}%` as `${number}%`, backgroundColor: totalBudget > incomeNum ? colors.expense : colors.tint }]} />
          </View>
        </View>

        <Text style={g.sectionTitle}>Budget Breakdown</Text>
        {budgets.map(item => {
          const actual = latest ? (latest as any)[item.key] ?? 0 : 0;
          const pct    = item.budget > 0 ? Math.min(100, (actual / item.budget) * 100) : 0;
          const over   = actual > item.budget;
          return (
            <View key={item.key} style={[g.cardSm, g.budgetRow, { marginBottom: 10 }]}>
              <View style={[g.dot, { backgroundColor: item.color, marginTop: 5 }]} />
              <View style={{ flex: 1 }}>
                <View style={g.budgetTop}>
                  <Text style={g.rowTitle}>{item.label}</Text>
                  <TouchableOpacity onPress={() => { setEditItem(item); setEditVal(String(item.budget)); }}>
                    <Text style={[g.budgetAmt, { color: item.color }]}>{formatINR(item.budget)}</Text>
                  </TouchableOpacity>
                </View>
                <View style={g.progressBgSm}>
                  <View style={[g.progressFillSm, { width: `${pct}%` as `${number}%`, backgroundColor: over ? colors.expense : item.color }]} />
                </View>
                <View style={g.budgetBottom}>
                  <Text style={g.metaText}>Actual: {formatINR(actual)}</Text>
                  {over && <Text style={[g.metaText, { color: colors.expense, fontWeight: '600' }]}>Over by {formatINR(actual - item.budget)}</Text>}
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <Modal visible={!!editItem} transparent animationType="slide">
        <View style={g.overlay}>
          <View style={g.modalBox}>
            <Text style={g.modalTitle}>Edit Budget — {editItem?.label}</Text>
            <Text style={g.fieldLabel}>Budget Amount (₹)</Text>
            <TextInput style={g.input} value={editVal} onChangeText={setEditVal} keyboardType="numeric" placeholderTextColor={colors.icon} />
            <View style={g.modalBtns}>
              <TouchableOpacity style={g.cancelBtn} onPress={() => setEditItem(null)}><Text style={g.cancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={g.saveBtn} onPress={handleSave}><Text style={g.saveText}>Save</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
