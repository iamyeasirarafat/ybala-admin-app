import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useAssignments, useDeliveryStats } from '@/hooks/useDelivery';
import { formatCurrency } from '@/utils/format';
import { assignmentMeta, formatTimestamp } from './deliveryStatus';

const Tile = ({ label, value }: { label: string; value: number | string }) => (
  <View className="flex-1 items-center py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
    <Text className="text-xl font-bold text-gray-900 dark:text-white">
      {value}
    </Text>
    <Text className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
      {label}
    </Text>
  </View>
);

/**
 * What this rider has actually delivered — the counts from
 * `/delivery/stats/<id>/` plus their most recent assignments, each linking
 * back to the order it belongs to.
 */
export const DeliveryManStats: React.FC<{ deliveryManId: number }> = ({
  deliveryManId,
}) => {
  const router = useRouter();
  const { data: stats, isLoading } = useDeliveryStats(deliveryManId);
  const { data: assignments = [] } = useAssignments({
    delivery_man: deliveryManId,
    limit: 10,
  });

  return (
    <View className="gap-4 mt-2">
      <View className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <Text className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-3">
          Deliveries Completed
        </Text>
        {isLoading ? (
          <ActivityIndicator size="small" color="#6FA25F" className="py-2" />
        ) : (
          <View className="flex-row gap-3">
            <Tile label="Today" value={stats?.today ?? 0} />
            <Tile label="This Month" value={stats?.this_month ?? 0} />
            <Tile label="All Time" value={stats?.all_time ?? 0} />
          </View>
        )}
      </View>

      <View className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <Text className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-2">
          Recent Deliveries
        </Text>
        {assignments.length === 0 ? (
          <Text className="text-sm text-gray-500 dark:text-gray-400 py-2">
            No deliveries yet.
          </Text>
        ) : (
          assignments.map((item) => {
            const meta = assignmentMeta(item.status);
            const total = item.order_data?.total_price;
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.7}
                onPress={() =>
                  router.push({
                    pathname: '/orders/order-detail',
                    params: { id: String(item.order) },
                  })
                }
                className="flex-row items-center py-2.5 border-b border-gray-50 dark:border-gray-700/50"
              >
                <View className="flex-1 pr-3">
                  <Text className="text-sm font-medium text-gray-900 dark:text-white">
                    Order #{item.order}
                    {item.order_data?.full_name
                      ? ` · ${item.order_data.full_name}`
                      : ''}
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {formatTimestamp(item.delivered_at || item.assigned_at)}
                    {total ? ` · ${formatCurrency(Number(total))}` : ''}
                  </Text>
                </View>
                <View className={`px-2 py-0.5 rounded-full ${meta.bg}`}>
                  <Text className={`text-[10px] font-semibold ${meta.text}`}>
                    {meta.label}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color="#9CA3AF"
                  style={{ marginLeft: 4 }}
                />
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </View>
  );
};
