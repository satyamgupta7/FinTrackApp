import { tokenCache } from '@/src/services/tokenCache';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { FinanceProvider } from '@/src/context/FinanceContext';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { CLERK_PUBLISHABLE_KEY, STACK_SCREENS, ROUTES } from '@/src/config/common.constants';

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing clerkPublishableKey in app.json extra');
}

function AuthGuard() {
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    const inAuth = segments[0] === '(auth)';
    if (!isSignedIn && !inAuth) {
      router.replace(ROUTES.SIGN_IN);
    } else if (isSignedIn && inAuth) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [isSignedIn, isLoaded, segments, router]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <FinanceProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <AuthGuard />
          <Stack>
            {STACK_SCREENS.map(name => (
              <Stack.Screen key={name} name={name} options={{ headerShown: false }} />
            ))}
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </FinanceProvider>
    </ClerkProvider>
  );
}
