import { Screen } from '@/components/Screen';
import {
  FoodReport,
  UniqueVisitReport,
  UserReport,
  WishlistReport,
} from '@/components/analytics';
import { OrderReport, PaymentReport, SalesReport } from '@/components/dashboard';
import { useAuthStore } from '@/store/auth.store';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Text, View } from 'react-native';

export default function AnalyticsScreen() {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const isManager = useAuthStore((s) => s.userType === 'manager');

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Refetch every analytics query so the numbers reflect the latest data
      await queryClient.refetchQueries({ queryKey: ['analytics'] });
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <Screen scroll refreshing={refreshing} onRefresh={handleRefresh}>
      <View className="px-4 py-4 gap-5">
        <View>
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track and measure your sales and customers
          </Text>
        </View>

        {/* Sales analytics */}
        <PaymentReport />
        <SalesReport />
        <OrderReport />
        <FoodReport />

        {/* Customer analytics — admin only */}
        {!isManager && (
          <>
            <WishlistReport />
            <UserReport />
            <UniqueVisitReport />
          </>
        )}
      </View>
    </Screen>
  );
}
