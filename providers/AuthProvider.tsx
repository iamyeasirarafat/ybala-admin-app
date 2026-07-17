import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore, initializeAuth } from '@/store/auth.store';
import { consumePendingRoute } from '@/utils/deepLink';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      await initializeAuth();
      setIsLoading(false);
    };

    init();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/(auth)/login');
    } else if (isAuthenticated) {
      // Resume a pending deep link (from a notification tap while logged out
      // or during cold start) as soon as the session is ready.
      const pending = consumePendingRoute();
      if (pending) {
        router.replace(pending as any);
      } else if (inAuthGroup) {
        // Otherwise, land on the tabs after a normal login.
        router.replace('/(tabs)');
      }
    }
  }, [isAuthenticated, segments, isLoading]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <ActivityIndicator size="large" color="#6FA25F" />
      </View>
    );
  }

  return <>{children}</>;
};
