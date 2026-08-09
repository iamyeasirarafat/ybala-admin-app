import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

interface OrderListFooterProps {
  visible: boolean;
  loading: boolean;
  onPress: () => void;
}

export const OrderListFooter: React.FC<OrderListFooterProps> = ({
  visible,
  loading,
  onPress,
}) => {
  if (!visible) return null;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      className="flex-row items-center justify-center py-3"
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#6FA25F" />
      ) : (
        <>
          <Text className="text-sm font-semibold text-primary-600 dark:text-primary-400 mr-1">
            Load more
          </Text>
          <Ionicons name="chevron-down" size={16} color="#6FA25F" />
        </>
      )}
    </TouchableOpacity>
  );
};
