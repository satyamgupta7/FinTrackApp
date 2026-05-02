import { useTheme } from '@/src/hooks/useTheme';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Modal, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SecurityScreen() {
  const { colors, styles: g } = useTheme();
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
    if (!newPw || newPw !== confirmPw) { Alert.alert('Error', 'Passwords do not match.'); return; }
    if (newPw.length < 8) { Alert.alert('Error', 'Password must be at least 8 characters.'); return; }
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

  const toggleItems = [
    { id: 'biometric', title: 'Biometric Login', desc: 'Use fingerprint or face ID to unlock',    icon: 'finger-print-outline', color: '#1565C0', value: biometric, onToggle: setBiometric },
    { id: 'autolock',  title: 'Auto Lock',        desc: 'Lock app after 5 minutes of inactivity', icon: 'lock-closed-outline',  color: '#6A1B9A', value: autoLock,  onToggle: setAutoLock  },
  ];

  return (
    <ScrollView style={g.container} contentContainerStyle={g.scrollContent20}>
      <TouchableOpacity style={g.back} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </TouchableOpacity>
      <Text style={g.pageTitle}>Security</Text>
      <View style={g.cardOverflow}>
        <Text style={g.sectionLabel}>Authentication</Text>
        {toggleItems.map((item, i) => (
          <View key={item.id} style={[g.row, i < toggleItems.length - 1 && g.rowBorder]}>
            <View style={[g.iconBox, { backgroundColor: item.color + '18' }]}><Ionicons name={item.icon as any} size={20} color={item.color} /></View>
            <View style={{ flex: 1 }}><Text style={g.rowTitle}>{item.title}</Text><Text style={g.rowDesc}>{item.desc}</Text></View>
            <Switch value={item.value} onValueChange={item.onToggle} trackColor={{ false: colors.border, true: colors.tint + '80' }} thumbColor={item.value ? colors.tint : colors.icon} />
          </View>
        ))}
      </View>
      <View style={g.cardOverflow}>
        <Text style={g.sectionLabel}>Password</Text>
        <TouchableOpacity style={g.row} onPress={() => setPwModal(true)}>
          <View style={[g.iconBox, { backgroundColor: '#B71C1C18' }]}><Ionicons name="key-outline" size={20} color="#B71C1C" /></View>
          <View style={{ flex: 1 }}><Text style={g.rowTitle}>Change Password</Text><Text style={g.rowDesc}>Update your account password</Text></View>
          <Ionicons name="chevron-forward" size={18} color={colors.icon} />
        </TouchableOpacity>
      </View>
      <View style={g.cardOverflow}>
        <Text style={g.sectionLabel}>Account Security</Text>
        <View style={g.row}>
          <View style={[g.iconBox, { backgroundColor: '#1B5E2018' }]}><Ionicons name="mail-outline" size={20} color="#1B5E20" /></View>
          <View style={{ flex: 1 }}><Text style={g.rowTitle}>Email Verified</Text><Text style={g.rowDesc}>{user?.primaryEmailAddress?.emailAddress}</Text></View>
          <Ionicons name="checkmark-circle" size={20} color={colors.income} />
        </View>
      </View>
      <Modal visible={pwModal} transparent animationType="slide">
        <View style={g.overlay}>
          <View style={g.modalBox}>
            <Text style={g.modalTitle}>Change Password</Text>
            <Text style={g.fieldLabel}>Current Password</Text>
            <TextInput style={g.input} value={currentPw} onChangeText={setCurrentPw} secureTextEntry placeholderTextColor={colors.icon} placeholder="Current password" />
            <Text style={g.fieldLabel}>New Password</Text>
            <TextInput style={g.input} value={newPw} onChangeText={setNewPw} secureTextEntry placeholderTextColor={colors.icon} placeholder="Min 8 characters" />
            <Text style={g.fieldLabel}>Confirm New Password</Text>
            <TextInput style={g.input} value={confirmPw} onChangeText={setConfirmPw} secureTextEntry placeholderTextColor={colors.icon} placeholder="Repeat new password" />
            <View style={g.modalBtns}>
              <TouchableOpacity style={g.cancelBtn} onPress={() => setPwModal(false)}><Text style={g.cancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={[g.saveBtn, saving && g.btnDisabled]} onPress={handleChangePassword} disabled={saving}><Text style={g.saveText}>{saving ? 'Saving...' : 'Update'}</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
