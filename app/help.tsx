import { Colors } from '@/src/config/theme';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const FAQS = [
  { q: 'How do I add a new loan?',           a: 'Go to the Loans tab and tap the "Add" button in the top right corner.' },
  { q: 'How do I track my savings?',          a: 'Navigate to the Savings tab to add and manage your savings goals.' },
  { q: 'Can I edit expense data?',            a: 'Yes, go to the Expenses tab, tap the pencil icon on any month column to edit values.' },
  { q: 'How is Net Worth calculated?',        a: 'Net Worth = Total Savings − Total Loan Remaining.' },
  { q: 'How do I change my password?',        a: 'Go to More → Security → Change Password.' },
  { q: 'Is my data backed up?',               a: 'Yes, all your data is securely stored in Firebase Firestore and synced across devices.' },
  { q: 'How do I add a custom category?',     a: 'In the Expenses tab, tap "Add Category" to create a custom expense category.' },
  { q: 'Can I delete a month from expenses?', a: 'Yes, tap the trash icon in the column header of any month in the Expenses tab.' },
];

export default function HelpScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const s = styles(colors);
  const router = useRouter();
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 20 }}>
      <TouchableOpacity style={s.back} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </TouchableOpacity>
      <Text style={s.pageTitle}>Help & Support</Text>

      <View style={s.heroCard}>
        <Ionicons name="help-buoy-outline" size={32} color="#fff" />
        <Text style={s.heroTitle}>How can we help?</Text>
        <Text style={s.heroDesc}>Find answers to common questions below</Text>
      </View>

      <Text style={s.sectionTitle}>Frequently Asked Questions</Text>
      <View style={s.card}>
        {FAQS.map((faq, i) => (
          <View key={i} style={[s.faqItem, i < FAQS.length - 1 && s.faqBorder]}>
            <TouchableOpacity style={s.faqQ} onPress={() => setExpanded(expanded === i ? null : i)}>
              <Text style={s.faqQText}>{faq.q}</Text>
              <Ionicons name={expanded === i ? 'chevron-up' : 'chevron-down'} size={18} color={colors.icon} />
            </TouchableOpacity>
            {expanded === i && <Text style={s.faqA}>{faq.a}</Text>}
          </View>
        ))}
      </View>

      <Text style={s.sectionTitle}>Contact Us</Text>
      <View style={s.card}>
        {[
          { icon: 'mail-outline',    color: '#1565C0', label: 'Email Support',   sub: 'satyamgupta.tech07@gmail.com', onPress: () => Linking.openURL('mailto:satyamgupta.tech07@gmail.com') },
          { icon: 'logo-github',     color: '#37474F', label: 'GitHub',          sub: 'Report bugs & feature requests', onPress: () => Linking.openURL('https://github.com') },
        ].map((item, i, arr) => (
          <TouchableOpacity key={item.label} style={[s.contactRow, i < arr.length - 1 && s.faqBorder]} onPress={item.onPress}>
            <View style={[s.iconBox, { backgroundColor: item.color + '18' }]}>
              <Ionicons name={item.icon as any} size={20} color={item.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.contactLabel}>{item.label}</Text>
              <Text style={s.contactSub}>{item.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.icon} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = (colors: typeof Colors.light) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  back: { marginBottom: 8 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 20 },
  heroCard: { backgroundColor: '#37474F', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 24, gap: 8 },
  heroTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  heroDesc: { color: '#fff', fontSize: 13, opacity: 0.8 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 10 },
  card: { backgroundColor: colors.card, borderRadius: 16, overflow: 'hidden', elevation: 1, marginBottom: 20 },
  faqItem: { padding: 16 },
  faqBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  faqQ: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQText: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.text, paddingRight: 8 },
  faqA: { fontSize: 13, color: colors.icon, marginTop: 10, lineHeight: 20 },
  contactRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  contactLabel: { fontSize: 14, fontWeight: '600', color: colors.text },
  contactSub: { fontSize: 12, color: colors.icon, marginTop: 2 },
});
