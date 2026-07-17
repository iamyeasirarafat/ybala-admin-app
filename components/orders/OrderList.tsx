import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useOrders } from '@/hooks/useOrder';
import { useAuthStore } from '@/store/auth.store';
import { Order, OrderRole } from '@/types';
import { formatCurrency } from '@/utils/format';
import { OrderStatusBadge } from './OrderStatusBadge';
import { STATUS_FILTER_TABS } from './orderStatus';

const PAGE_SIZE = 15;

const formatDate = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

interface OrderRowProps {
  item: Order;
  onPress: (id: number) => void;
}

const OrderRow = React.memo(({ item, onPress }: OrderRowProps) => {
  const name = `${item.first_name ?? ''} ${item.last_name ?? ''}`.trim();
  const items = item.carts?.length ?? 0;
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress(item.id)}
      className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 mb-3"
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-bold text-gray-900 dark:text-white">
          #{item.id}
        </Text>
        <OrderStatusBadge status={item.status} />
      </View>

      <View className="flex-row items-center justify-between mt-2">
        <View className="flex-1 pr-3">
          <Text
            className="text-sm font-semibold text-gray-800 dark:text-gray-100"
            numberOfLines={1}
          >
            {name || 'Guest'}
          </Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {formatDate(item.created_at)} · {items} item{items === 1 ? '' : 's'}
          </Text>
        </View>
        <Text className="text-base font-bold text-primary-600 dark:text-primary-400">
          {formatCurrency(Number(item.price ?? item.total_price ?? 0))}
        </Text>
      </View>

      <View className="flex-row items-center mt-2">
        <Ionicons
          name={item.is_pickup ? 'storefront-outline' : 'bicycle-outline'}
          size={14}
          color="#9CA3AF"
        />
        <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
          {item.is_pickup
            ? `Pickup${item.branch_info?.en_title ? ` · ${item.branch_info.en_title}` : ''}`
            : 'Delivery'}
        </Text>
      </View>
    </TouchableOpacity>
  );
});
OrderRow.displayName = 'OrderRow';

export const OrderList: React.FC = () => {
  const router = useRouter();
  const userType = useAuthStore((s) => s.userType);
  const role: OrderRole = userType === 'manager' ? 'manager' : 'admin';

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [limit, setLimit] = useState(PAGE_SIZE);

  const { data, isLoading, isFetching } = useOrders({
    role,
    status,
    search,
    limit,
    page: 1,
  });

  const orders = data?.results ?? [];
  const total = data?.count ?? 0;
  const canLoadMore = orders.length < total;

  const resetPage = () => setLimit(PAGE_SIZE);

  const onPress = useCallback(
    (id: number) =>
      router.push({
        pathname: '/orders/order-detail',
        params: { id: String(id) },
      }),
    [router],
  );

  const loadMore = useCallback(() => {
    if (canLoadMore && !isFetching) setLimit((l) => l + PAGE_SIZE);
  }, [canLoadMore, isFetching]);

  const renderItem = useCallback(
    ({ item }: { item: Order }) => <OrderRow item={item} onPress={onPress} />,
    [onPress],
  );

  const header = useMemo(
    () => (
      <View className="gap-4 pb-3">
        <View className="flex-row items-center gap-3">
          <View className="flex-1 flex-row items-center px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
            <Ionicons name="search" size={18} color="#9CA3AF" />
            <TextInput
              value={search}
              onChangeText={(v) => {
                setSearch(v);
                resetPage();
              }}
              placeholder="Search by id, name, email, phone"
              placeholderTextColor="#9CA3AF"
              className="flex-1 ml-2 text-gray-900 dark:text-white"
              style={{ padding: 0, fontSize: 15 }}
            />
          </View>
          <TouchableOpacity
            onPress={() => router.push('/orders/order-form')}
            className="flex-row items-center px-3 py-2.5 rounded-xl bg-primary-600"
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={18} color="#FFF" />
            <Text className="text-white font-semibold text-sm ml-1">New</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          data={STATUS_FILTER_TABS}
          keyExtractor={(t) => t.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item: tab }) => {
            const active = status === tab.key;
            return (
              <TouchableOpacity
                onPress={() => {
                  setStatus(tab.key);
                  resetPage();
                }}
                className={`px-4 py-2 rounded-full ${
                  active
                    ? 'bg-primary-600'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}
                activeOpacity={0.8}
              >
                <Text
                  className={`text-xs font-semibold ${
                    active
                      ? 'text-white'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    ),
    [search, status, router],
  );

  const footer = useMemo(() => {
    if (isLoading || !canLoadMore) return null;
    return (
      <TouchableOpacity
        onPress={loadMore}
        disabled={isFetching}
        className="flex-row items-center justify-center py-3"
        activeOpacity={0.7}
      >
        {isFetching ? (
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
  }, [isLoading, canLoadMore, isFetching, loadMore]);

  const empty = useMemo(() => {
    if (isLoading) {
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
  }, [isLoading]);

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      ListHeaderComponent={header}
      ListFooterComponent={footer}
      ListEmptyComponent={empty}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20 }}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
      onEndReachedThreshold={0.4}
      onEndReached={loadMore}
      removeClippedSubviews
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={7}
    />
  );
};
