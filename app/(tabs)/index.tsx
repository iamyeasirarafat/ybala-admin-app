import { Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { OrderReport, PaymentReport, SalesReport } from '@/components/dashboard';
import { useProfile } from '@/hooks/useProfile';

export default function DashboardScreen() {
  const { data: profile } = useProfile();

  const name =
    profile?.first_name && profile?.last_name
      ? `${profile.first_name} ${profile.last_name}`
      : profile?.first_name || profile?.email || 'Admin';

  return (
    <Screen scroll>
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
