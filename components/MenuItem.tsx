import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  text: string;
  subtitle?: string;
  value?: string | number;
  onPress: () => void;
  showChevron?: boolean;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  iconColor = '#6FA25F',
  text,
  subtitle,
  value,
  onPress,
  showChevron = true,
}) => {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center justify-between py-4 px-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700"
    >
      <View className="flex-row items-center flex-1">
        <View className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-700 items-center justify-center">
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <View className="ml-3 flex-1">
          <Text className="text-base text-gray-900 dark:text-white">{text}</Text>
          {subtitle ? (
            <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      <View className="flex-row items-center">
        {value ? (
          <Text className="text-sm font-semibold text-gray-900 dark:text-white mr-2">
            {value}
          </Text>
        ) : null}
        {showChevron && (
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};
