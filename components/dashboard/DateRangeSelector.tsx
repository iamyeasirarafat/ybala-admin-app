import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';

interface DateRangeSelectorProps {
  startDate: string;
  endDate: string;
  onChange: (startDate: string, endDate: string) => void;
}

const toYMD = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  startDate,
  endDate,
  onChange,
}) => {
  const [open, setOpen] = useState<'start' | 'end' | null>(null);

  const handlePicked = (event: any, selected?: Date) => {
    const which = open;
    // On Android the picker is a dialog and closes itself on select/dismiss.
    if (Platform.OS !== 'ios') setOpen(null);
    if (event?.type === 'dismissed' || !selected || !which) return;

    const value = toYMD(selected);
    if (which === 'start') {
      onChange(value, endDate);
    } else {
      onChange(startDate, value);
    }
  };

  const hasRange = !!startDate || !!endDate;

  return (
    <View className="gap-2">
      <View className="flex-row gap-3">
        <DateButton
          label="Start Date"
          value={startDate}
          onPress={() => setOpen('start')}
        />
        <DateButton label="End Date" value={endDate} onPress={() => setOpen('end')} />
      </View>

      {hasRange && (
        <TouchableOpacity
          className="self-end flex-row items-center"
          onPress={() => onChange('', '')}
          activeOpacity={0.7}
        >
          <Ionicons name="close-circle" size={16} color="#F38744" />
          <Text className="text-xs text-secondary-600 dark:text-secondary-400 ml-1 font-medium">
            Clear filter
          </Text>
        </TouchableOpacity>
      )}

      {open && (
        <DateTimePicker
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          value={
            open === 'start' && startDate
              ? new Date(startDate)
              : open === 'end' && endDate
              ? new Date(endDate)
              : new Date()
          }
          onChange={handlePicked}
        />
      )}
    </View>
  );
};

const DateButton: React.FC<{ label: string; value: string; onPress: () => void }> = ({
  label,
  value,
  onPress,
}) => (
  <TouchableOpacity
    className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 bg-gray-50 dark:bg-gray-800"
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text className="text-[11px] text-gray-500 dark:text-gray-400 mb-0.5">{label}</Text>
    <View className="flex-row items-center justify-between">
      <Text
        className={`text-sm ${
          value ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'
        }`}
      >
        {value || 'Any'}
      </Text>
      <Ionicons name="calendar-outline" size={16} color="#6FA25F" />
    </View>
  </TouchableOpacity>
);
