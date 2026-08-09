import { useOrders, useUpdateOrderStatus } from '@/hooks/useOrder';
import { useAuthStore } from '@/store/auth.store';
import { Order, OrderRole, OrderStatus } from '@/types';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { OrderListEmpty } from './OrderListEmpty';
import { OrderListFooter } from './OrderListFooter';
import { OrderListHeader } from './OrderListHeader';
import { OrderRow } from './OrderRow';
import { getOrderListTab, OrderListTab } from './orderStatus';
import { useOrderAlertSound } from './useOrderAlertSound';
import { useOrderReceiptPrinter } from './useOrderReceiptPrinter';

const PAGE_SIZE = 15;

export const OrderList: React.FC = () => {
  const router = useRouter();
  const userType = useAuthStore((s) => s.userType);
  const role: OrderRole = userType === 'manager' ? 'manager' : 'admin';

  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<OrderListTab>('new');
  const [limit, setLimit] = useState(PAGE_SIZE);

  const [refreshing, setRefreshing] = useState(false);

  // Status grouping (New/Ongoing/Completed) happens client-side below —
  // the API only supports filtering by a single exact status.
  const { data, isFetching, isLoading, refetch } = useOrders({
    role,
    status: 'all',
    search,
    limit,
    page: 1,
  });

  const updateStatus = useUpdateOrderStatus();

  const allOrders = useMemo(() => data?.results ?? [], [data?.results]);
  const total = data?.count ?? 0;
  const canLoadMore = allOrders.length < total;

  const orders = useMemo(
    () => allOrders.filter((o) => getOrderListTab(o.status) === tab),
    [allOrders, tab],
  );

  // True only before the very first successful fetch. `useOrders` keeps
  // previous data visible during every later fetch (background polling,
  // search changes, load-more), so gating on `isFetching` here made the
  // 5-second refetchInterval blank the whole list and show a spinner on
  // every poll — fighting the placeholderData that exists to prevent that.
  const isFilterLoading = isLoading;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const { stopAlert } = useOrderAlertSound(allOrders, data !== undefined, limit);
  const { print } = useOrderReceiptPrinter();

  const onPress = useCallback(
    (id: number) => {
      stopAlert();
      router.push({
        pathname: '/orders/order-detail',
        params: { id: String(id) },
      });
    },
    [router, stopAlert],
  );

  const loadMore = useCallback(() => {
    if (canLoadMore && !isFetching) setLimit((l) => l + PAGE_SIZE);
  }, [canLoadMore, isFetching]);

  const onAdvanceStatus = useCallback(
    (order: Order, next: OrderStatus) => {
      stopAlert();
      updateStatus.mutate(
        { id: order.id, status: next },
        {
          // Printed only after the server confirms the status change, and only
          // for Accept — a receipt for an order that failed to move out of
          // "New" would be handed to a customer for an order still unconfirmed.
          onSuccess: () => {
            if (next === 'processing') void print(order);
          },
        },
      );
    },
    [updateStatus, stopAlert, print],
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

  const onSearchChange = useCallback((value: string) => {
    setSearch(value);
    setLimit(PAGE_SIZE);
  }, []);

  const onCreatePress = useCallback(
    () => router.push('/orders/order-form'),
    [router],
  );

  const header = useMemo(
    () => (
      <OrderListHeader
        search={search}
        onSearchChange={onSearchChange}
        tab={tab}
        onTabChange={setTab}
        onCreatePress={onCreatePress}
      />
    ),
    [search, onSearchChange, tab, onCreatePress],
  );

  const footer = useMemo(
    () => (
      <OrderListFooter
        visible={!isFilterLoading && canLoadMore}
        loading={isFetching}
        onPress={loadMore}
      />
    ),
    [isFilterLoading, canLoadMore, isFetching, loadMore],
  );

  const empty = useMemo(
    () => <OrderListEmpty loading={isFilterLoading} />,
    [isFilterLoading],
  );

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
      removeClippedSubviews
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={7}
    />
  );
};
