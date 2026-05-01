import { Colors } from '@/src/config/theme';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { saveUserProfile } from '@/src/services/firestore';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';

export default function SignUpScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const s = styles(colors);
  const router = useRouter();
  const { signUp, setActive, isLoaded } = useSignUp();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [code, setCode]           = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [loading, setLoading]     = useState(false);

  async function handleSignUp() {
    if (!isLoaded) return;
    if (!firstName.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Validation', 'Please fill all required fields.');
      return;
    }
    setLoading(true);
    try {
      await signUp.create({ firstName, lastName, emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (e: any) {
      Alert.alert('Sign Up Failed', e.errors?.[0]?.message ?? e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        await saveUserProfile(result.createdUserId!, {
          firstName, lastName, email,
          createdAt: new Date().toISOString(),
        });
        router.replace('/(tabs)/dashboard');
      }
    } catch (e: any) {
      Alert.alert('Verification Failed', e.errors?.[0]?.message ?? e.message);
    } finally {
      setLoading(false);
    }
  }

  if (pendingVerification) {
    return (
      <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={s.inner}>
          <Text style={s.title}>Verify Email</Text>
          <Text style={s.subtitle}>Enter the code sent to {email}</Text>
          <TextInput style={s.input} value={code} onChangeText={setCode} placeholder="Verification code" keyboardType="numeric" placeholderTextColor={colors.icon} />
          <TouchableOpacity style={[s.btn, loading && s.btnDisabled]} onPress={handleVerify} disabled={loading}>
            <Text style={s.btnText}>{loading ? 'Verifying...' : 'Verify & Continue'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.inner} keyboardShouldPersistTaps="handled">
        <View style={s.logoBox}>
          <Text style={s.logoText}>₹</Text>
        </View>
        <Text style={s.title}>Create Account</Text>
        <Text style={s.subtitle}>Start tracking your finances</Text>

        <View style={s.row}>
          <TextInput style={[s.input, { flex: 1 }]} value={firstName} onChangeText={setFirstName} placeholder="First Name" placeholderTextColor={colors.icon} />
          <View style={{ width: 12 }} />
          <TextInput style={[s.input, { flex: 1 }]} value={lastName} onChangeText={setLastName} placeholder="Last Name" placeholderTextColor={colors.icon} />
        </View>
        <TextInput style={s.input} value={email} onChangeText={setEmail} placeholder="Email Address" keyboardType="email-address" autoCapitalize="none" placeholderTextColor={colors.icon} />
        <TextInput style={s.input} value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry placeholderTextColor={colors.icon} />

        <TouchableOpacity style={[s.btn, loading && s.btnDisabled]} onPress={handleSignUp} disabled={loading}>
          <Text style={s.btnText}>{loading ? 'Creating Account...' : 'Sign Up'}</Text>
        </TouchableOpacity>

        <View style={s.footer}>
          <Text style={s.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/sign-in')}>
            <Text style={s.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    inner: { flexGrow: 1, padding: 24, justifyContent: 'center' },
    logoBox: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.tint, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 24 },
    logoText: { fontSize: 32, color: '#fff', fontWeight: '800' },
    title: { fontSize: 26, fontWeight: '800', color: colors.text, textAlign: 'center', marginBottom: 6 },
    subtitle: { fontSize: 14, color: colors.icon, textAlign: 'center', marginBottom: 28 },
    row: { flexDirection: 'row', marginBottom: 0 },
    input: { backgroundColor: colors.card, borderRadius: 12, padding: 14, fontSize: 15, color: colors.text, borderWidth: 1, borderColor: colors.border, marginBottom: 14 },
    btn: { backgroundColor: colors.tint, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 4 },
    btnDisabled: { opacity: 0.6 },
    btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
    footerText: { color: colors.icon, fontSize: 14 },
    footerLink: { color: colors.tint, fontSize: 14, fontWeight: '700' },
  });
