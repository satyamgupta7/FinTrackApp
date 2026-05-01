import { Colors } from '@/src/config/theme';
import { useFinance } from '@/src/context/FinanceContext';
import type { Loan } from '@/src/context/FinanceContext';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { formatINR } from '@/src/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert, Modal, ScrollView, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from 'react-native';

const COLORS = ['#E65100', '#1565C0', '#4E342E', '#1B5E20', '#6A1B9A', '#B71C1C'];
const emptyForm = { name: '', total: '', remaining: '', emi: '', origTerm: '', dueTerm: '', dueDate: '', color: COLORS[0] };

export default function LoansScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const s = styles(colors);
  const router = useRouter();
  const { loans, addOrUpdateLoan, removeLoan } = useFinance();
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const totalEmi = loans.reduce((sum, l) => sum + l.emi, 0);

  function openAdd() {
    setEditId(null);
    setForm(emptyForm);
    setModalVisible(true);
  }

  function openEdit(loan: Loan) {
    setEditId(loan.id);
    setForm({
      name: loan.name, total: String(loan.total), remaining: String(loan.remaining),
      emi: String(loan.emi), origTerm: String(loan.origTerm), dueTerm: String(loan.dueTerm),
      dueDate: loan.dueDate, color: loan.color,
    });
    setModalVisible(true);
  }

  function handleSave() {
    if (!form.name.trim() || !form.total || !form.remaining || !form.emi) {
      Alert.alert('Validation', 'Please fill all required fields.');
      return;
    }
    const updated: Loan = {
      id: editId ?? Date.now().toString(),
      name: form.name, total: Number(form.total), remaining: Number(form.remaining),
      emi: Number(form.emi), origTerm: Number(form.origTerm), dueTerm: Number(form.dueTerm),
      dueDate: form.dueDate, color: form.color,
    };
    addOrUpdateLoan(updated);
    setModalVisible(false);
  }

  function handleDelete(id: string) {
    Alert.alert('Delete', 'Remove this loan?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeLoan(id) },
    ]);
  }

  return (
    <View style={s.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={s.summaryRow}>
          <View style={[s.summaryCard, { backgroundColor: colors.loan }]}>
            <Text style={s.summaryLabel}>Total Loan Due</Text>
            <Text style={s.summaryAmount}>{formatINR(loans.reduce((s, l) => s + l.remaining, 0))}</Text>
          </View>
          <View style={[s.summaryCard, { backgroundColor: '#1565C0' }]}>
            <Text style={s.summaryLabel}>Monthly EMI</Text>
            <Text style={s.summaryAmount}>{formatINR(totalEmi)}</Text>
          </View>
        </View>

        <View style={s.sectionRow}>
          <Text style={s.sectionTitle}>Active Loans</Text>
          <TouchableOpacity style={s.addBtn} onPress={openAdd}>
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={s.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>

        {loans.map((loan) => (
            <View key={loan.id} style={[s.loanCard, { borderLeftColor: loan.color }]}>
              <View style={s.loanHeader}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => router.push({ pathname: '/loan-detail', params: { id: loan.id } })}>
                  <Text style={s.loanName}>{loan.name}</Text>
                </TouchableOpacity>
                <View style={s.actions}>
                  <View style={[s.dueBadge, { backgroundColor: loan.color + '20' }]}>
                    <Text style={[s.dueText, { color: loan.color }]}>Due {loan.dueDate}</Text>
                  </View>
                  <TouchableOpacity style={s.editBtn} onPress={() => openEdit(loan)}>
                    <Ionicons name="pencil" size={14} color="#1565C0" />
                  </TouchableOpacity>
                  <TouchableOpacity style={s.deleteBtn} onPress={() => handleDelete(loan.id)}>
                    <Ionicons name="trash" size={14} color="#B71C1C" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={s.amountRow}>
                <View style={s.amountBox}>
                  <Text style={s.amountLabel}>Total</Text>
                  <Text style={s.amountValue}>{formatINR(loan.total)}</Text>
                </View>
                <View style={s.divider} />
                <View style={s.amountBox}>
                  <Text style={s.amountLabel}>Remaining</Text>
                  <Text style={[s.amountValue, { color: colors.expense }]}>{formatINR(loan.remaining)}</Text>
                </View>
                <View style={s.divider} />
                <View style={s.amountBox}>
                  <Text style={s.amountLabel}>EMI/mo</Text>
                  <Text style={[s.amountValue, { color: loan.color }]}>{formatINR(loan.emi)}</Text>
                </View>
              </View>
            </View>
          ))}

        <TouchableOpacity
          style={s.viewAllBtn}
          onPress={() => router.push({ pathname: '/loan-detail', params: { id: 'all' } })}
        >
          <Text style={s.viewAllText}>View Combined Schedule</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.tint} />
        </TouchableOpacity>
      </ScrollView>

      {/* Add / Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={s.modalOverlay}>
          <ScrollView>
            <View style={s.modalBox}>
              <Text style={s.modalTitle}>{editId ? 'Edit Loan' : 'Add Loan'}</Text>

              <Text style={s.label}>Loan Name</Text>
              <TextInput style={s.input} value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} placeholder="e.g. Home Loan" placeholderTextColor={colors.icon} />

              <Text style={s.label}>Total Amount (₹)</Text>
              <TextInput style={s.input} value={form.total} onChangeText={(v) => setForm({ ...form, total: v })} keyboardType="numeric" placeholder="e.g. 2500000" placeholderTextColor={colors.icon} />

              <Text style={s.label}>Remaining Amount (₹)</Text>
              <TextInput style={s.input} value={form.remaining} onChangeText={(v) => setForm({ ...form, remaining: v })} keyboardType="numeric" placeholder="e.g. 1980000" placeholderTextColor={colors.icon} />

              <Text style={s.label}>Monthly EMI (₹)</Text>
              <TextInput style={s.input} value={form.emi} onChangeText={(v) => setForm({ ...form, emi: v })} keyboardType="numeric" placeholder="e.g. 18000" placeholderTextColor={colors.icon} />

              <View style={s.row}>
                <View style={{ flex: 1 }}>
                  <Text style={s.label}>Orig. Term (months)</Text>
                  <TextInput style={s.input} value={form.origTerm} onChangeText={(v) => setForm({ ...form, origTerm: v })} keyboardType="numeric" placeholder="60" placeholderTextColor={colors.icon} />
                </View>
                <View style={{ width: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={s.label}>Due Term (months)</Text>
                  <TextInput style={s.input} value={form.dueTerm} onChangeText={(v) => setForm({ ...form, dueTerm: v })} keyboardType="numeric" placeholder="36" placeholderTextColor={colors.icon} />
                </View>
              </View>

              <Text style={s.label}>Due Date</Text>
              <TextInput style={s.input} value={form.dueDate} onChangeText={(v) => setForm({ ...form, dueDate: v })} placeholder="e.g. Jul 15" placeholderTextColor={colors.icon} />

              <Text style={s.label}>Color</Text>
              <View style={s.colorRow}>
                {COLORS.map((c) => (
                  <TouchableOpacity key={c} onPress={() => setForm({ ...form, color: c })}
                    style={[s.colorDot, { backgroundColor: c }, form.color === c && s.colorDotSelected]} />
                ))}
              </View>

              <View style={s.modalActions}>
                <TouchableOpacity style={s.cancelBtn} onPress={() => setModalVisible(false)}>
                  <Text style={s.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.saveBtn} onPress={handleSave}>
                  <Text style={s.saveText}>{editId ? 'Update' : 'Save'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
    summaryCard: { flex: 1, borderRadius: 16, padding: 20, alignItems: 'center' },
    summaryLabel: { color: '#fff', fontSize: 12, opacity: 0.85 },
    summaryAmount: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 4 },
    sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 12 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
    addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.tint, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    addBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
    loanCard: { backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 12, elevation: 1, borderLeftWidth: 4 },
    loanHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
    loanName: { fontSize: 15, fontWeight: '700', color: colors.text },
    actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    dueBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    dueText: { fontSize: 12, fontWeight: '600' },
    editBtn: { padding: 6, backgroundColor: '#1565C015', borderRadius: 8 },
    deleteBtn: { padding: 6, backgroundColor: '#B71C1C15', borderRadius: 8 },
    amountRow: { flexDirection: 'row', alignItems: 'center' },
    amountBox: { flex: 1, alignItems: 'center' },
    amountLabel: { fontSize: 11, color: colors.icon, marginBottom: 4 },
    amountValue: { fontSize: 15, fontWeight: '800', color: colors.text },
    divider: { width: 1, height: 36, backgroundColor: colors.border },
    viewAllBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: colors.tint, marginTop: 4 },
    viewAllText: { color: colors.tint, fontWeight: '600', fontSize: 14 },
    // Modal
    modalOverlay: { flex: 1, backgroundColor: '#00000066', justifyContent: 'flex-end' },
    modalBox: { backgroundColor: colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
    modalTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 16 },
    label: { fontSize: 13, color: colors.icon, marginBottom: 4, marginTop: 10 },
    input: { backgroundColor: colors.background, borderRadius: 10, padding: 12, fontSize: 14, color: colors.text, borderWidth: 1, borderColor: colors.border },
    row: { flexDirection: 'row' },
    colorRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
    colorDot: { width: 28, height: 28, borderRadius: 14 },
    colorDotSelected: { borderWidth: 3, borderColor: colors.text },
    modalActions: { flexDirection: 'row', gap: 12, marginTop: 24 },
    cancelBtn: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
    cancelText: { color: colors.text, fontWeight: '600' },
    saveBtn: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: colors.tint, alignItems: 'center' },
    saveText: { color: '#fff', fontWeight: '700' },
  });
