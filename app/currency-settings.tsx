import { useTheme } from '@/src/hooks/useTheme';
import { CURRENCIES, DEFAULT_CURRENCY } from '@/src/config/common.constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function CurrencySettingsScreen() {
  const { colors, styles: g } = useTheme();
  const router = useRouter();
  const [selected, setSelected] = useState(DEFAULT_CURRENCY);
  const current = CURRENCIES.find(c => c.code === selected)!;

  return (
    <ScrollView style={g.container} contentContainerStyle={g.scrollContent20}>
      <TouchableOpacity style={g.back} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </TouchableOpacity>
      <Text style={g.pageTitle}>Currency Settings</Text>
      <View style={[g.currentCard, { backgroundColor: colors.tint }]}>
        <Text style={g.currentFlag}>{current.flag}</Text>
        <View>
          <Text style={g.currentCode}>{current.symbol} {current.code}</Text>
          <Text style={g.currentName}>{current.name}</Text>
        </View>
        <View style={g.activeBadge}><Text style={g.activeBadgeText}>Active</Text></View>
      </View>
      <Text style={g.sectionTitleSm}>Select Currency</Text>
      <View style={g.cardOverflow}>
        {CURRENCIES.map((c, i) => (
          <TouchableOpacity key={c.code} style={[g.row, i < CURRENCIES.length - 1 && g.rowBorder]} onPress={() => setSelected(c.code)}>
            <Text style={g.currencyFlag}>{c.flag}</Text>
            <View style={{ flex: 1 }}>
              <Text style={g.rowTitle}>{c.code} — {c.symbol}</Text>
              <Text style={g.rowDesc}>{c.name}</Text>
            </View>
            {selected === c.code && <Ionicons name="checkmark-circle" size={22} color={colors.tint} />}
          </TouchableOpacity>
        ))}
      </View>
      <View style={[g.cardSm, g.noteCard]}>
        <Ionicons name="information-circle-outline" size={18} color={colors.icon} />
        <Text style={[g.metaText, { flex: 1, lineHeight: 18 }]}>Currency change affects display only. All stored values remain in INR.</Text>
      </View>
    </ScrollView>
  );
}
