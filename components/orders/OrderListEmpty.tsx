import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

interface OrderListEmptyProps {
  loading: boolean;
}

export const OrderListEmpty: React.FC<OrderListEmptyProps> = ({ loading }) => {
  if (loading) {
    return (
      <View className="items-center py-16">
        <ActivityIndicator size="large" color="#6FA25F" />
      </View>
    );
  }
  return (
    <View className="items-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
      <Ionicons name="receipt-outline" size={32} color="#9CA3AF" />
      <Text className="text-gray-500 dark:text-gray-400 mt-2">
        No orders found.
      </Text>
    </View>
  );
};
