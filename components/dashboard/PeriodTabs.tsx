import { Text, TouchableOpacity, View } from 'react-native';
import { AnalyticsPeriod } from '@/types';

interface PeriodTabsProps {
  value: AnalyticsPeriod;
  onChange: (period: AnalyticsPeriod) => void;
}

const OPTIONS: { label: string; value: AnalyticsPeriod }[] = [
  { label: '12 Months', value: '12_months' },
  { label: '3 Months', value: '3_months' },
  { label: '7 Days', value: '7_days' },
];

export const PeriodTabs: React.FC<PeriodTabsProps> = ({ value, onChange }) => {
  return (
    <View className="flex-row bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      {OPTIONS.map((option) => {
        const active = option.value === value;
        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => onChange(option.value)}
            activeOpacity={0.8}
            className={`flex-1 py-2 rounded-md ${active ? 'bg-primary-600' : ''}`}
          >
            <Text
              className={`text-center text-xs font-semibold ${
                active ? 'text-white' : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
