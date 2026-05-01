import { Colors } from '@/src/config/theme';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const s = styles(colors);
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useAuth();

  const firstName = user?.firstName ?? '';
  const lastName  = user?.lastName ?? '';
  const email     = user?.primaryEmailAddress?.emailAddress ?? '';
  const initials  = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();

  const [editFirst, setEditFirst] = useState(firstName);
  const [editLast,  setEditLast]  = useState(lastName);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await user?.update({ firstName: editFirst, lastName: editLast });
      Alert.alert('Success', 'Profile updated.');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 20 }}>
      <TouchableOpacity style={s.back} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </TouchableOpacity>

      <View style={s.avatarBox}>
        <View style={s.avatar}><Text style={s.avatarText}>{initials}</Text></View>
        <Text style={s.name}>{firstName} {lastName}</Text>
        <Text style={s.email}>{email}</Text>
      </View>

      <View style={s.card}>
        <Text style={s.sectionTitle}>Personal Information</Text>

        <Text style={s.label}>First Name</Text>
        <TextInput style={s.input} value={editFirst} onChangeText={setEditFirst} placeholderTextColor={colors.icon} />

        <Text style={s.label}>Last Name</Text>
        <TextInput style={s.input} value={editLast} onChangeText={setEditLast} placeholderTextColor={colors.icon} />

        <Text style={s.label}>Email Address</Text>
        <TextInput style={[s.input, s.inputDisabled]} value={email} editable={false} />

        <TouchableOpacity style={[s.btn, saving && { opacity: 0.6 }]} onPress={handleSave} disabled={saving}>
          <Text style={s.btnText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
        </TouchableOpacity>
      </View>

      <View style={s.card}>
        <Text style={s.sectionTitle}>Account</Text>
        <View style={s.infoRow}>
          <Ionicons name="mail-outline" size={18} color={colors.icon} />
          <Text style={s.infoText}>Email verified</Text>
          <Ionicons name="checkmark-circle" size={18} color={colors.income} />
        </View>
        <View style={[s.infoRow, { borderBottomWidth: 0 }]}>
          <Ionicons name="calendar-outline" size={18} color={colors.icon} />
          <Text style={s.infoText}>Member since {new Date(user?.createdAt ?? Date.now()).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = (colors: typeof Colors.light) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  back: { marginBottom: 16 },
  avatarBox: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.tint, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '800' },
  name: { fontSize: 20, fontWeight: '800', color: colors.text },
  email: { fontSize: 13, color: colors.icon, marginTop: 4 },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 1 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 16 },
  label: { fontSize: 12, color: colors.icon, marginBottom: 4, marginTop: 12 },
  input: { backgroundColor: colors.background, borderRadius: 10, padding: 12, fontSize: 14, color: colors.text, borderWidth: 1, borderColor: colors.border },
  inputDisabled: { opacity: 0.5 },
  btn: { backgroundColor: colors.tint, borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 20 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  infoText: { flex: 1, fontSize: 14, color: colors.text },
});
