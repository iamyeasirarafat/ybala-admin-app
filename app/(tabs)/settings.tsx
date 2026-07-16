import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Alert, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { APP_CONFIG } from '@/constants/config';
import { useProfile } from '@/hooks/useProfile';
import { useAuthStore } from '@/store/auth.store';

export default function AccountScreen() {
  const { logout } = useAuthStore();
  const { data: profile } = useProfile();
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
        <View className="px-4 py-6">
          <Text className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            Account
          </Text>

          {/* Account Card */}
          {profile && (
            <View className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-5 mb-6 border border-primary-200 dark:border-primary-800">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-primary-600 rounded-full items-center justify-center mr-3">
                  <Ionicons name="person" size={24} color="#FFF" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold text-primary-900 dark:text-primary-100">
                    {profile.userType === 'admin' ? 'Administrator' : 'Manager'}
                  </Text>
                  <Text className="text-sm text-primary-700 dark:text-primary-300">
                    {profile.email}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Appearance */}
          <View className="bg-white dark:bg-gray-800 rounded-xl p-5 mb-6 border border-gray-200 dark:border-gray-700">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons
                  name={colorScheme === 'dark' ? 'moon' : 'sunny'}
                  size={22}
                  color={colorScheme === 'dark' ? '#82c36f' : '#F59E0B'}
                />
                <Text className="ml-3 font-semibold text-gray-900 dark:text-white">
                  Dark Mode
                </Text>
              </View>
              <Switch
                value={colorScheme === 'dark'}
                onValueChange={toggleColorScheme}
                trackColor={{ false: '#d1d5db', true: '#6FA25F' }}
                thumbColor={colorScheme === 'dark' ? '#82c36f' : '#f3f4f6'}
              />
            </View>
          </View>

          {/* App Info */}
          <View className="bg-white dark:bg-gray-800 rounded-xl p-5 mb-6 border border-gray-200 dark:border-gray-700">
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

          {/* Logout */}
          <TouchableOpacity
            className="bg-red-500 active:bg-red-600 rounded-xl py-4 items-center"
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center">
              <Ionicons name="log-out-outline" size={22} color="#FFF" />
              <Text className="text-white font-bold text-base ml-2">Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}
