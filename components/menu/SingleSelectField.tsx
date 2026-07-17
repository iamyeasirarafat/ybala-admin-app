import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SelectOption } from '@/types';

interface SingleSelectFieldProps {
  label: string;
  options: SelectOption[];
  value: number | null;
  onChange: (id: number | null) => void;
  placeholder?: string;
  loading?: boolean;
}

export const SingleSelectField: React.FC<SingleSelectFieldProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select…',
  loading,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selected = useMemo(
    () => options.find((o) => o.id === value) || null,
    [options, value],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.name.toLowerCase().includes(q));
  }, [options, search]);

  return (
    <View>
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
            selected ? 'text-gray-900 dark:text-white' : 'text-gray-400'
          }`}
        >
          {selected ? selected.name : placeholder}
        </Text>
        <View className="flex-row items-center">
          {selected && (
            <TouchableOpacity onPress={() => onChange(null)} hitSlop={8} className="mr-2">
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
          <Ionicons name="chevron-down" size={20} color="#6B7280" />
        </View>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white dark:bg-gray-800 rounded-t-3xl pb-8 max-h-[80%]">
            <View className="flex-row justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
              <Text className="text-lg font-bold text-gray-900 dark:text-white">
                {label}
              </Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Ionicons name="close" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <View className="px-5 py-3">
              <View className="flex-row items-center px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <Ionicons name="search" size={18} color="#9CA3AF" />
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder={placeholder}
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 ml-2 text-gray-900 dark:text-white"
                  style={{ padding: 0, fontSize: 15 }}
                />
              </View>
            </View>

            {loading ? (
              <Text className="text-center text-gray-500 py-6">Loading…</Text>
            ) : (
              <FlatList
                data={filtered}
                keyExtractor={(o) => String(o.id)}
                ListEmptyComponent={
                  <Text className="text-center text-gray-500 py-6">
                    No results found.
                  </Text>
                }
                renderItem={({ item }) => {
                  const active = value === item.id;
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        onChange(item.id);
                        setOpen(false);
                      }}
                      className="flex-row items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-700"
                    >
                      <Text className="text-base text-gray-900 dark:text-white capitalize">
                        {item.name}
                      </Text>
                      {active && (
                        <Ionicons name="checkmark" size={20} color="#6FA25F" />
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};
