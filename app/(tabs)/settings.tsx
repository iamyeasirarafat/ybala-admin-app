import React from 'react';
import { View, Text, TouchableOpacity, Alert, Switch, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { Screen } from '@/components/Screen';
import { useAuthStore } from '@/store/auth.store';
import { APP_CONFIG } from '@/constants/config';

export default function SettingsScreen() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <Screen>
      <ScrollView className="flex-1">
        <View className="py-6">
          {/* Header */}
          <Text className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            Settings
          </Text>

          {/* Account Card */}
          {user && (
            <View className="bg-gradient-to-r bg-primary-50 dark:bg-primary-900/20 rounded-xl p-5 mb-6 border border-primary-200 dark:border-primary-800">
              <View className="flex-row items-center mb-3">
                <View className="w-12 h-12 bg-primary-600 rounded-full items-center justify-center mr-3">
                  <Ionicons name="person" size={24} color="#FFF" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold text-primary-900 dark:text-primary-100">
                    Account
                  </Text>
                  <Text className="text-sm text-primary-700 dark:text-primary-300">
                    {user.email}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Appearance Card */}
          <View className="bg-white dark:bg-gray-800 rounded-xl p-5 mb-6 border border-gray-200 dark:border-gray-700">
            <Text className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
              🎨 Appearance
            </Text>
            <View className="flex-row items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <View className="flex-row items-center">
                <Ionicons
                  name={colorScheme === 'dark' ? 'moon' : 'sunny'}
                  size={24}
                  color={colorScheme === 'dark' ? '#FCD34D' : '#F59E0B'}
                />
                <View className="ml-3">
                  <Text className="font-semibold text-gray-900 dark:text-white">
                    Dark Mode
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400">
                    {colorScheme === 'dark' ? 'Enabled' : 'Disabled'}
                  </Text>
                </View>
              </View>
              <Switch
                value={colorScheme === 'dark'}
                onValueChange={toggleColorScheme}
                trackColor={{ false: '#d1d5db', true: '#0ea5e9' }}
                thumbColor={colorScheme === 'dark' ? '#38bdf8' : '#f3f4f6'}
              />
            </View>
          </View>

          {/* App Info Card */}
          <View className="bg-white dark:bg-gray-800 rounded-xl p-5 mb-6 border border-gray-200 dark:border-gray-700">
            <Text className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
              ℹ️ App Info
            </Text>
            <View className="space-y-3">
              <View className="flex-row justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <Text className="text-gray-600 dark:text-gray-400">App Name</Text>
                <Text className="font-semibold text-gray-900 dark:text-white">
                  {APP_CONFIG.name}
                </Text>
              </View>
              <View className="flex-row justify-between items-center py-2">
                <Text className="text-gray-600 dark:text-gray-400">Version</Text>
                <Text className="font-semibold text-gray-900 dark:text-white">
                  {APP_CONFIG.version}
                </Text>
              </View>
            </View>
          </View>

          {/* Preferences Card */}
          <View className="bg-white dark:bg-gray-800 rounded-xl p-5 mb-6 border border-gray-200 dark:border-gray-700">
            <Text className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
              ⚙️ Preferences
            </Text>

            <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
              <View className="flex-row items-center">
                <Ionicons name="notifications-outline" size={20} color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                <Text className="ml-3 text-gray-700 dark:text-gray-300">
                  Notifications
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
              <View className="flex-row items-center">
                <Ionicons name="language-outline" size={20} color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                <Text className="ml-3 text-gray-700 dark:text-gray-300">
                  Language
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <Ionicons name="shield-checkmark-outline" size={20} color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                <Text className="ml-3 text-gray-700 dark:text-gray-300">
                  Privacy
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            className="bg-red-500 active:bg-red-600 rounded-xl py-4 items-center mb-4"
            onPress={handleLogout}
          >
            <View className="flex-row items-center">
              <Ionicons name="log-out-outline" size={22} color="#FFF" />
              <Text className="text-white font-bold text-base ml-2">
                Logout
              </Text>
            </View>
          </TouchableOpacity>

          {/* Footer */}
          <Text className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
            Built with ❤️ using Expo & NativeWind
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}
