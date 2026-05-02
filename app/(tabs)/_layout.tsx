import { useTheme } from '@/src/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor:   colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle:             { backgroundColor: colors.card, borderTopColor: colors.border },
        headerStyle:             { backgroundColor: colors.card },
        headerTintColor:         colors.text,
        headerTitleStyle:        { fontWeight: '700' },
      }}
    >
      <Tabs.Screen name="dashboard" options={{ title: 'Dashboard', tabBarIcon: ({ color, size }) => <Ionicons name="home"                size={size} color={color} /> }} />
      <Tabs.Screen name="savings"   options={{ title: 'Savings',   tabBarIcon: ({ color, size }) => <Ionicons name="wallet"              size={size} color={color} /> }} />
      <Tabs.Screen name="loans"     options={{ title: 'Loans',     tabBarIcon: ({ color, size }) => <Ionicons name="cash"               size={size} color={color} /> }} />
      <Tabs.Screen name="expenses"  options={{ title: 'Expenses',  tabBarIcon: ({ color, size }) => <Ionicons name="receipt"            size={size} color={color} /> }} />
      <Tabs.Screen name="more"      options={{ title: 'More',      tabBarIcon: ({ color, size }) => <Ionicons name="ellipsis-horizontal" size={size} color={color} /> }} />
    </Tabs>
  );
}
