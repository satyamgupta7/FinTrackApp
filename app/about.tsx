import { useTheme } from '@/src/hooks/useTheme';
import { FEATURES, BUILT_WITH, APP_VERSION, APP_TAGLINE } from '@/src/config/common.constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function AboutScreen() {
  const { colors, styles: g } = useTheme();
  const router = useRouter();

  return (
    <ScrollView style={g.container} contentContainerStyle={g.scrollContent20}>
      <TouchableOpacity style={g.backLg} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </TouchableOpacity>
      <View style={g.aboutLogoBox}>
        <Text style={[g.aboutLogo, { color: colors.tint }]}>Fin</Text>
        <Text style={[g.aboutLogo, { color: colors.text }]}>Track</Text>
      </View>
      <Text style={[g.metaText, g.aboutVersion]}>Version {APP_VERSION}</Text>
      <Text style={g.aboutTagline}>{APP_TAGLINE}</Text>
      <View style={g.card}>
        <Text style={g.sectionTitleSm}>About the App</Text>
        <Text style={g.aboutDesc}>FinTrack helps you take control of your finances by tracking income, expenses, loans, and savings — all in one place. Built with React Native & Expo.</Text>
      </View>
      <View style={g.card}>
        <Text style={g.sectionTitleSm}>Features</Text>
        {FEATURES.map((f, i) => (
          <View key={i} style={[g.featureRow, i < FEATURES.length - 1 && g.featureBorder]}>
            <View style={[g.featureIconBox, { backgroundColor: f.color + '18' }]}><Ionicons name={f.icon as any} size={18} color={f.color} /></View>
            <Text style={g.featureText}>{f.text}</Text>
          </View>
        ))}
      </View>
      <View style={g.card}>
        <Text style={g.sectionTitleSm}>Built With</Text>
        {BUILT_WITH.map((item, i) => (
          <View key={item.label} style={[g.featureRow, i < BUILT_WITH.length - 1 && g.featureBorder]}>
            <View style={[g.featureIconBox, { backgroundColor: item.color + '18' }]}><Ionicons name={item.icon as any} size={18} color={item.color} /></View>
            <Text style={g.featureText}>{item.label}</Text>
          </View>
        ))}
      </View>
      <View style={g.aboutFooter}>
        <Text style={g.aboutFooterText}>Made with ❤️ by FinTrack Team</Text>
        <Text style={g.metaText}>© 2025 FinTrack. All rights reserved.</Text>
      </View>
    </ScrollView>
  );
}
