import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { MultiSelectField } from '@/components/promotion/MultiSelectField';
import { Input } from '@/components/ui';
import {
  useCategoryOptions,
  useCustomerOptions,
  useMenuOptions,
} from '@/hooks/usePromotion';
import { CouponMethod } from '@/types';

interface ComplexCouponFieldsProps {
  method: CouponMethod | '';
  onMethodChange: (m: CouponMethod) => void;
  customers: number[];
  categories: number[];
  menus: number[];
  onChange: (
    key: 'customers' | 'category' | 'menu',
    ids: number[],
  ) => void;
  minAmount: string;
  onMinAmountChange: (v: string) => void;
}

export const ComplexCouponFields: React.FC<ComplexCouponFieldsProps> = ({
  method,
  onMethodChange,
  customers,
  categories,
  menus,
  onChange,
  minAmount,
  onMinAmountChange,
}) => {
  const { data: menuOptions = [], isLoading: menuLoading } = useMenuOptions();
  const { data: categoryOptions = [], isLoading: catLoading } =
    useCategoryOptions();
  const { data: customerOptions = [], isLoading: custLoading } =
    useCustomerOptions();

  return (
    <View className="gap-4">
      {/* Coupon method */}
      <View>
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Coupon Method
        </Text>
        <View className="flex-row bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {(['and', 'or'] as CouponMethod[]).map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => onMethodChange(m)}
              className={`flex-1 py-2 rounded-lg items-center ${
                method === m ? 'bg-white dark:bg-gray-700' : ''
              }`}
              activeOpacity={0.8}
            >
              <Text
                className={`text-sm font-semibold uppercase ${
                  method === m
                    ? 'text-primary-600 dark:text-primary-300'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {m}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <MultiSelectField
        label="Add Customers"
        options={customerOptions}
        selectedIds={customers}
        onChange={(ids) => onChange('customers', ids)}
        placeholder="Search a customer"
        loading={custLoading}
      />
      <MultiSelectField
        label="Add Categories"
        options={categoryOptions}
        selectedIds={categories}
        onChange={(ids) => onChange('category', ids)}
        placeholder="Search a category"
        loading={catLoading}
      />
      <MultiSelectField
        label="Add Food"
        options={menuOptions}
        selectedIds={menus}
        onChange={(ids) => onChange('menu', ids)}
        placeholder="Search a food item"
        loading={menuLoading}
      />

      <Input
        label="Minimum Amount (optional)"
        value={minAmount}
        onChangeText={onMinAmountChange}
        placeholder="Minimum order value"
        keyboardType="numeric"
      />
    </View>
  );
};
