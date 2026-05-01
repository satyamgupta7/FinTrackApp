import { Colors } from '@/src/config/theme';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SecurityScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const s = styles(colors);
  const router = useRouter();
  const { user } = useUser();

  const [biometric, setBiometric] = useState(false);
  const [autoLock, setAutoLock]   = useState(true);
  const [pwModal, setPwModal]     = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw]         = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [saving, setSaving]       = useState(false);

  async function handleChangePassword() {
    if (!newPw || newPw !== confirmPw) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    if (newPw.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters.');
      return;
    }
    setSaving(true);
    try {
      await user?.updatePassword({ currentPassword: currentPw, newPassword: newPw });
      Alert.alert('Success', 'Password updated successfully.');
      setPwModal(false);
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
    } catch (e: any) {
      Alert.alert('Error', e.errors?.[0]?.message ?? e.message);
    } finally {
      setSaving(false);
    }
  }

  const securityItems = [
    { id: 'biometric', title: 'Biometric Login',   desc: 'Use fingerprint or face ID to unlock', icon: 'finger-print-outline', color: '#1565C0', toggle: true, value: biometric, onToggle: setBiometric },
    { id: 'autolock',  title: 'Auto Lock',          desc: 'Lock app after 5 minutes of inactivity', icon: 'lock-closed-outline', color: '#6A1B9A', toggle: true, value: autoLock, onToggle: setAutoLock },
  ];

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 20 }}>
      <TouchableOpacity style={s.back} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </TouchableOpacity>
      <Text style={s.pageTitle}>Security</Text>

      <View style={s.card}>
        <Text style={s.sectionTitle}>Authentication</Text>
        {securityItems.map((item, i) => (
          <View key={item.id} style={[s.row, i < securityItems.length - 1 && s.rowBorder]}>
            <View style={[s.iconBox, { backgroundColor: item.color + '18' }]}>
              <Ionicons name={item.icon as any} size={20} color={item.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.rowTitle}>{item.title}</Text>
              <Text style={s.rowDesc}>{item.desc}</Text>
            </View>
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: colors.border, true: colors.tint + '80' }}
              thumbColor={item.value ? colors.tint : colors.icon}
            />
          </View>
        ))}
      </View>

      <View style={s.card}>
        <Text style={s.sectionTitle}>Password</Text>
        <TouchableOpacity style={s.row} onPress={() => setPwModal(true)}>
          <View style={[s.iconBox, { backgroundColor: '#B71C1C18' }]}>
            <Ionicons name="key-outline" size={20} color="#B71C1C" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.rowTitle}>Change Password</Text>
            <Text style={s.rowDesc}>Update your account password</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.icon} />
        </TouchableOpacity>
      </View>

      <View style={s.card}>
        <Text style={s.sectionTitle}>Account Security</Text>
        <View style={s.row}>
          <View style={[s.iconBox, { backgroundColor: '#1B5E2018' }]}>
            <Ionicons name="mail-outline" size={20} color="#1B5E20" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.rowTitle}>Email Verified</Text>
            <Text style={s.rowDesc}>{user?.primaryEmailAddress?.emailAddress}</Text>
          </View>
          <Ionicons name="checkmark-circle" size={20} color={colors.income} />
        </View>
      </View>

      <Modal visible={pwModal} transparent animationType="slide">
        <View style={s.overlay}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>Change Password</Text>
            <Text style={s.fieldLabel}>Current Password</Text>
            <TextInput style={s.input} value={currentPw} onChangeText={setCurrentPw} secureTextEntry placeholderTextColor={colors.icon} placeholder="Current password" />
            <Text style={s.fieldLabel}>New Password</Text>
            <TextInput style={s.input} value={newPw} onChangeText={setNewPw} secureTextEntry placeholderTextColor={colors.icon} placeholder="Min 8 characters" />
            <Text style={s.fieldLabel}>Confirm New Password</Text>
            <TextInput style={s.input} value={confirmPw} onChangeText={setConfirmPw} secureTextEntry placeholderTextColor={colors.icon} placeholder="Repeat new password" />
            <View style={s.modalBtns}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => setPwModal(false)}><Text style={s.cancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={[s.saveBtn, saving && { opacity: 0.6 }]} onPress={handleChangePassword} disabled={saving}>
                <Text style={s.saveText}>{saving ? 'Saving...' : 'Update'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = (colors: typeof Colors.light) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  back: { marginBottom: 8 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 20 },
  card: { backgroundColor: colors.card, borderRadius: 16, overflow: 'hidden', elevation: 1, marginBottom: 16 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: colors.icon, padding: 16, paddingBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  rowTitle: { fontSize: 14, fontWeight: '600', color: colors.text },
  rowDesc: { fontSize: 12, color: colors.icon, marginTop: 2 },
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
