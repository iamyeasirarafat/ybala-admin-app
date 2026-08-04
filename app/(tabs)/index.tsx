import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { OrderReport, PaymentReport, SalesReport } from '@/components/dashboard';
import { useProfile } from '@/hooks/useProfile';

export default function DashboardScreen() {
  const { data: profile, refetch: refetchProfile } = useProfile();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const name = profile?.full_name || profile?.email || 'Admin';

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Refetch all analytics queries plus the profile
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['analytics'] }),
        refetchProfile(),
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <Screen scroll refreshing={refreshing} onRefresh={handleRefresh}>
      <View className="px-4 py-4 gap-5">
        {/* Header */}
        <View>
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {name}
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track and manage your orders & users from the dashboard
          </Text>
        </View>

        <PaymentReport />
        <OrderReport />
        <SalesReport />
      </View>
    </Screen>
  );
}
