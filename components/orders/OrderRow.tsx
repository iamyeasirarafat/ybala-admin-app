import { Order, OrderStatus, ShippingAddress } from '@/types';
import { formatCurrency } from '@/utils/format';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { OrderStatusBadge } from './OrderStatusBadge';

const formatAddress = (item: Order) => {
  if (item.is_pickup) {
    return `Pickup${item.branch_info?.en_title ? ` · ${item.branch_info.en_title}` : ''}`;
  }
  const address = item.shipping_address as ShippingAddress | undefined;
  return [address?.street, address?.city].filter(Boolean).join(', ');
};

const formatItemsSummary = (item: Order) => {
  const lines = item.carts ?? [];
  if (lines.length === 0) return 'No items';
  return lines
    .map((line) => {
      const name = line.menu_data?.translations?.en?.name || `Item #${line.menu}`;
      return `${line.quantity} x ${name}`;
    })
    .join(', ');
};

interface OrderRowProps {
  item: Order;
  onPress: (id: number) => void;
  onAdvanceStatus: (id: number, status: OrderStatus) => void;
  isUpdating: boolean;
}

export const OrderRow = React.memo(
  ({ item, onPress, onAdvanceStatus, isUpdating }: OrderRowProps) => {
    const name = item.full_name || 'Guest';
    const nextAction =
      item.status === 'pending'
        ? { label: 'Accept', next: 'processing' as OrderStatus }
        : item.status === 'processing'
          ? { label: 'Complete', next: 'completed' as OrderStatus }
          : null;

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onPress(item.id)}
        className="p-5 rounded-3xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 mb-4"
      >
        <View className="flex-row items-start justify-between">
          <Text
            className="flex-1 text-lg font-bold text-gray-900 dark:text-white pr-2"
            numberOfLines={1}
          >
            {name}
          </Text>
          <View className="items-end gap-1">
            <Text className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Order Id #{item.id}
            </Text>
            <OrderStatusBadge status={item.status} />
          </View>
        </View>

        {!!item.customer_phone && (
          <Text className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            {item.customer_phone}
          </Text>
        )}
        <Text
          className="text-sm text-gray-600 dark:text-gray-300 mt-0.5"
          numberOfLines={1}
        >
          {formatAddress(item)}
        </Text>

        <View className="rounded-2xl bg-gray-50 dark:bg-gray-900/50 p-4 mt-4">
          <Text
            className="text-sm text-gray-700 dark:text-gray-200"
            numberOfLines={2}
          >
            {formatItemsSummary(item)}
          </Text>
          <Text className="text-lg font-bold text-gray-900 dark:text-white mt-1">
            {formatCurrency(Number(item.price ?? item.total_price ?? 0))}
          </Text>
        </View>

        <View className="flex-row items-stretch gap-3 mt-4">
          <TouchableOpacity
            onPress={() => onPress(item.id)}
            activeOpacity={0.8}
            className="flex-1 py-3.5 rounded-xl bg-primary-600 items-center justify-center"
          >
            <Text className="text-sm font-bold text-white">See Details</Text>
          </TouchableOpacity>

          {nextAction && (
            <TouchableOpacity
              onPress={() => onAdvanceStatus(item.id, nextAction.next)}
              activeOpacity={0.8}
              disabled={isUpdating}
              className="flex-1 py-3.5 rounded-xl bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 items-center justify-center"
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color="#6FA25F" />
              ) : (
                <Text className="text-sm font-bold text-gray-900 dark:text-white">
                  {nextAction.label}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  },
);
OrderRow.displayName = 'OrderRow';
