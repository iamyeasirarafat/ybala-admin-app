import { useOrders, useUpdateOrderStatus } from '@/hooks/useOrder';
import { useAuthStore } from '@/store/auth.store';
import { Order, OrderRole, OrderStatus, ShippingAddress } from '@/types';
import { formatCurrency } from '@/utils/format';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { OrderStatusBadge } from './OrderStatusBadge';
import { STATUS_FILTER_TABS } from './orderStatus';

const PAGE_SIZE = 15;

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

const OrderRow = React.memo(
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
        className="p-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 mb-3"
      >
        <View className="flex-row items-start justify-between">
          <Text
            className="flex-1 text-base font-bold text-gray-900 dark:text-white pr-2"
            numberOfLines={1}
          >
            {name}
          </Text>
          <Text className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            Order Id #{item.id}
          </Text>
        </View>

        {!!item.customer_phone && (
          <Text className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {item.customer_phone}
          </Text>
        )}
        <Text
          className="text-sm text-gray-600 dark:text-gray-300"
          numberOfLines={1}
        >
          {formatAddress(item)}
        </Text>

        <View className="flex-row items-stretch mt-3">
          <View className="flex-1 rounded-xl bg-gray-50 dark:bg-gray-900/50 p-3 mr-3 justify-center">
            <Text
              className="text-sm text-gray-700 dark:text-gray-200"
              numberOfLines={2}
            >
              {formatItemsSummary(item)}
            </Text>
            <Text className="text-base font-bold text-gray-900 dark:text-white mt-1">
              {formatCurrency(Number(item.price ?? item.total_price ?? 0))}
            </Text>
          </View>

          <View className="justify-center gap-2">
            <TouchableOpacity
              onPress={() => onPress(item.id)}
              activeOpacity={0.8}
              className="p-2 rounded-lg bg-primary-600 items-center"
            >
              <Text className="text-xs font-bold text-white">See Details</Text>
            </TouchableOpacity>

            {nextAction ? (
              <TouchableOpacity
                onPress={() => onAdvanceStatus(item.id, nextAction.next)}
                activeOpacity={0.8}
                disabled={isUpdating}
                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 items-center "
              >
                {isUpdating ? (
                  <ActivityIndicator size="small" color="#6FA25F" />
                ) : (
                  <Text className="text-xs font-bold text-gray-900 dark:text-white">
                    {nextAction.label}
                  </Text>
                )}
              </TouchableOpacity>
            ) : (
              <View className="items-center">
                <OrderStatusBadge status={item.status} />
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);
OrderRow.displayName = 'OrderRow';

export const OrderList: React.FC = () => {
  const router = useRouter();
  const userType = useAuthStore((s) => s.userType);
  const role: OrderRole = userType === 'manager' ? 'manager' : 'admin';

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [limit, setLimit] = useState(PAGE_SIZE);

  const [refreshing, setRefreshing] = useState(false);

  const { data, isFetching, refetch } = useOrders({
    role,
    status,
    search,
    limit,
    page: 1,
  });

  const updateStatus = useUpdateOrderStatus();

  const orders = data?.results ?? [];
  const total = data?.count ?? 0;
  const canLoadMore = orders.length < total;

  // True while a fetch for the base page (initial load, or a status/search
  // change) is in flight — excludes "load more" (limit > PAGE_SIZE) and
  // pull-to-refresh, which have their own loading indicators.
  const isFilterLoading = isFetching && limit === PAGE_SIZE && !refreshing;

  const resetPage = () => setLimit(PAGE_SIZE);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

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

  const onAdvanceStatus = useCallback(
    (id: number, next: OrderStatus) => updateStatus.mutate({ id, status: next }),
    [updateStatus],
  );

  const renderItem = useCallback(
    ({ item }: { item: Order }) => (
      <OrderRow
        item={item}
        onPress={onPress}
        onAdvanceStatus={onAdvanceStatus}
        isUpdating={
          updateStatus.isPending && updateStatus.variables?.id === item.id
        }
      />
    ),
    [onPress, onAdvanceStatus, updateStatus.isPending, updateStatus.variables],
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
    if (isFilterLoading || !canLoadMore) return null;
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
  }, [isFilterLoading, canLoadMore, isFetching, loadMore]);

  const empty = useMemo(() => {
    if (isFilterLoading) {
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
  }, [isFilterLoading]);

  return (
    <FlatList
      data={isFilterLoading ? [] : orders}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      ListHeaderComponent={header}
      ListFooterComponent={footer}
      ListEmptyComponent={empty}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20 }}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#6FA25F"
          colors={['#6FA25F']}
        />
      }
      onEndReachedThreshold={0.4}
      onEndReached={loadMore}
      removeClippedSubviews
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={7}
    />
  );
};
