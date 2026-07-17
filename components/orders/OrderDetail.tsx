import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SingleSelectField } from '@/components/menu/SingleSelectField';
import {
  useAssignStoreLocation,
  useDeleteOrder,
  useOrder,
  useUpdateOrderStatus,
} from '@/hooks/useOrder';
import { useStoreLocations } from '@/hooks/useSettings';
import { useAuthStore } from '@/store/auth.store';
import { CartLine, OrderStatus, ShippingAddress } from '@/types';
import { formatCurrency } from '@/utils/format';
import { OrderStatusBadge } from './OrderStatusBadge';
import { STATUS_ACTIONS, STATUS_META } from './orderStatus';

const Row = ({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
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
          : 'text-gray-700 dark:text-gray-200'
      }`}
    >
      {value}
    </Text>
  </View>
);

const Card = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 gap-1">
    <Text className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">
      {title}
    </Text>
    {children}
  </View>
);

export const OrderDetail: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const orderId = id ? Number(id) : undefined;
  const userType = useAuthStore((s) => s.userType);

  const { data: order, isLoading } = useOrder(orderId);
  const updateStatus = useUpdateOrderStatus();
  const deleteOrder = useDeleteOrder();
  const assignStore = useAssignStoreLocation();
  const { data: storeLocations = [] } = useStoreLocations();

  const [statusModal, setStatusModal] = useState(false);

  if (isLoading || !order) {
    return (
      <View className="flex-1 items-center justify-center py-16">
        <ActivityIndicator size="large" color="#6FA25F" />
      </View>
    );
  }

  const name = `${order.first_name ?? ''} ${order.last_name ?? ''}`.trim();
  const address = order.shipping_address as ShippingAddress | undefined;
  const carts: CartLine[] = order.carts ?? [];
  const discount = Number(order.discount_price ?? 0);
  const vat = Number(order.vat ?? 0);
  const delivery = Number(order.delivery_charge ?? 0);

  const changeStatus = (status: OrderStatus) => {
    setStatusModal(false);
    if (status === order.status) return;
    updateStatus.mutate({ id: order.id, status });
  };

  const confirmDelete = () => {
    Alert.alert('Delete Order', `Delete order #${order.id}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          deleteOrder.mutate(order.id, { onSuccess: () => router.back() }),
      },
    ]);
  };

  const storeOptions = storeLocations.map((s) => ({
    id: s.id,
    name: s.en_title || `Store #${s.id}`,
  }));

  const isAdmin = userType === 'admin';

  return (
    <View className="px-4 py-5 gap-4">
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          Order #{order.id}
        </Text>
        <OrderStatusBadge status={order.status} size="md" />
      </View>

      {/* Customer */}
      <Card title="Customer">
        <Text className="text-base font-semibold text-gray-900 dark:text-white">
          {name || 'Guest'}
        </Text>
        {!!order.customer_phone && (
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            {order.customer_phone}
          </Text>
        )}
        {!!order.customer_email && (
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            {order.customer_email}
          </Text>
        )}
      </Card>

      {/* Delivery / Pickup */}
      <Card title={order.is_pickup ? 'Pickup' : 'Delivery Address'}>
        {order.is_pickup ? (
          <Text className="text-sm text-gray-700 dark:text-gray-200">
            {order.branch_info?.en_title || 'Store pickup'}
          </Text>
        ) : (
          <Text className="text-sm text-gray-700 dark:text-gray-200">
            {[address?.street, address?.city, address?.zip]
              .filter(Boolean)
              .join(', ') || '—'}
          </Text>
        )}
        {!!order.delivery_note && (
          <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Note: {order.delivery_note}
          </Text>
        )}
      </Card>

      {/* Items */}
      <Card title={`Items (${carts.length})`}>
        {carts.map((line) => {
          const menuName =
            line.menu_data?.translations?.en?.name || `Item #${line.menu}`;
          const variant =
            line.variant && typeof line.variant === 'object'
              ? (line.variant as { name?: string }).name
              : undefined;
          const lineTotal = Number(line.price) * line.quantity;
          return (
            <View
              key={line.id}
              className="flex-row items-center justify-between py-2 border-b border-gray-50 dark:border-gray-700/50"
            >
              <View className="flex-1 pr-3">
                <Text className="text-sm font-medium text-gray-900 dark:text-white">
                  {menuName}
                  {variant ? ` · ${variant}` : ''}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  {formatCurrency(Number(line.price))} × {line.quantity}
                </Text>
              </View>
              <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                {formatCurrency(lineTotal)}
              </Text>
            </View>
          );
        })}
      </Card>

      {/* Totals */}
      <Card title="Summary">
        <Row
          label="Subtotal"
          value={formatCurrency(Number(order.total_price ?? 0))}
        />
        {vat > 0 && <Row label="VAT" value={formatCurrency(vat)} />}
        {!order.is_pickup && (
          <Row label="Delivery" value={formatCurrency(delivery)} />
        )}
        {discount > 0 && (
          <Row label="Discount" value={`- ${formatCurrency(discount)}`} />
        )}
        <View className="h-px bg-gray-100 dark:bg-gray-700 my-1" />
        <Row label="Total" value={formatCurrency(Number(order.price ?? 0))} bold />
        <Text className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {order.payment_method === 'stripe'
            ? 'Card (Stripe)'
            : 'Cash on delivery'}
        </Text>
      </Card>

      {/* Admin: assign store location (pending only) */}
      {isAdmin && order.status === 'pending' && (
        <Card title="Assign Store Location">
          <SingleSelectField
            label=""
            options={storeOptions}
            value={order.store_location ?? null}
            onChange={(storeId) =>
              storeId && assignStore.mutate({ id: order.id, storeId })
            }
            placeholder="Select a store"
          />
        </Card>
      )}

      {/* Actions */}
      <TouchableOpacity
        onPress={() => setStatusModal(true)}
        className="flex-row items-center justify-center py-3.5 rounded-xl bg-primary-600"
        activeOpacity={0.85}
      >
        <Ionicons name="sync-outline" size={18} color="#FFF" />
        <Text className="text-white font-semibold text-base ml-2">
          Update Status
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={confirmDelete}
        className="flex-row items-center justify-center py-3.5 rounded-xl border border-red-200 dark:border-red-900"
        activeOpacity={0.85}
      >
        <Ionicons name="trash-outline" size={18} color="#EF4444" />
        <Text className="text-red-500 font-semibold text-base ml-2">
          Delete Order
        </Text>
      </TouchableOpacity>

      {/* Status picker modal */}
      <Modal
        visible={statusModal}
        transparent
        animationType="slide"
        onRequestClose={() => setStatusModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white dark:bg-gray-800 rounded-t-3xl pb-8">
            <View className="flex-row justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
              <Text className="text-lg font-bold text-gray-900 dark:text-white">
                Update Status
              </Text>
              <TouchableOpacity onPress={() => setStatusModal(false)}>
                <Ionicons name="close" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            <View className="p-4 gap-2">
              {STATUS_ACTIONS.map((s) => {
                const meta = STATUS_META[s];
                const active = order.status === s;
                return (
                  <TouchableOpacity
                    key={s}
                    onPress={() => changeStatus(s)}
                    className={`flex-row items-center justify-between px-4 py-3 rounded-xl border ${
                      active
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-100 dark:border-gray-700'
                    }`}
                    activeOpacity={0.8}
                  >
                    <View className="flex-row items-center">
                      <View
                        className="w-2.5 h-2.5 rounded-full mr-3"
                        style={{ backgroundColor: meta.dot }}
                      />
                      <Text className="text-base text-gray-900 dark:text-white">
                        {meta.label}
                      </Text>
                    </View>
                    {active && (
                      <Ionicons name="checkmark" size={20} color="#6FA25F" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
