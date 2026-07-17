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

interface MultiSelectFieldProps {
  label: string;
  options: SelectOption[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  placeholder?: string;
  loading?: boolean;
}

export const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  label,
  options,
  selectedIds,
  onChange,
  placeholder = 'Search…',
  loading,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selected = useMemo(
    () => options.filter((o) => selectedIds.includes(o.id)),
    [options, selectedIds],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        (o.subtitle || '').toLowerCase().includes(q),
    );
  }, [options, search]);

  const toggle = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

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
        <Text className="text-base text-gray-400">
          {selected.length ? `${selected.length} selected` : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#6B7280" />
      </TouchableOpacity>

      {selected.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mt-2">
          {selected.map((o) => (
            <View
              key={o.id}
              className="flex-row items-center px-3 py-1.5 rounded-lg bg-primary-100 dark:bg-primary-900"
            >
              <Text className="text-xs font-medium text-primary-700 dark:text-primary-200 mr-1">
                {o.name}
              </Text>
              <TouchableOpacity onPress={() => toggle(o.id)} hitSlop={6}>
                <Ionicons name="close" size={14} color="#6FA25F" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

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
                  const active = selectedIds.includes(item.id);
                  return (
                    <TouchableOpacity
                      onPress={() => toggle(item.id)}
                      className="flex-row items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-700"
                    >
                      <View className="flex-1">
                        <Text className="text-base text-gray-900 dark:text-white capitalize">
                          {item.name}
                        </Text>
                        {item.subtitle ? (
                          <Text className="text-xs text-gray-500 dark:text-gray-400">
                            {item.subtitle}
                          </Text>
                        ) : null}
                      </View>
                      <Ionicons
                        name={active ? 'checkbox' : 'square-outline'}
                        size={22}
                        color={active ? '#6FA25F' : '#9CA3AF'}
                      />
                    </TouchableOpacity>
                  );
                }}
              />
            )}

            <View className="px-5 pt-3">
              <TouchableOpacity
                onPress={() => setOpen(false)}
                className="bg-primary-600 rounded-xl py-3 items-center"
              >
                <Text className="text-white font-semibold">Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
