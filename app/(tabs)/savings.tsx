import { Colors } from '@/src/config/theme';
import { useFinance } from '@/src/context/FinanceContext';
import type { SavingGoal } from '@/src/context/FinanceContext';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { formatINR } from '@/src/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import {
  Alert, Modal, ScrollView, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from 'react-native';

const COLORS = ['#1565C0', '#6A1B9A', '#00695C', '#E65100', '#B71C1C', '#1B5E20'];

const emptyForm = { name: '', target: '', saved: '', color: COLORS[0] };

export default function SavingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const s = styles(colors);
  const { savings: goals, addOrUpdateSaving, removeSaving, loading } = useFinance();
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const totalSaved = goals.reduce((sum, g) => sum + g.saved, 0);

  function openAdd() {
    setEditId(null);
    setForm(emptyForm);
    setModalVisible(true);
  }

  function openEdit(goal: SavingGoal) {
    setEditId(goal.id);
    setForm({ name: goal.name, target: String(goal.target), saved: String(goal.saved), color: goal.color });
    setModalVisible(true);
  }

  function handleSave() {
    if (!form.name.trim() || !form.target || !form.saved) {
      Alert.alert('Validation', 'Please fill all fields.');
      return;
    }
    addOrUpdateSaving({
      id: editId ?? Date.now().toString(),
      name: form.name,
      target: Number(form.target),
      saved: Number(form.saved),
      color: form.color,
    });
    setModalVisible(false);
  }

  function handleDelete(id: string) {
    Alert.alert('Delete', 'Remove this savings goal?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeSaving(id) },
    ]);
  }

  return (
    <View style={s.container}>
      {loading ? (
        <View style={s.loadingBox}>
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={s.loadingText}>Loading savings...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View style={s.summaryCard}>
            <Text style={s.summaryLabel}>Total Saved</Text>
            <Text style={s.summaryAmount}>{formatINR(totalSaved)}</Text>
          </View>

          <View style={s.sectionRow}>
            <Text style={s.sectionTitle}>Savings Goals</Text>
            <TouchableOpacity style={s.addBtn} onPress={openAdd}>
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={s.addBtnText}>Add</Text>
            </TouchableOpacity>
          </View>

          {goals.map((goal) => (
            <View key={goal.id} style={[s.goalCard, { borderLeftColor: goal.color }]}>
              <View style={s.goalHeader}>
                <Text style={s.goalName}>{goal.name}</Text>
                <View style={s.actions}>
                  <TouchableOpacity style={s.editBtn} onPress={() => openEdit(goal)}>
                    <Ionicons name="pencil" size={14} color="#1565C0" />
                  </TouchableOpacity>
                  <TouchableOpacity style={s.deleteBtn} onPress={() => handleDelete(goal.id)}>
                    <Ionicons name="trash" size={14} color="#B71C1C" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={s.amountRow}>
                <View style={s.amountBox}>
                  <Text style={s.amountLabel}>Saved</Text>
                  <Text style={[s.amountValue, { color: goal.color }]}>{formatINR(goal.saved)}</Text>
                </View>
                <View style={s.divider} />
                <View style={s.amountBox}>
                  <Text style={s.amountLabel}>Target</Text>
                  <Text style={s.amountValue}>{formatINR(goal.target)}</Text>
                </View>
                <View style={s.divider} />
                <View style={s.amountBox}>
                  <Text style={s.amountLabel}>Remaining</Text>
                  <Text style={[s.amountValue, { color: colors.expense }]}>{formatINR(goal.target - goal.saved)}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>{editId ? 'Edit Saving' : 'Add Saving'}</Text>

            <Text style={s.label}>Name</Text>
            <TextInput style={s.input} value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} placeholder="e.g. Emergency Fund" placeholderTextColor={colors.icon} />

            <Text style={s.label}>Target Amount (₹)</Text>
            <TextInput style={s.input} value={form.target} onChangeText={(v) => setForm({ ...form, target: v })} keyboardType="numeric" placeholder="e.g. 500000" placeholderTextColor={colors.icon} />

            <Text style={s.label}>Saved So Far (₹)</Text>
            <TextInput style={s.input} value={form.saved} onChangeText={(v) => setForm({ ...form, saved: v })} keyboardType="numeric" placeholder="e.g. 100000" placeholderTextColor={colors.icon} />

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
        </View>
      </Modal>
    </View>
  );
}

const styles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
    loadingText: { fontSize: 14, color: colors.icon },
    summaryCard: { backgroundColor: '#E65100', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 8 },
    summaryLabel: { color: '#fff', fontSize: 14, opacity: 0.85 },
    summaryAmount: { color: '#fff', fontSize: 34, fontWeight: '800', marginTop: 4 },
    sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 12 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
    addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.tint, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    addBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
    goalCard: { backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 12, elevation: 1, borderLeftWidth: 4 },
    goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
    goalName: { fontSize: 15, fontWeight: '700', color: colors.text, flex: 1 },
    actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    editBtn: { padding: 6, backgroundColor: '#1565C015', borderRadius: 8 },
    deleteBtn: { padding: 6, backgroundColor: '#B71C1C15', borderRadius: 8 },
    amountRow: { flexDirection: 'row', alignItems: 'center' },
    amountBox: { flex: 1, alignItems: 'center' },
    amountLabel: { fontSize: 11, color: colors.icon, marginBottom: 4 },
    amountValue: { fontSize: 15, fontWeight: '800', color: colors.text },
    divider: { width: 1, height: 36, backgroundColor: colors.border },
    // Modal
    modalOverlay: { flex: 1, backgroundColor: '#00000066', justifyContent: 'flex-end' },
    modalBox: { backgroundColor: colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
    modalTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 16 },
    label: { fontSize: 13, color: colors.icon, marginBottom: 4, marginTop: 10 },
    input: { backgroundColor: colors.background, borderRadius: 10, padding: 12, fontSize: 14, color: colors.text, borderWidth: 1, borderColor: colors.border },
    colorRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
    colorDot: { width: 28, height: 28, borderRadius: 14 },
    colorDotSelected: { borderWidth: 3, borderColor: colors.text },
    modalActions: { flexDirection: 'row', gap: 12, marginTop: 24 },
    cancelBtn: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
    cancelText: { color: colors.text, fontWeight: '600' },
    saveBtn: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: colors.tint, alignItems: 'center' },
    saveText: { color: '#fff', fontWeight: '700' },
  });
