import { useTheme } from '@/src/hooks/useTheme';
import { ROUTES } from '@/src/config/common.constants';
import { useAuth, useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignInScreen() {
  const { colors, styles: g } = useTheme();
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { isSignedIn } = useAuth();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSignIn() {
    if (!isLoaded) return;
    if (isSignedIn) { router.replace(ROUTES.DASHBOARD); return; }
    if (!email.trim() || !password.trim()) { Alert.alert('Validation', 'Please enter email and password.'); return; }
    setLoading(true);
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace(ROUTES.DASHBOARD);
      }
    } catch (e: any) {
      const code = e.errors?.[0]?.code;
      if (code === 'session_exists') { router.replace(ROUTES.DASHBOARD); return; }
      Alert.alert('Sign In Failed', e.errors?.[0]?.message ?? e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={g.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={g.authInner}>
        <View style={g.authLogoRow}>
          <Text style={[g.authLogo, { color: colors.tint }]}>Fin</Text>
          <Text style={[g.authLogo, { color: colors.text }]}>Track</Text>
        </View>
        <Text style={[g.authTitle, { color: colors.text }]}>Welcome Back</Text>
        <Text style={[g.metaText, g.authSubtitle]}>Sign in to your account</Text>

        <TextInput style={g.authInput} value={email} onChangeText={setEmail} placeholder="Email Address" keyboardType="email-address" autoCapitalize="none" placeholderTextColor={colors.icon} />

        <View style={[g.authPasswordBox, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <TextInput style={[g.authPasswordInput, { color: colors.text }]} value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry={!showPassword} placeholderTextColor={colors.icon} />
          <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={g.authEyeBtn}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.icon} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[g.btn, loading && g.btnDisabled]} onPress={handleSignIn} disabled={loading}>
          <Text style={g.btnText}>{loading ? 'Signing In...' : 'Sign In'}</Text>
        </TouchableOpacity>

        <View style={g.authFooter}>
          <Text style={[g.metaText, { fontSize: 14 }]}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.replace(ROUTES.SIGN_UP)}>
            <Text style={[g.authFooterLink, { color: colors.tint }]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
