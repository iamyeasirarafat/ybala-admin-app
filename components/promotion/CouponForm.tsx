import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { ComplexCouponFields } from '@/components/promotion/ComplexCouponFields';
import { DateField } from '@/components/promotion/DateField';
import { SectionHeading } from '@/components/settings/SectionHeading';
import { Button, Input } from '@/components/ui';
import { useCoupon, useSaveCoupon } from '@/hooks/usePromotion';
import { CouponMethod, CouponPayload, CouponType } from '@/types';
import { toast } from '@/utils/toast';

const num = (v: string): number | null => {
  if (v === '' || v == null) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};

export const CouponForm: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const couponId = id ? Number(id) : undefined;

  const { data: coupon, isLoading } = useCoupon(couponId);
  const saveCoupon = useSaveCoupon();

  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState<CouponType | ''>('');
  const [percentage, setPercentage] = useState<boolean | null>(null);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<CouponMethod | ''>('');
  const [customers, setCustomers] = useState<number[]>([]);
  const [categories, setCategories] = useState<number[]>([]);
  const [menus, setMenus] = useState<number[]>([]);
  const [minAmount, setMinAmount] = useState('');
  const [midPrice, setMidPrice] = useState('');
  const [midDiscount, setMidDiscount] = useState('');

  useEffect(() => {
    if (!coupon) return;
    setCode(coupon.code || '');
    setDescription(coupon.description || '');
    setStartDate(coupon.start_date || '');
    setEndDate(coupon.end_date || '');
    setType(coupon.type || '');
    setPercentage(
      typeof coupon.percentage === 'boolean' ? coupon.percentage : null,
    );
    setAmount(coupon.amount != null ? String(coupon.amount) : '');
    setMethod((coupon.method as CouponMethod) || '');
    setCustomers(coupon.customers?.map((c) => c.id) || []);
    setCategories(coupon.category?.map((c) => c.id) || []);
    setMenus(coupon.menu?.map((m) => m.id) || []);
    setMinAmount(coupon.min_amount != null ? String(coupon.min_amount) : '');
    setMidPrice(coupon.mid_price != null ? String(coupon.mid_price) : '');
    setMidDiscount(
      coupon.mid_discount != null ? String(coupon.mid_discount) : '',
    );
  }, [coupon]);

  const onComplexChange = (
    key: 'customers' | 'category' | 'menu',
    ids: number[],
  ) => {
    if (key === 'customers') setCustomers(ids);
    else if (key === 'category') setCategories(ids);
    else setMenus(ids);
  };

  const handleSave = async () => {
    // Validation mirrors yabala-fe CouponForm
    if (!code.trim()) return toast.error('Coupon code is required.');
    if (!description.trim()) return toast.error('Description is required.');
    if (!startDate) return toast.error('Start date is required.');
    if (!endDate) return toast.error('End date is required.');
    if (!type) return toast.error('Coupon type is required.');
    if (percentage === null) return toast.error('Discount type is required.');
    if (!amount) return toast.error('Discount amount is required.');

    const midP = num(midPrice);
    const midD = num(midDiscount);
    if ((midP === null) !== (midD === null)) {
      return toast.error('Mid amount and mid discount must both be set.');
    }

    const payload: CouponPayload = {
      code: code.trim(),
      description: description.trim(),
      amount: Number(amount) || 0,
      percentage,
      start_date: startDate,
      end_date: endDate,
      type,
    };

    if (type === 'complex') {
      if (method) payload.method = method;
      payload.customers = customers;
      payload.category = categories;
      payload.menu = menus;
      payload.min_amount = num(minAmount);
      payload.mid_price = midP;
      payload.mid_discount = midD;
    }

    try {
      await saveCoupon.mutateAsync({ id: couponId, payload });
      router.back();
    } catch {
      // handled by hook onError
    }
  };

  if (couponId && isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-16">
        <ActivityIndicator size="large" color="#6FA25F" />
      </View>
    );
  }

  return (
    <View className="px-4 py-5 gap-5">
      <SectionHeading title={couponId ? 'Edit Coupon' : 'New Coupon'} />

      <Input
        label="Coupon Code"
        value={code}
        onChangeText={setCode}
        placeholder="FLASH120"
        autoCapitalize="characters"
      />
      <Input
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="Discount 120 AED"
      />

      <View className="flex-row gap-3">
        <View className="flex-1">
          <DateField label="Start From" value={startDate} onChange={setStartDate} />
        </View>
        <View className="flex-1">
          <DateField label="End To" value={endDate} onChange={setEndDate} />
        </View>
      </View>

      {/* Coupon type */}
      <View>
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Coupon Type
        </Text>
        <View className="flex-row bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {(['simple', 'complex'] as CouponType[]).map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setType(t)}
              className={`flex-1 py-2 rounded-lg items-center ${
                type === t ? 'bg-white dark:bg-gray-700' : ''
              }`}
              activeOpacity={0.8}
            >
              <Text
                className={`text-sm font-semibold capitalize ${
                  type === t
                    ? 'text-primary-600 dark:text-primary-300'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {type === 'complex' && (
        <ComplexCouponFields
          method={method}
          onMethodChange={setMethod}
          customers={customers}
          categories={categories}
          menus={menus}
          onChange={onComplexChange}
          minAmount={minAmount}
          onMinAmountChange={setMinAmount}
        />
      )}

      {/* Discount type */}
      <View>
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Discount Type
        </Text>
        <View className="flex-row bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {[
            { label: 'Percentage', value: true },
            { label: 'Flat', value: false },
          ].map((opt) => (
            <TouchableOpacity
              key={opt.label}
              onPress={() => setPercentage(opt.value)}
              className={`flex-1 py-2 rounded-lg items-center ${
                percentage === opt.value ? 'bg-white dark:bg-gray-700' : ''
              }`}
              activeOpacity={0.8}
            >
              <Text
                className={`text-sm font-semibold ${
                  percentage === opt.value
                    ? 'text-primary-600 dark:text-primary-300'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Input
        label="Discount Amount"
        value={amount}
        onChangeText={setAmount}
        placeholder="Discount amount"
        keyboardType="numeric"
      />

      {type === 'complex' && (
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Input
              label="Mid Amount"
              value={midPrice}
              onChangeText={setMidPrice}
              placeholder="Mid amount"
              keyboardType="numeric"
            />
          </View>
          <View className="flex-1">
            <Input
              label="Mid Discount"
              value={midDiscount}
              onChangeText={setMidDiscount}
              placeholder="Mid discount"
              keyboardType="numeric"
            />
          </View>
        </View>
      )}

      <Button onPress={handleSave} loading={saveCoupon.isPending}>
        <Text className="text-white font-semibold text-base">
          {couponId ? 'Update' : 'Create'}
        </Text>
      </Button>
    </View>
  );
};
