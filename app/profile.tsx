import { useTheme } from '@/src/hooks/useTheme';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { colors, styles: g } = useTheme();
  const router = useRouter();
  const { user } = useUser();

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
    <ScrollView style={g.container} contentContainerStyle={g.scrollContent20}>
      <TouchableOpacity style={g.backLg} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </TouchableOpacity>
      <View style={g.avatarBox}>
        <View style={g.avatarLg}><Text style={g.avatarTextLg}>{initials}</Text></View>
        <Text style={g.userName}>{firstName} {lastName}</Text>
        <Text style={g.metaText}>{email}</Text>
      </View>
      <View style={g.card}>
        <Text style={g.sectionTitleSm}>Personal Information</Text>
        <Text style={g.label}>First Name</Text>
        <TextInput style={g.input} value={editFirst} onChangeText={setEditFirst} placeholderTextColor={colors.icon} />
        <Text style={g.label}>Last Name</Text>
        <TextInput style={g.input} value={editLast} onChangeText={setEditLast} placeholderTextColor={colors.icon} />
        <Text style={g.label}>Email Address</Text>
        <TextInput style={[g.input, g.inputDisabled]} value={email} editable={false} />
        <TouchableOpacity style={[g.btn, saving && g.btnDisabled, { marginTop: 20 }]} onPress={handleSave} disabled={saving}>
          <Text style={g.btnText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
        </TouchableOpacity>
      </View>
      <View style={g.card}>
        <Text style={g.sectionTitleSm}>Account</Text>
        <View style={g.infoRow}>
          <Ionicons name="mail-outline" size={18} color={colors.icon} />
          <Text style={g.infoText}>Email verified</Text>
          <Ionicons name="checkmark-circle" size={18} color={colors.income} />
        </View>
        <View style={[g.infoRow, { borderBottomWidth: 0 }]}>
          <Ionicons name="calendar-outline" size={18} color={colors.icon} />
          <Text style={g.infoText}>
            Member since {new Date(user?.createdAt ?? Date.now()).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
