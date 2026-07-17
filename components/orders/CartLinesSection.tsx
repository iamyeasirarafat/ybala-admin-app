import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { CartLine } from '@/types';
import { formatCurrency } from '@/utils/format';

interface CartLinesSectionProps {
  lines: CartLine[];
  onQtyChange: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

export const CartLinesSection: React.FC<CartLinesSectionProps> = ({
  lines,
  onQtyChange,
  onRemove,
}) => {
  if (lines.length === 0) {
    return (
      <View className="items-center py-8 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
        <Ionicons name="cart-outline" size={28} color="#9CA3AF" />
        <Text className="text-sm text-gray-400 mt-2">No items added yet.</Text>
      </View>
    );
  }

  return (
    <View className="gap-3">
      {lines.map((line) => {
        const menuName =
          line.menu_data?.translations?.en?.name || `Item #${line.menu}`;
        const variant =
          line.variant && typeof line.variant === 'object'
            ? (line.variant as { name?: string }).name
            : undefined;
        const total = Number(line.price) * line.quantity;
        return (
          <View
            key={line.id}
            className="flex-row items-center p-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <View className="flex-1 pr-2">
              <Text
                className="text-sm font-semibold text-gray-900 dark:text-white"
                numberOfLines={1}
              >
                {menuName}
                {variant ? ` · ${variant}` : ''}
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {formatCurrency(Number(line.price))} · {formatCurrency(total)}
              </Text>
            </View>

            <View className="flex-row items-center gap-2 mr-2">
              <TouchableOpacity
                onPress={() =>
                  onQtyChange(line.id, Math.max(1, line.quantity - 1))
                }
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 items-center justify-center"
              >
                <Ionicons name="remove" size={16} color="#6B7280" />
              </TouchableOpacity>
              <Text className="text-sm font-semibold text-gray-900 dark:text-white w-5 text-center">
                {line.quantity}
              </Text>
              <TouchableOpacity
                onPress={() => onQtyChange(line.id, line.quantity + 1)}
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 items-center justify-center"
              >
                <Ionicons name="add" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => onRemove(line.id)} hitSlop={8}>
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};
