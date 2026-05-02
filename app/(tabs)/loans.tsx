import { useTheme } from '@/src/hooks/useTheme';
import { useFinance, Loan } from '@/src/context/FinanceContext';
import { formatINR } from '@/src/utils/helpers';
import { LOAN_COLORS, ROUTES } from '@/src/config/common.constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const emptyForm = { name: '', total: '', remaining: '', emi: '', origTerm: '', dueTerm: '', dueDate: '', color: LOAN_COLORS[0] };

export default function LoansScreen() {
  const { colors, styles: g } = useTheme();
  const router = useRouter();
  const { loans, addOrUpdateLoan, removeLoan } = useFinance();
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const totalEmi = loans.reduce((sum, l) => sum + l.emi, 0);

  function openAdd() { setEditId(null); setForm(emptyForm); setModalVisible(true); }
  function openEdit(loan: Loan) {
    setEditId(loan.id);
    setForm({ name: loan.name, total: String(loan.total), remaining: String(loan.remaining), emi: String(loan.emi), origTerm: String(loan.origTerm), dueTerm: String(loan.dueTerm), dueDate: loan.dueDate, color: loan.color });
    setModalVisible(true);
  }
  function handleSave() {
    if (!form.name.trim() || !form.total || !form.remaining || !form.emi) { Alert.alert('Validation', 'Please fill all required fields.'); return; }
    addOrUpdateLoan({ id: editId ?? Date.now().toString(), name: form.name, total: Number(form.total), remaining: Number(form.remaining), emi: Number(form.emi), origTerm: Number(form.origTerm), dueTerm: Number(form.dueTerm), dueDate: form.dueDate, color: form.color });
    setModalVisible(false);
  }
  function handleDelete(id: string) {
    Alert.alert('Delete', 'Remove this loan?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeLoan(id) },
    ]);
  }

  return (
    <View style={g.container}>
      <ScrollView contentContainerStyle={g.scrollContent}>
        <View style={g.statsRow}>
          <View style={[g.heroCard, { backgroundColor: colors.loan }]}>
            <Text style={g.heroLabel}>Total Loan Due</Text>
            <Text style={g.heroAmount}>{formatINR(loans.reduce((s, l) => s + l.remaining, 0))}</Text>
          </View>
          <View style={[g.heroCard, { backgroundColor: '#1565C0' }]}>
            <Text style={g.heroLabel}>Monthly EMI</Text>
            <Text style={g.heroAmount}>{formatINR(totalEmi)}</Text>
          </View>
        </View>
        <View style={g.sectionRow}>
          <Text style={g.sectionTitle}>Active Loans</Text>
          <TouchableOpacity style={g.addBtn} onPress={openAdd}>
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={g.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
        {loans.map((loan) => (
          <View key={loan.id} style={[g.loanCard, { borderLeftColor: loan.color }]}>
            <View style={g.loanHeader}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => router.push({ pathname: ROUTES.LOAN_DETAIL, params: { id: loan.id } })}>
                <Text style={g.loanName}>{loan.name}</Text>
              </TouchableOpacity>
              <View style={g.actions}>
                <View style={[g.dueBadge, { backgroundColor: loan.color + '20' }]}>
                  <Text style={[g.dueText, { color: loan.color }]}>Due {loan.dueDate}</Text>
                </View>
                <TouchableOpacity style={g.editBtn} onPress={() => openEdit(loan)}><Ionicons name="pencil" size={14} color="#1565C0" /></TouchableOpacity>
                <TouchableOpacity style={g.deleteBtn} onPress={() => handleDelete(loan.id)}><Ionicons name="trash" size={14} color="#B71C1C" /></TouchableOpacity>
              </View>
            </View>
            <View style={g.amountRow}>
              <View style={g.amountBox}><Text style={g.amountLabel}>Total</Text><Text style={g.amountValue}>{formatINR(loan.total)}</Text></View>
              <View style={g.divider} />
              <View style={g.amountBox}><Text style={g.amountLabel}>Remaining</Text><Text style={[g.amountValue, { color: colors.expense }]}>{formatINR(loan.remaining)}</Text></View>
              <View style={g.divider} />
              <View style={g.amountBox}><Text style={g.amountLabel}>EMI/mo</Text><Text style={[g.amountValue, { color: loan.color }]}>{formatINR(loan.emi)}</Text></View>
            </View>
          </View>
        ))}
        <TouchableOpacity style={g.viewAllBtn} onPress={() => router.push({ pathname: ROUTES.LOAN_DETAIL, params: { id: 'all' } })}>
          <Text style={g.viewAllText}>View Combined Schedule</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.tint} />
        </TouchableOpacity>
      </ScrollView>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={g.overlay}>
          <ScrollView>
            <View style={g.modalBox}>
              <Text style={g.modalTitleLg}>{editId ? 'Edit Loan' : 'Add Loan'}</Text>
              <Text style={g.label}>Loan Name</Text>
              <TextInput style={g.input} value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} placeholder="e.g. Home Loan" placeholderTextColor={colors.icon} />
              <Text style={g.label}>Total Amount (₹)</Text>
              <TextInput style={g.input} value={form.total} onChangeText={(v) => setForm({ ...form, total: v })} keyboardType="numeric" placeholderTextColor={colors.icon} />
              <Text style={g.label}>Remaining Amount (₹)</Text>
              <TextInput style={g.input} value={form.remaining} onChangeText={(v) => setForm({ ...form, remaining: v })} keyboardType="numeric" placeholderTextColor={colors.icon} />
              <Text style={g.label}>Monthly EMI (₹)</Text>
              <TextInput style={g.input} value={form.emi} onChangeText={(v) => setForm({ ...form, emi: v })} keyboardType="numeric" placeholderTextColor={colors.icon} />
              <View style={g.formRow}>
                <View style={{ flex: 1 }}>
                  <Text style={g.label}>Orig. Term (months)</Text>
                  <TextInput style={g.input} value={form.origTerm} onChangeText={(v) => setForm({ ...form, origTerm: v })} keyboardType="numeric" placeholder="60" placeholderTextColor={colors.icon} />
                </View>
                <View style={{ width: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={g.label}>Due Term (months)</Text>
                  <TextInput style={g.input} value={form.dueTerm} onChangeText={(v) => setForm({ ...form, dueTerm: v })} keyboardType="numeric" placeholder="36" placeholderTextColor={colors.icon} />
                </View>
              </View>
              <Text style={g.label}>Due Date</Text>
              <TextInput style={g.input} value={form.dueDate} onChangeText={(v) => setForm({ ...form, dueDate: v })} placeholder="e.g. Jul 15" placeholderTextColor={colors.icon} />
              <Text style={g.label}>Color</Text>
              <View style={g.colorRow}>
                {LOAN_COLORS.map((c) => (
                  <TouchableOpacity key={c} onPress={() => setForm({ ...form, color: c })} style={[g.colorDot, { backgroundColor: c }, form.color === c && g.colorDotSelected]} />
                ))}
              </View>
              <View style={g.modalBtnsLg}>
                <TouchableOpacity style={g.cancelBtn} onPress={() => setModalVisible(false)}><Text style={g.cancelText}>Cancel</Text></TouchableOpacity>
                <TouchableOpacity style={g.saveBtn} onPress={handleSave}><Text style={g.saveText}>{editId ? 'Update' : 'Save'}</Text></TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
