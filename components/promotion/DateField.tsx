import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Platform, Text, TouchableOpacity } from 'react-native';

interface DateFieldProps {
  label: string;
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  placeholder?: string;
}

const toYMD = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const DateField: React.FC<DateFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Select date',
}) => {
  const [open, setOpen] = useState(false);

  const handlePicked = (event: any, selected?: Date) => {
    if (Platform.OS !== 'ios') setOpen(false);
    if (event?.type === 'dismissed' || !selected) return;
    onChange(toYMD(selected));
  };

  return (
    <>
      <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </Text>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
        className="flex-row items-center justify-between px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50"
      >
        <Text
          className={`text-base ${
            value ? 'text-gray-900 dark:text-white' : 'text-gray-400'
          }`}
        >
          {value || placeholder}
        </Text>
        <Ionicons name="calendar-outline" size={18} color="#6FA25F" />
      </TouchableOpacity>

      {open && (
        <DateTimePicker
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          value={value ? new Date(value) : new Date()}
          onChange={handlePicked}
        />
      )}
    </>
  );
};
