import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { Switch, Text, View } from 'react-native';

export const PreferenceToggle: React.FC = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className="mt-4">
      <View className="px-4 pb-2">
        <Text className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
          Preferences
        </Text>
      </View>
      <View className="flex-row items-center justify-between py-4 px-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-700 items-center justify-center">
            <Ionicons
              name={isDark ? 'moon' : 'sunny'}
              size={20}
              color={isDark ? '#82c36f' : '#F59E0B'}
            />
          </View>
          <Text className="ml-3 text-base text-gray-900 dark:text-white">
            Dark Mode
          </Text>
        </View>
        <Switch
          value={isDark}
          onValueChange={toggleColorScheme}
          trackColor={{ false: '#d1d5db', true: '#6FA25F' }}
          thumbColor={isDark ? '#82c36f' : '#f3f4f6'}
        />
      </View>
    </View>
  );
};
