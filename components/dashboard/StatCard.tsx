import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: keyof typeof Ionicons.glyphMap;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon }) => {
  return (
    <View className="flex-1 min-w-[45%] bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <View className="flex-row items-center mb-2">
        {icon && (
          <Ionicons name={icon} size={16} color="#6FA25F" style={{ marginRight: 6 }} />
        )}
        <Text className="text-xs text-gray-500 dark:text-gray-400" numberOfLines={1}>
          {label}
        </Text>
      </View>
      <Text className="text-xl font-bold text-gray-900 dark:text-white" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
};
