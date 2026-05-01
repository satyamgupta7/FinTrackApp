import { Colors } from '@/src/config/theme';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee',      flag: '🇮🇳' },
  { code: 'USD', symbol: '$', name: 'US Dollar',          flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro',               flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound',      flag: '🇬🇧' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen',       flag: '🇯🇵' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham',       flag: '🇦🇪' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar',  flag: '🇸🇬' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar',   flag: '🇨🇦' },
];

export default function CurrencySettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const s = styles(colors);
  const router = useRouter();
  const [selected, setSelected] = useState('INR');

  const current = CURRENCIES.find(c => c.code === selected)!;

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 20 }}>
      <TouchableOpacity style={s.back} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </TouchableOpacity>
      <Text style={s.pageTitle}>Currency Settings</Text>

      <View style={s.currentCard}>
        <Text style={s.currentFlag}>{current.flag}</Text>
        <View>
          <Text style={s.currentCode}>{current.symbol} {current.code}</Text>
          <Text style={s.currentName}>{current.name}</Text>
        </View>
        <View style={s.activeBadge}><Text style={s.activeBadgeText}>Active</Text></View>
      </View>

      <Text style={s.sectionTitle}>Select Currency</Text>
      <View style={s.card}>
        {CURRENCIES.map((c, i) => (
          <TouchableOpacity key={c.code} style={[s.row, i < CURRENCIES.length - 1 && s.rowBorder]} onPress={() => setSelected(c.code)}>
            <Text style={s.flag}>{c.flag}</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.code}>{c.code} — {c.symbol}</Text>
              <Text style={s.name}>{c.name}</Text>
            </View>
            {selected === c.code && <Ionicons name="checkmark-circle" size={22} color={colors.tint} />}
          </TouchableOpacity>
        ))}
      </View>

      <View style={s.noteCard}>
        <Ionicons name="information-circle-outline" size={18} color={colors.icon} />
        <Text style={s.noteText}>Currency change affects display only. All stored values remain in INR.</Text>
      </View>
    </ScrollView>
  );
}

const styles = (colors: typeof Colors.light) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  back: { marginBottom: 8 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 20 },
  currentCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.tint, borderRadius: 16, padding: 20, marginBottom: 24 },
  currentFlag: { fontSize: 36 },
  currentCode: { color: '#fff', fontSize: 20, fontWeight: '800' },
  currentName: { color: '#fff', fontSize: 13, opacity: 0.85 },
  activeBadge: { marginLeft: 'auto', backgroundColor: '#ffffff30', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  activeBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 10 },
  card: { backgroundColor: colors.card, borderRadius: 16, overflow: 'hidden', elevation: 1, marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  flag: { fontSize: 28 },
  code: { fontSize: 14, fontWeight: '700', color: colors.text },
  name: { fontSize: 12, color: colors.icon, marginTop: 2 },
  noteCard: { flexDirection: 'row', gap: 10, backgroundColor: colors.card, borderRadius: 12, padding: 14, alignItems: 'flex-start' },
  noteText: { flex: 1, fontSize: 12, color: colors.icon, lineHeight: 18 },
});
