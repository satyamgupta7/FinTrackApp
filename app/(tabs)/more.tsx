import { Colors } from '@/src/config/theme';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const menuItems = [
  { id: '1', label: 'Profile',            icon: 'person-outline',             color: '#1565C0', route: '/profile'           },
  { id: '2', label: 'Budget Planner',     icon: 'calculator-outline',         color: '#1B5E20', route: '/budget-planner'    },
  { id: '3', label: 'Reports & Analytics',icon: 'bar-chart-outline',          color: '#6A1B9A', route: '/reports'           },
  { id: '4', label: 'Notifications',      icon: 'notifications-outline',      color: '#E65100', route: '/notifications'     },
  { id: '5', label: 'Currency Settings',  icon: 'globe-outline',              color: '#00695C', route: '/currency-settings' },
  { id: '6', label: 'Security',           icon: 'shield-checkmark-outline',   color: '#B71C1C', route: '/security'          },
  { id: '7', label: 'Help & Support',     icon: 'help-circle-outline',        color: '#37474F', route: '/help'              },
  { id: '8', label: 'About',              icon: 'information-circle-outline', color: '#546E7A', route: '/about'             },
];

export default function MoreScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const s = styles(colors);
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const firstName = user?.firstName ?? 'User';
  const lastName  = user?.lastName ?? '';
  const email     = user?.primaryEmailAddress?.emailAddress ?? '';
  const initials  = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();

  async function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => {
        await signOut();
        router.replace('/(auth)/sign-in');
      }},
    ]);
  }

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 16 }}>
      <View style={s.profileCard}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>{initials}</Text>
        </View>
        <View>
          <Text style={s.profileName}>{firstName} {lastName}</Text>
          <Text style={s.profileEmail}>{email}</Text>
        </View>
      </View>

      <View style={s.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={item.id} style={[s.menuItem, index < menuItems.length - 1 && s.menuBorder]} onPress={() => router.push(item.route as any)}>
            <View style={[s.menuIcon, { backgroundColor: item.color + '15' }]}>
              <Ionicons name={item.icon as any} size={20} color={item.color} />
            </View>
            <Text style={s.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.icon} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={s.logoutBtn} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={20} color="#B71C1C" />
        <Text style={s.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    profileCard: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: colors.card, borderRadius: 16, padding: 20, marginBottom: 20, elevation: 1 },
    avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.tint, justifyContent: 'center', alignItems: 'center' },
    avatarText: { color: '#fff', fontSize: 20, fontWeight: '700' },
    profileName: { fontSize: 18, fontWeight: '700', color: colors.text },
    profileEmail: { fontSize: 13, color: colors.icon, marginTop: 2 },
    menuContainer: { backgroundColor: colors.card, borderRadius: 16, overflow: 'hidden', elevation: 1 },
    menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
    menuBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
    menuIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    menuLabel: { flex: 1, fontSize: 15, color: colors.text },
    logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#B71C1C15', borderRadius: 12, padding: 16, marginTop: 20 },
    logoutText: { color: '#B71C1C', fontSize: 15, fontWeight: '600' },
  });
