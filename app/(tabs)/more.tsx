import { useTheme } from '@/src/hooks/useTheme';
import { MORE_MENU_ITEMS, ROUTES } from '@/src/config/common.constants';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function MoreScreen() {
  const { colors, styles: g } = useTheme();
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
      { text: 'Sign Out', style: 'destructive', onPress: async () => { await signOut(); router.replace(ROUTES.SIGN_IN); } },
    ]);
  }

  return (
    <ScrollView style={g.container} contentContainerStyle={g.scrollContent}>
      <View style={g.profileCard}>
        <View style={g.avatar}><Text style={g.avatarText}>{initials}</Text></View>
        <View>
          <Text style={g.profileName}>{firstName} {lastName}</Text>
          <Text style={g.metaText}>{email}</Text>
        </View>
      </View>
      <View style={g.cardOverflow}>
        {MORE_MENU_ITEMS.map((item, index) => (
          <TouchableOpacity key={item.id} style={[g.row, index < MORE_MENU_ITEMS.length - 1 && g.rowBorder]} onPress={() => router.push(item.route as any)}>
            <View style={[g.iconBox, { backgroundColor: item.color + '15' }]}>
              <Ionicons name={item.icon as any} size={20} color={item.color} />
            </View>
            <Text style={[g.rowTitle, { flex: 1 }]}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.icon} />
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={g.logoutBtn} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={20} color="#B71C1C" />
        <Text style={g.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
