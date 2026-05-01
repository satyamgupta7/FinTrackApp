import { Colors } from '@/src/config/theme';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

type NotifItem = { id: string; title: string; desc: string; icon: string; color: string; enabled: boolean };

const INITIAL: NotifItem[] = [
  { id: '1', title: 'EMI Reminders',      desc: 'Get reminded 3 days before EMI due date',    icon: 'calendar-outline',       color: '#E65100', enabled: true  },
  { id: '2', title: 'Budget Alerts',       desc: 'Alert when spending exceeds budget limit',   icon: 'warning-outline',        color: '#F57F17', enabled: true  },
  { id: '3', title: 'Savings Milestones',  desc: 'Celebrate when you hit a savings goal',      icon: 'trophy-outline',         color: '#1565C0', enabled: true  },
  { id: '4', title: 'Monthly Summary',     desc: 'Monthly income & expense summary report',    icon: 'bar-chart-outline',      color: '#6A1B9A', enabled: false },
  { id: '5', title: 'Loan Payoff Alert',   desc: 'Notify when a loan is fully paid off',       icon: 'checkmark-circle-outline', color: '#1B5E20', enabled: true  },
  { id: '6', title: 'Overspend Warning',   desc: 'Alert when total spend exceeds income',      icon: 'alert-circle-outline',   color: '#B71C1C', enabled: true  },
  { id: '7', title: 'Weekly Digest',       desc: 'Weekly summary of your finances',            icon: 'newspaper-outline',      color: '#00695C', enabled: false },
  { id: '8', title: 'App Updates',         desc: 'Get notified about new features',            icon: 'information-circle-outline', color: '#546E7A', enabled: false },
];

export default function NotificationsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const s = styles(colors);
  const router = useRouter();
  const [items, setItems] = useState<NotifItem[]>(INITIAL);

  function toggle(id: string) {
    setItems(prev => prev.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n));
  }

  const enabledCount = items.filter(n => n.enabled).length;

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 20 }}>
      <TouchableOpacity style={s.back} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </TouchableOpacity>
      <Text style={s.pageTitle}>Notifications</Text>

      <View style={s.summaryCard}>
        <Ionicons name="notifications" size={28} color="#fff" />
        <View style={{ marginLeft: 14 }}>
          <Text style={s.summaryTitle}>{enabledCount} of {items.length} enabled</Text>
          <Text style={s.summaryDesc}>Manage your notification preferences</Text>
        </View>
      </View>

      <View style={s.card}>
        {items.map((item, index) => (
          <View key={item.id} style={[s.row, index < items.length - 1 && s.rowBorder]}>
            <View style={[s.iconBox, { backgroundColor: item.color + '18' }]}>
              <Ionicons name={item.icon as any} size={20} color={item.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.rowTitle}>{item.title}</Text>
              <Text style={s.rowDesc}>{item.desc}</Text>
            </View>
            <Switch
              value={item.enabled}
              onValueChange={() => toggle(item.id)}
              trackColor={{ false: colors.border, true: colors.tint + '80' }}
              thumbColor={item.enabled ? colors.tint : colors.icon}
            />
          </View>
        ))}
      </View>

      <TouchableOpacity style={s.allBtn} onPress={() => setItems(prev => prev.map(n => ({ ...n, enabled: true })))}>
        <Text style={s.allBtnText}>Enable All</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[s.allBtn, s.allBtnOff]} onPress={() => setItems(prev => prev.map(n => ({ ...n, enabled: false })))}>
        <Text style={[s.allBtnText, { color: colors.text }]}>Disable All</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = (colors: typeof Colors.light) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  back: { marginBottom: 8 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 20 },
  summaryCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E65100', borderRadius: 16, padding: 20, marginBottom: 20 },
  summaryTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  summaryDesc: { color: '#fff', fontSize: 12, opacity: 0.85, marginTop: 2 },
  card: { backgroundColor: colors.card, borderRadius: 16, overflow: 'hidden', elevation: 1, marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  rowTitle: { fontSize: 14, fontWeight: '600', color: colors.text },
  rowDesc: { fontSize: 12, color: colors.icon, marginTop: 2 },
  allBtn: { backgroundColor: colors.tint, borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 10 },
  allBtnOff: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  allBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
