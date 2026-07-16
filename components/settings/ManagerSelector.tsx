import { useManagers } from '@/hooks/useSettings';
import { Manager } from '@/types';
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

interface ManagerSelectorProps {
  value?: number | null;
  onChange: (managerId: number | null, manager: Manager | null) => void;
}

const managerName = (m: Manager) => {
  const name = `${m.first_name || ''} ${m.last_name || ''}`.trim();
  return name || m.email || 'Manager';
};

export const ManagerSelector: React.FC<ManagerSelectorProps> = ({
  value,
  onChange,
}) => {
  const { data: managers = [], isLoading } = useManagers();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selected = useMemo(
    () => managers.find((m) => m.id === value) || null,
    [managers, value],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return managers;
    return managers.filter(
      (m) =>
        managerName(m).toLowerCase().includes(q) ||
        (m.email || '').toLowerCase().includes(q),
    );
  }, [managers, search]);

  return (
    <View>
      <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Manager
      </Text>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
        className="flex-row items-center justify-between px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50"
      >
        <View className="flex-1">
          {selected ? (
            <>
              <Text className="text-base text-gray-900 dark:text-white capitalize">
                {managerName(selected)}
              </Text>
              {selected.email ? (
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  {selected.email}
                </Text>
              ) : null}
            </>
          ) : (
            <Text className="text-base text-gray-400">Select a manager</Text>
          )}
        </View>
        <View className="flex-row items-center">
          {selected ? (
            <TouchableOpacity
              onPress={() => onChange(null, null)}
              hitSlop={8}
              className="mr-2"
            >
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ) : null}
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
                Select Manager
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
                  placeholder="Search by name or email"
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 ml-2 text-gray-900 dark:text-white"
                  style={{ padding: 0, fontSize: 15 }}
                />
              </View>
            </View>

            {isLoading ? (
              <Text className="text-center text-gray-500 py-6">Loading…</Text>
            ) : (
              <FlatList
                data={filtered}
                keyExtractor={(m) => String(m.id)}
                ListEmptyComponent={
                  <Text className="text-center text-gray-500 py-6">
                    No managers found.
                  </Text>
                }
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      onChange(item.id, item);
                      setOpen(false);
                    }}
                    className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700"
                  >
                    <View className="flex-1">
                      <Text className="text-base text-gray-900 dark:text-white capitalize">
                        {managerName(item)}
                      </Text>
                      {item.email ? (
                        <Text className="text-xs text-gray-500 dark:text-gray-400">
                          {item.email}
                        </Text>
                      ) : null}
                    </View>
                    {value === item.id && (
                      <Ionicons name="checkmark" size={20} color="#6FA25F" />
                    )}
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};
