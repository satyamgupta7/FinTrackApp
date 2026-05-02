import { useTheme } from '@/src/hooks/useTheme';
import { FAQS, HELP_CONTACTS } from '@/src/config/common.constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function HelpScreen() {
  const { colors, styles: g } = useTheme();
  const router = useRouter();
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <ScrollView style={g.container} contentContainerStyle={g.scrollContent20}>
      <TouchableOpacity style={g.back} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </TouchableOpacity>
      <Text style={g.pageTitle}>Help & Support</Text>
      <View style={g.helpHeroCard}>
        <Ionicons name="help-buoy-outline" size={32} color="#fff" />
        <Text style={g.helpHeroTitle}>How can we help?</Text>
        <Text style={g.helpHeroDesc}>Find answers to common questions below</Text>
      </View>
      <Text style={g.sectionTitleSm}>Frequently Asked Questions</Text>
      <View style={g.cardOverflow}>
        {FAQS.map((faq, i) => (
          <View key={i} style={[g.faqItem, i < FAQS.length - 1 && g.rowBorder]}>
            <TouchableOpacity style={g.faqQ} onPress={() => setExpanded(expanded === i ? null : i)}>
              <Text style={[g.rowTitle, { flex: 1, paddingRight: 8 }]}>{faq.q}</Text>
              <Ionicons name={expanded === i ? 'chevron-up' : 'chevron-down'} size={18} color={colors.icon} />
            </TouchableOpacity>
            {expanded === i && <Text style={g.faqA}>{faq.a}</Text>}
          </View>
        ))}
      </View>
      <Text style={g.sectionTitleSm}>Contact Us</Text>
      <View style={g.cardOverflow}>
        {HELP_CONTACTS.map((item, i) => (
          <TouchableOpacity key={item.label} style={[g.row, i < HELP_CONTACTS.length - 1 && g.rowBorder]} onPress={() => Linking.openURL(item.url)}>
            <View style={[g.iconBox, { backgroundColor: item.color + '18' }]}><Ionicons name={item.icon as any} size={20} color={item.color} /></View>
            <View style={{ flex: 1 }}><Text style={g.rowTitle}>{item.label}</Text><Text style={g.rowDesc}>{item.sub}</Text></View>
            <Ionicons name="chevron-forward" size={16} color={colors.icon} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
