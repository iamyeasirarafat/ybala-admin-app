import { Button } from '@/components/ui';
import { useAuthStore } from '@/store/auth.store';
import { toast } from '@/utils/toast';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Text, View } from 'react-native';

export const LogoutButton: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
            toast.success('Logged out successfully.');
            router.replace('/(auth)/login');
          } catch {
            toast.error('Logout failed. Please try again.');
          }
        },
      },
    ]);
  };

  return (
    <View className="px-4 py-6">
      {isAuthenticated ? (
        <Button
          size="lg"
          variant="solid"
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
          onPress={handleLogout}
        >
          <Text className="text-red-600 dark:text-red-400 font-semibold text-base">
            Logout
          </Text>
        </Button>
      ) : (
        <Button
          size="lg"
          variant="outline-primary"
          onPress={() => router.replace('/(auth)/login')}
        >
          <Text className="text-primary-600 dark:text-primary-400 font-semibold text-base">
            Login
          </Text>
        </Button>
      )}
    </View>
  );
};
