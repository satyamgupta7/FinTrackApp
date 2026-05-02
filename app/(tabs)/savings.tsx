import { useTheme } from '@/src/hooks/useTheme';
import { useFinance, SavingGoal } from '@/src/context/FinanceContext';
import { formatINR } from '@/src/utils/helpers';
import { GOAL_COLORS } from '@/src/config/common.constants';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const emptyForm = { name: '', target: '', saved: '', color: GOAL_COLORS[0] };

export default function SavingsScreen() {
  const { colors, styles: g } = useTheme();
  const { savings: goals, addOrUpdateSaving, removeSaving, loading } = useFinance();
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const totalSaved = goals.reduce((sum, g) => sum + g.saved, 0);

  function openAdd() { setEditId(null); setForm(emptyForm); setModalVisible(true); }
  function openEdit(goal: SavingGoal) {
    setEditId(goal.id);
    setForm({ name: goal.name, target: String(goal.target), saved: String(goal.saved), color: goal.color });
    setModalVisible(true);
  }
  function handleSave() {
    if (!form.name.trim() || !form.target || !form.saved) { Alert.alert('Validation', 'Please fill all fields.'); return; }
    addOrUpdateSaving({ id: editId ?? Date.now().toString(), name: form.name, target: Number(form.target), saved: Number(form.saved), color: form.color });
    setModalVisible(false);
  }
  function handleDelete(id: string) {
    Alert.alert('Delete', 'Remove this savings goal?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeSaving(id) },
    ]);
  }

  return (
    <View style={g.container}>
      {loading ? (
        <View style={[g.centered, { gap: 12 }]}>
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={g.loadingText}>Loading savings...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={g.scrollContent}>
          <View style={[g.summaryHeroCard, { backgroundColor: '#E65100' }]}>
            <Text style={g.summaryHeroLabel}>Total Saved</Text>
            <Text style={g.summaryHeroAmount}>{formatINR(totalSaved)}</Text>
          </View>
          <View style={g.sectionRow}>
            <Text style={g.sectionTitle}>Savings Goals</Text>
            <TouchableOpacity style={g.addBtn} onPress={openAdd}>
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={g.addBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
          {goals.map((goal) => (
            <View key={goal.id} style={[g.goalCard, { borderLeftColor: goal.color }]}>
              <View style={[g.sectionRow, { marginVertical: 0, marginBottom: 14 }]}>
                <Text style={g.goalName}>{goal.name}</Text>
                <View style={g.actions}>
                  <TouchableOpacity style={g.editBtn} onPress={() => openEdit(goal)}>
                    <Ionicons name="pencil" size={14} color="#1565C0" />
                  </TouchableOpacity>
                  <TouchableOpacity style={g.deleteBtn} onPress={() => handleDelete(goal.id)}>
                    <Ionicons name="trash" size={14} color="#B71C1C" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={g.amountRow}>
                <View style={g.amountBox}><Text style={g.amountLabel}>Saved</Text><Text style={[g.amountValue, { color: goal.color }]}>{formatINR(goal.saved)}</Text></View>
                <View style={g.divider} />
                <View style={g.amountBox}><Text style={g.amountLabel}>Target</Text><Text style={g.amountValue}>{formatINR(goal.target)}</Text></View>
                <View style={g.divider} />
                <View style={g.amountBox}><Text style={g.amountLabel}>Remaining</Text><Text style={[g.amountValue, { color: colors.expense }]}>{formatINR(goal.target - goal.saved)}</Text></View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={g.overlay}>
          <View style={g.modalBox}>
            <Text style={g.modalTitleLg}>{editId ? 'Edit Saving' : 'Add Saving'}</Text>
            <Text style={g.label}>Name</Text>
            <TextInput style={g.input} value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} placeholder="e.g. Emergency Fund" placeholderTextColor={colors.icon} />
            <Text style={g.label}>Target Amount (₹)</Text>
            <TextInput style={g.input} value={form.target} onChangeText={(v) => setForm({ ...form, target: v })} keyboardType="numeric" placeholder="e.g. 500000" placeholderTextColor={colors.icon} />
            <Text style={g.label}>Saved So Far (₹)</Text>
            <TextInput style={g.input} value={form.saved} onChangeText={(v) => setForm({ ...form, saved: v })} keyboardType="numeric" placeholder="e.g. 100000" placeholderTextColor={colors.icon} />
            <Text style={g.label}>Color</Text>
            <View style={g.colorRow}>
              {GOAL_COLORS.map((c) => (
                <TouchableOpacity key={c} onPress={() => setForm({ ...form, color: c })} style={[g.colorDot, { backgroundColor: c }, form.color === c && g.colorDotSelected]} />
              ))}
            </View>
            <View style={g.modalBtnsLg}>
              <TouchableOpacity style={g.cancelBtn} onPress={() => setModalVisible(false)}><Text style={g.cancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={g.saveBtn} onPress={handleSave}><Text style={g.saveText}>{editId ? 'Update' : 'Save'}</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
