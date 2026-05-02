import { useTheme } from '@/src/hooks/useTheme';
import { ROUTES } from '@/src/config/common.constants';
import { saveUserProfile } from '@/src/services/firestore';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignUpScreen() {
  const { colors, styles: g } = useTheme();
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
    if (!firstName.trim() || !email.trim() || !password.trim()) { Alert.alert('Validation', 'Please fill all required fields.'); return; }
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
        await saveUserProfile(result.createdUserId!, { firstName, lastName, email, createdAt: new Date().toISOString() });
        router.replace(ROUTES.DASHBOARD);
      }
    } catch (e: any) {
      Alert.alert('Verification Failed', e.errors?.[0]?.message ?? e.message);
    } finally {
      setLoading(false);
    }
  }

  if (pendingVerification) {
    return (
      <KeyboardAvoidingView style={g.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={g.authInner}>
          <Text style={[g.authTitle, { color: colors.text }]}>Verify Email</Text>
          <Text style={[g.metaText, g.authSubtitle]}>Enter the code sent to {email}</Text>
          <TextInput style={g.authInput} value={code} onChangeText={setCode} placeholder="Verification code" keyboardType="numeric" placeholderTextColor={colors.icon} />
          <TouchableOpacity style={[g.btn, loading && g.btnDisabled]} onPress={handleVerify} disabled={loading}>
            <Text style={g.btnText}>{loading ? 'Verifying...' : 'Verify & Continue'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView style={g.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={g.authInnerGrow} keyboardShouldPersistTaps="handled">
        <View style={[g.authLogoBox, { backgroundColor: colors.tint }]}>
          <Text style={g.authLogoText}>₹</Text>
        </View>
        <Text style={[g.authTitle, { color: colors.text }]}>Create Account</Text>
        <Text style={[g.metaText, g.authSubtitle]}>Start tracking your finances</Text>

        <View style={g.authRow}>
          <TextInput style={[g.authInput, { flex: 1 }]} value={firstName} onChangeText={setFirstName} placeholder="First Name" placeholderTextColor={colors.icon} />
          <View style={{ width: 12 }} />
          <TextInput style={[g.authInput, { flex: 1 }]} value={lastName} onChangeText={setLastName} placeholder="Last Name" placeholderTextColor={colors.icon} />
        </View>
        <TextInput style={g.authInput} value={email} onChangeText={setEmail} placeholder="Email Address" keyboardType="email-address" autoCapitalize="none" placeholderTextColor={colors.icon} />
        <TextInput style={g.authInput} value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry placeholderTextColor={colors.icon} />

        <TouchableOpacity style={[g.btn, loading && g.btnDisabled]} onPress={handleSignUp} disabled={loading}>
          <Text style={g.btnText}>{loading ? 'Creating Account...' : 'Sign Up'}</Text>
        </TouchableOpacity>

        <View style={g.authFooter}>
          <Text style={[g.metaText, { fontSize: 14 }]}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.replace(ROUTES.SIGN_IN)}>
            <Text style={[g.authFooterLink, { color: colors.tint }]}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
