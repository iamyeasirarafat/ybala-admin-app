import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useUsers } from '@/hooks/useUser';

export interface SelectedCustomer {
  id: number | 'guest';
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
}

interface CustomerSelectFieldProps {
  value: SelectedCustomer | null;
  onChange: (c: SelectedCustomer) => void;
}

const GUEST: SelectedCustomer = {
  id: 'guest',
  first_name: 'Guest',
  last_name: 'User',
};

export const CustomerSelectField: React.FC<CustomerSelectFieldProps> = ({
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { data, isFetching } = useUsers({ search, limit: 50 });
  const users = data?.results ?? [];

  const label = value
    ? value.id === 'guest'
      ? 'Guest User'
      : `${value.first_name ?? ''} ${value.last_name ?? ''}`.trim()
    : 'Select a customer';

  const pick = (c: SelectedCustomer) => {
    onChange(c);
    setOpen(false);
  };

  return (
    <View>
      <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Customer
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
          {label}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#6B7280" />
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
                Select Customer
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
                  placeholder="Search name, email, phone"
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 ml-2 text-gray-900 dark:text-white"
                  style={{ padding: 0, fontSize: 15 }}
                />
              </View>
            </View>

            {/* Guest option pinned on top */}
            <TouchableOpacity
              onPress={() => pick(GUEST)}
              className="flex-row items-center px-5 py-3.5 border-b border-gray-100 dark:border-gray-700"
            >
              <View className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 items-center justify-center mr-3">
                <Ionicons name="person-outline" size={18} color="#9CA3AF" />
              </View>
              <Text className="text-base font-semibold text-gray-900 dark:text-white">
                Guest User
              </Text>
            </TouchableOpacity>

            {isFetching && users.length === 0 ? (
              <ActivityIndicator
                size="small"
                color="#6FA25F"
                className="py-6"
              />
            ) : (
              <FlatList
                data={users}
                keyExtractor={(u) => String(u.id)}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={
                  <Text className="text-center text-gray-500 py-6">
                    No customers found.
                  </Text>
                }
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() =>
                      pick({
                        id: item.id,
                        first_name: item.first_name,
                        last_name: item.last_name,
                        phone: item.phoneNumber ?? '',
                        email: item.email ?? '',
                      })
                    }
                    className="flex-row items-center px-5 py-3 border-b border-gray-100 dark:border-gray-700"
                  >
                    <View className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900 items-center justify-center mr-3">
                      <Text className="text-primary-700 dark:text-primary-300 font-bold">
                        {(item.first_name?.[0] || '?').toUpperCase()}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-base text-gray-900 dark:text-white">
                        {`${item.first_name ?? ''} ${item.last_name ?? ''}`.trim() ||
                          'Unnamed'}
                      </Text>
                      <Text className="text-xs text-gray-500 dark:text-gray-400">
                        {item.email || item.phoneNumber || `#${item.id}`}
                      </Text>
                    </View>
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
