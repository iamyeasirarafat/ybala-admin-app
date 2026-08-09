import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ORDER_LIST_TABS, OrderListTab } from './orderStatus';

interface OrderListHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  tab: OrderListTab;
  onTabChange: (tab: OrderListTab) => void;
  onCreatePress: () => void;
}

export const OrderListHeader: React.FC<OrderListHeaderProps> = ({
  search,
  onSearchChange,
  tab,
  onTabChange,
  onCreatePress,
}) => (
  <View className="gap-4 pb-3">
    <View className="flex-row items-center gap-3">
      <View className="flex-1 flex-row items-center px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <Ionicons name="search" size={18} color="#9CA3AF" />
        <TextInput
          value={search}
          onChangeText={onSearchChange}
          placeholder="Search by id, name, email, phone"
          placeholderTextColor="#9CA3AF"
          className="flex-1 ml-2 text-gray-900 dark:text-white"
          style={{ padding: 0, fontSize: 15 }}
        />
      </View>
      <TouchableOpacity
        onPress={onCreatePress}
        className="flex-row items-center px-3 py-2.5 rounded-xl bg-primary-600"
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={18} color="#FFF" />
        <Text className="text-white font-semibold text-sm ml-1">New</Text>
      </TouchableOpacity>
    </View>

    <View className="flex-row bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1">
      {ORDER_LIST_TABS.map((t) => {
        const active = tab === t.key;
        return (
          <TouchableOpacity
            key={t.key}
            onPress={() => onTabChange(t.key)}
            className={`flex-1 py-2.5 rounded-lg items-center ${
              active ? 'bg-primary-600' : ''
            }`}
            activeOpacity={0.8}
          >
            <Text
              className={`text-sm font-bold ${
                active ? 'text-white' : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);
