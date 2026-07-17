import React from 'react';
import { Text, View } from 'react-native';
import { CartLine, ShopSettings, ValidatedCoupon } from '@/types';
import { formatCurrency } from '@/utils/format';

interface OrderSummaryProps {
  lines: CartLine[];
  coupons: ValidatedCoupon[];
  isPickup: boolean;
  shopSettings?: ShopSettings;
}

export const computeSubtotal = (lines: CartLine[]): number =>
  lines.reduce((sum, l) => sum + Number(l.price) * l.quantity, 0);

export const computeDiscount = (
  coupons: ValidatedCoupon[],
  subtotal: number,
): number =>
  coupons.reduce((sum, c) => {
    const amount = Number(c.amount);
    return sum + (c.percentage ? (subtotal * amount) / 100 : amount);
  }, 0);

const SummaryRow = ({
  label,
  value,
  bold,
  danger,
}: {
  label: string;
  value: string;
  bold?: boolean;
  danger?: boolean;
}) => (
  <View className="flex-row items-center justify-between py-1">
    <Text
      className={`text-sm ${
        bold
          ? 'font-bold text-gray-900 dark:text-white'
          : 'text-gray-500 dark:text-gray-400'
      }`}
    >
      {label}
    </Text>
    <Text
      className={`text-sm ${
        bold
          ? 'font-bold text-gray-900 dark:text-white'
          : danger
            ? 'text-green-600 dark:text-green-400'
            : 'text-gray-700 dark:text-gray-200'
      }`}
    >
      {value}
    </Text>
  </View>
);

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  lines,
  coupons,
  isPickup,
  shopSettings,
}) => {
  const subtotal = computeSubtotal(lines);
  const vat = shopSettings?.enable_vat
    ? (subtotal * Number(shopSettings.vat)) / 100
    : 0;
  const delivery = isPickup
    ? 0
    : shopSettings?.enable_delivery_charge
      ? Number(shopSettings.devlivery_charge)
      : 0;
  const discount = computeDiscount(coupons, subtotal);
  const total = subtotal + vat + delivery - discount;

  return (
    <View className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
      {vat > 0 && <SummaryRow label="VAT" value={formatCurrency(vat)} />}
      {!isPickup && (
        <SummaryRow label="Delivery" value={formatCurrency(delivery)} />
      )}
      {discount > 0 && (
        <SummaryRow
          label="Discount"
          value={`- ${formatCurrency(discount)}`}
          danger
        />
      )}
      <View className="h-px bg-gray-100 dark:bg-gray-700 my-1.5" />
      <SummaryRow label="Total" value={formatCurrency(total)} bold />
    </View>
  );
};
