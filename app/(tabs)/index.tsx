import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Screen } from '@/components/Screen';
import { useAuthStore } from '@/store/auth.store';

export default function HomeScreen() {
  const { user } = useAuthStore();

  return (
    <Screen>
      <ScrollView className="flex-1">
        <View className="py-6">
          {/* Header */}
          <Text className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            Welcome Home!
          </Text>
          {user && (
            <Text className="text-base text-gray-600 dark:text-gray-400 mb-6">
              {user.email}
            </Text>
          )}

          {/* Hero Card */}
          <View className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-5 mb-6">
            <Text className="text-primary-900 dark:text-primary-100 font-bold text-xl mb-3">
              🚀 Production-Ready Boilerplate
            </Text>
            <Text className="text-primary-700 dark:text-primary-300 leading-6">
              This is a clean Expo + React Native boilerplate with Expo Router,
              NativeWind (Tailwind CSS), Zustand, React Query, and Axios!
            </Text>
          </View>

          {/* Features Card */}
          <View className="bg-white dark:bg-gray-800 rounded-xl p-5 mb-6 border border-gray-200 dark:border-gray-700">
            <Text className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              ✨ Features Included
            </Text>
            {[
              { icon: '📱', text: 'Expo Router with Bottom Tabs' },
              { icon: '🎨', text: 'NativeWind + Tailwind CSS' },
              { icon: '🌓', text: 'Dark/Light Theme Support' },
              { icon: '🔄', text: 'Zustand State Management' },
              { icon: '⚡', text: 'React Query Data Fetching' },
              { icon: '🔌', text: 'Axios with Interceptors' },
              { icon: '🔐', text: 'Secure Token Storage' },
              { icon: '🛡️', text: 'Auth Flow & Protection' },
              { icon: '📘', text: 'TypeScript Support' },
            ].map((feature, index) => (
              <View key={index} className="flex-row items-center mb-3">
                <Text className="text-xl mr-3">{feature.icon}</Text>
                <Text className="text-gray-700 dark:text-gray-300 flex-1">
                  {feature.text}
                </Text>
              </View>
            ))}
          </View>

          {/* Quick Stats */}
          <View className="flex-row gap-3 mb-6">
            <View className="flex-1 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                9+
              </Text>
              <Text className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Features
              </Text>
            </View>
            <View className="flex-1 bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
              <Text className="text-2xl font-bold text-green-600 dark:text-green-400">
                100%
              </Text>
              <Text className="text-sm text-green-700 dark:text-green-300 mt-1">
                Type Safe
              </Text>
            </View>
            <View className="flex-1 bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
              <Text className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                Ready
              </Text>
              <Text className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                Production
              </Text>
            </View>
          </View>

          {/* Info Card */}
          <View className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-5 border border-amber-200 dark:border-amber-800">
            <View className="flex-row items-center mb-2">
              <Text className="text-xl mr-2">💡</Text>
              <Text className="text-lg font-bold text-amber-900 dark:text-amber-100">
                Next Steps
              </Text>
            </View>
            <Text className="text-amber-700 dark:text-amber-300 leading-6">
              Start building your app by adding your own screens and components.
              All styling is done with Tailwind CSS via NativeWind!
            </Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
