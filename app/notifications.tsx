import { useTheme } from '@/src/hooks/useTheme';
import { INITIAL_NOTIFICATIONS } from '@/src/config/common.constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';

type NotifItem = { id: string; title: string; desc: string; icon: string; color: string; enabled: boolean };

export default function NotificationsScreen() {
  const { colors, styles: g } = useTheme();
  const router = useRouter();
  const [items, setItems] = useState<NotifItem[]>(INITIAL_NOTIFICATIONS.map(n => ({ ...n })));
  const enabledCount = items.filter(n => n.enabled).length;

  function toggle(id: string) { setItems(prev => prev.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n)); }

  return (
    <ScrollView style={g.container} contentContainerStyle={g.scrollContent20}>
      <TouchableOpacity style={g.back} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </TouchableOpacity>
      <Text style={g.pageTitle}>Notifications</Text>
      <View style={g.notifSummaryCard}>
        <Ionicons name="notifications" size={28} color="#fff" />
        <View style={{ marginLeft: 14 }}>
          <Text style={g.notifSummaryTitle}>{enabledCount} of {items.length} enabled</Text>
          <Text style={g.notifSummaryDesc}>Manage your notification preferences</Text>
        </View>
      </View>
      <View style={g.cardOverflow}>
        {items.map((item, index) => (
          <View key={item.id} style={[g.row, index < items.length - 1 && g.rowBorder]}>
            <View style={[g.iconBox, { backgroundColor: item.color + '18' }]}><Ionicons name={item.icon as any} size={20} color={item.color} /></View>
            <View style={{ flex: 1 }}><Text style={g.rowTitle}>{item.title}</Text><Text style={g.rowDesc}>{item.desc}</Text></View>
            <Switch value={item.enabled} onValueChange={() => toggle(item.id)} trackColor={{ false: colors.border, true: colors.tint + '80' }} thumbColor={item.enabled ? colors.tint : colors.icon} />
          </View>
        ))}
      </View>
      <TouchableOpacity style={[g.btn, { marginBottom: 10 }]} onPress={() => setItems(prev => prev.map(n => ({ ...n, enabled: true })))}>
        <Text style={g.btnText}>Enable All</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[g.btn, g.btnOutline]} onPress={() => setItems(prev => prev.map(n => ({ ...n, enabled: false })))}>
        <Text style={[g.btnText, { color: colors.text }]}>Disable All</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
