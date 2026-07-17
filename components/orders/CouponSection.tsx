import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useValidateCoupon } from '@/hooks/useOrder';
import { ValidatedCoupon } from '@/types';
import { extractApiError } from '@/utils/errorExtractor';
import { toast } from '@/utils/toast';

interface CouponSectionProps {
  cartIds: number[];
  userId: number | 'guest' | null;
  coupons: ValidatedCoupon[];
  onChange: (coupons: ValidatedCoupon[]) => void;
}

export const CouponSection: React.FC<CouponSectionProps> = ({
  cartIds,
  userId,
  coupons,
  onChange,
}) => {
  const [code, setCode] = useState('');
  const validate = useValidateCoupon();

  const apply = async () => {
    const trimmed = code.trim();
    if (!trimmed) return;
    if (cartIds.length === 0) {
      toast.error('Add items before applying a coupon.');
      return;
    }
    if (coupons.some((c) => c.code.toLowerCase() === trimmed.toLowerCase())) {
      toast.error('This coupon is already applied.');
      return;
    }
    try {
      const res = await validate.mutateAsync({
        code: trimmed,
        user_id: userId === 'guest' ? null : userId,
        cart_ids: cartIds,
      });
      if (res.valid && res.coupon) {
        onChange([...coupons, res.coupon]);
        setCode('');
        toast.success('Coupon applied.');
      } else {
        toast.error(res.message || 'Invalid coupon code.');
      }
    } catch (error) {
      toast.error(extractApiError(error, 'Invalid coupon code.'));
    }
  };

  const remove = (couponCode: string) =>
    onChange(coupons.filter((c) => c.code !== couponCode));

  return (
    <View className="gap-3">
      <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Promo Code
      </Text>

      <View className="flex-row items-center gap-2">
        <TextInput
          value={code}
          onChangeText={setCode}
          placeholder="Enter promo code"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="characters"
          className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white"
          style={{ fontSize: 15 }}
        />
        <TouchableOpacity
          onPress={apply}
          disabled={validate.isPending}
          className={`px-4 py-2.5 rounded-xl bg-primary-600 ${
            validate.isPending ? 'opacity-50' : ''
          }`}
          activeOpacity={0.85}
        >
          {validate.isPending ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text className="text-white font-semibold text-sm">Apply</Text>
          )}
        </TouchableOpacity>
      </View>

      {coupons.length > 0 && (
        <View className="gap-2">
          {coupons.map((c) => (
            <View
              key={c.code}
              className="flex-row items-center justify-between px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900"
            >
              <View className="flex-row items-center">
                <Ionicons name="pricetag" size={14} color="#22C55E" />
                <Text className="text-sm font-semibold text-green-700 dark:text-green-300 ml-2">
                  {c.code}
                </Text>
                <Text className="text-xs text-green-600 dark:text-green-400 ml-2">
                  {c.percentage ? `${c.amount}% off` : `${c.amount} AED off`}
                </Text>
              </View>
              <TouchableOpacity onPress={() => remove(c.code)} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
