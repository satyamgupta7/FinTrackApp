import { Colors } from '@/src/config/theme';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const FEATURES = [
  { icon: 'wallet-outline',    color: '#1565C0', text: 'Track savings goals with progress' },
  { icon: 'cash-outline',      color: '#E65100', text: 'Manage loans & EMI schedules' },
  { icon: 'receipt-outline',   color: '#6A1B9A', text: 'Monthly expense tracking & categories' },
  { icon: 'bar-chart-outline', color: '#1B5E20', text: 'Reports & analytics dashboard' },
  { icon: 'calculator-outline',color: '#00695C', text: 'Budget planner with actuals' },
  { icon: 'cloud-outline',     color: '#37474F', text: 'Cloud sync via Firebase' },
];

export default function AboutScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const s = styles(colors);
  const router = useRouter();

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 20 }}>
      <TouchableOpacity style={s.back} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </TouchableOpacity>

      <View style={s.logoBox}>
        <Text style={s.logoFin}>Fin</Text><Text style={s.logoTrack}>Track</Text>
      </View>
      <Text style={s.version}>Version 1.0.0</Text>
      <Text style={s.tagline}>Your personal finance companion</Text>

      <View style={s.card}>
        <Text style={s.sectionTitle}>About the App</Text>
        <Text style={s.desc}>
          FinTrack helps you take control of your finances by tracking income, expenses, loans, and savings — all in one place. Built with React Native & Expo.
        </Text>
      </View>

      <View style={s.card}>
        <Text style={s.sectionTitle}>Features</Text>
        {FEATURES.map((f, i) => (
          <View key={i} style={[s.featureRow, i < FEATURES.length - 1 && s.featureBorder]}>
            <View style={[s.iconBox, { backgroundColor: f.color + '18' }]}>
              <Ionicons name={f.icon as any} size={18} color={f.color} />
            </View>
            <Text style={s.featureText}>{f.text}</Text>
          </View>
        ))}
      </View>

      <View style={s.card}>
        <Text style={s.sectionTitle}>Built With</Text>
        {[
          { label: 'React Native + Expo', icon: 'phone-portrait-outline', color: '#1565C0' },
          { label: 'Expo Router',         icon: 'navigate-outline',       color: '#6A1B9A' },
          { label: 'Clerk Auth',          icon: 'shield-outline',         color: '#1B5E20' },
          { label: 'Firebase Firestore',  icon: 'cloud-outline',          color: '#E65100' },
        ].map((item, i, arr) => (
          <View key={item.label} style={[s.featureRow, i < arr.length - 1 && s.featureBorder]}>
            <View style={[s.iconBox, { backgroundColor: item.color + '18' }]}>
              <Ionicons name={item.icon as any} size={18} color={item.color} />
            </View>
            <Text style={s.featureText}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={s.footer}>
        <Text style={s.footerText}>Made with ❤️ by Satyam Gupta</Text>
        <Text style={s.footerSub}>© 2025 FinTrack. All rights reserved.</Text>
      </View>
    </ScrollView>
  );
}

const styles = (colors: typeof Colors.light) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  back: { marginBottom: 16 },
  logoBox: { flexDirection: 'row', justifyContent: 'center', marginBottom: 8 },
  logoFin: { fontSize: 44, fontWeight: '900', color: colors.tint },
  logoTrack: { fontSize: 44, fontWeight: '900', color: colors.text },
  version: { textAlign: 'center', fontSize: 13, color: colors.icon, marginBottom: 4 },
  tagline: { textAlign: 'center', fontSize: 15, color: colors.text, marginBottom: 24, fontStyle: 'italic' },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 16, elevation: 1 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 12 },
  desc: { fontSize: 14, color: colors.icon, lineHeight: 22 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  featureBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  featureText: { fontSize: 14, color: colors.text },
  footer: { alignItems: 'center', paddingVertical: 20 },
  footerText: { fontSize: 14, color: colors.text, fontWeight: '600' },
  footerSub: { fontSize: 12, color: colors.icon, marginTop: 4 },
});
