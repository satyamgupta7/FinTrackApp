import { Colors } from '@/src/config/theme';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { useAuth, useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Alert, KeyboardAvoidingView, Platform,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';

export default function SignInScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const s = styles(colors);
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { isSignedIn } = useAuth();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSignIn() {
    if (!isLoaded) return;
    if (isSignedIn) {
      router.replace('/(tabs)/dashboard');
      return;
    }
    if (!email.trim() || !password.trim()) {
      Alert.alert('Validation', 'Please enter email and password.');
      return;
    }
    setLoading(true);
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace('/(tabs)/dashboard');
      }
    } catch (e: any) {
      const code = e.errors?.[0]?.code;
      if (code === 'session_exists') {
        router.replace('/(tabs)/dashboard');
        return;
      }
      Alert.alert('Sign In Failed', e.errors?.[0]?.message ?? e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={s.inner}>
        <View style={s.logoBox}>
          <Text style={s.logoFin}>Fin</Text><Text style={s.logoTrack}>Track</Text>
        </View>
        <Text style={s.title}>Welcome Back</Text>
        <Text style={s.subtitle}>Sign in to your account</Text>

        <TextInput style={s.input} value={email} onChangeText={setEmail} placeholder="Email Address" keyboardType="email-address" autoCapitalize="none" placeholderTextColor={colors.icon} />
        <View style={s.passwordBox}>
          <TextInput style={s.passwordInput} value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry={!showPassword} placeholderTextColor={colors.icon} />
          <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={s.eyeBtn}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.icon} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[s.btn, loading && s.btnDisabled]} onPress={handleSignIn} disabled={loading}>
          <Text style={s.btnText}>{loading ? 'Signing In...' : 'Sign In'}</Text>
        </TouchableOpacity>

        <View style={s.footer}>
          <Text style={s.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/sign-up')}>
            <Text style={s.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    inner: { flex: 1, padding: 24, justifyContent: 'center' },
    logoBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 24 },
    logoFin: { fontSize: 40, color: colors.tint, fontWeight: '900' },
    logoTrack: { fontSize: 40, color: colors.text, fontWeight: '900' },
    title: { fontSize: 26, fontWeight: '800', color: colors.text, textAlign: 'center', marginBottom: 6 },
    subtitle: { fontSize: 14, color: colors.icon, textAlign: 'center', marginBottom: 28 },
    input: { backgroundColor: colors.card, borderRadius: 12, padding: 14, fontSize: 15, color: colors.text, borderWidth: 1, borderColor: colors.border, marginBottom: 14 },
    passwordBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, marginBottom: 14 },
    passwordInput: { flex: 1, padding: 14, fontSize: 15, color: colors.text },
    eyeBtn: { paddingHorizontal: 14 },
    btn: { backgroundColor: colors.tint, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 4 },
    btnDisabled: { opacity: 0.6 },
    btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
    footerText: { color: colors.icon, fontSize: 14 },
    footerLink: { color: colors.tint, fontSize: 14, fontWeight: '700' },
  });
