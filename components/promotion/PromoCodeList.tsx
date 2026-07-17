import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCoupons, useDeleteCoupon } from '@/hooks/usePromotion';
import { Coupon } from '@/types';

const statusColor = (status?: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
    case 'Expired':
      return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300';
    default:
      return 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300';
  }
};

export const PromoCodeList: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const { data: coupons = [], isLoading } = useCoupons(search);
  const deleteCoupon = useDeleteCoupon();

  const confirmDelete = (coupon: Coupon) => {
    Alert.alert('Delete Coupon', `Delete "${coupon.code}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteCoupon.mutate(coupon.id),
      },
    ]);
  };

  return (
    <View className="px-4 py-5 gap-4">
      {/* Search + add */}
      <View className="flex-row items-center gap-3">
        <View className="flex-1 flex-row items-center px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by code"
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-2 text-gray-900 dark:text-white"
            style={{ padding: 0, fontSize: 15 }}
          />
        </View>
        <TouchableOpacity
          onPress={() => router.push('/promotion/coupon-form')}
          className="flex-row items-center px-3 py-2.5 rounded-xl bg-primary-600"
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={18} color="#FFF" />
          <Text className="text-white font-semibold text-sm ml-1">New</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View className="items-center py-16">
          <ActivityIndicator size="large" color="#6FA25F" />
        </View>
      ) : coupons.length === 0 ? (
        <View className="items-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
          <Ionicons name="pricetag-outline" size={32} color="#9CA3AF" />
          <Text className="text-gray-500 dark:text-gray-400 mt-2">
            No coupons found.
          </Text>
        </View>
      ) : (
        coupons.map((coupon) => (
          <TouchableOpacity
            key={coupon.id}
            activeOpacity={0.7}
            onPress={() =>
              router.push({
                pathname: '/promotion/coupon-form',
                params: { id: String(coupon.id) },
              })
            }
            className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Text className="text-base font-bold text-gray-900 dark:text-white">
                    {coupon.code}
                  </Text>
                  <View className={`px-2 py-0.5 rounded-full ${statusColor(coupon.status)}`}>
                    <Text className={`text-[10px] font-semibold ${statusColor(coupon.status)}`}>
                      {coupon.status || '—'}
                    </Text>
                  </View>
                </View>
                <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {coupon.description}
                </Text>
                <Text className="text-xs text-gray-400 dark:text-gray-500 mt-1 capitalize">
                  {coupon.type} ·{' '}
                  {coupon.percentage
                    ? `${coupon.amount}% off`
                    : `${coupon.amount} AED off`}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => confirmDelete(coupon)}
                hitSlop={8}
                className="ml-2"
              >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};
