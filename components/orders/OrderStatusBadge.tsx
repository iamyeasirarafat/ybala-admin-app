import React from 'react';
import { Text, View } from 'react-native';
import { OrderStatus } from '@/types';
import { STATUS_META } from './orderStatus';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  size = 'sm',
}) => {
  const meta = STATUS_META[status] ?? STATUS_META.draft;
  const pad = size === 'sm' ? 'px-2 py-0.5' : 'px-3 py-1';
  const text = size === 'sm' ? 'text-[10px]' : 'text-xs';
  return (
    <View className={`rounded-full ${pad} ${meta.bg}`}>
      <Text className={`${text} font-semibold ${meta.text}`}>{meta.label}</Text>
    </View>
  );
};
