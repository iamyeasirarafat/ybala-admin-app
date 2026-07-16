import '../global.css';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { setNavigationHandler } from '@/services/api';
import { useAuthStore } from '@/store/auth.store';
import { ToastContainer } from '@/utils/toast';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  useEffect(() => {
    // When a protected request fails auth (refresh expired), clear the
    // session — AuthProvider then redirects to the login screen.
    setNavigationHandler(() => {
      useAuthStore.getState().logout();
      router.replace('/(auth)/login');
    });
  }, []);

  return (
    <QueryProvider>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </AuthProvider>
      <ToastContainer />
    </QueryProvider>
  );
}
