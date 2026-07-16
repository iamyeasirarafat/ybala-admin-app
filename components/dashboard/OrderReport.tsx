import { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useColorScheme } from 'nativewind';
import { useOrderReport } from '@/hooks/useAnalytics';
import { AnalyticsPeriod } from '@/types';
import { CHART_STYLE, CHART_WIDTH, getLineChartConfig } from './chartConfig';
import { PeriodTabs } from './PeriodTabs';
import { ReportCard } from './ReportCard';

export const OrderReport: React.FC = () => {
  const [period, setPeriod] = useState<AnalyticsPeriod>('12_months');
  const { data, isLoading } = useOrderReport(period);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const labels = data ? Object.keys(data) : [];
  const customerData = labels.map((key) => Number(data?.[key]?.customer_orders || 0));
  const guestData = labels.map((key) => Number(data?.[key]?.guest_orders || 0));

  return (
    <ReportCard title="Order Report">
      <View className="mb-4">
        <PeriodTabs value={period} onChange={setPeriod} />
      </View>

      {isLoading || !data ? (
        <View className="h-52 items-center justify-center">
          <ActivityIndicator color="#6FA25F" />
        </View>
      ) : labels.length === 0 ? (
        <View className="h-52 items-center justify-center">
          <Text className="text-gray-400">No data available</Text>
        </View>
      ) : (
        <View className="-mx-2">
          <LineChart
            data={{
              labels: labels.map((l) => l.toUpperCase()),
              datasets: [
                { data: customerData, color: () => '#6FA25F', strokeWidth: 2 },
                { data: guestData, color: () => '#F38744', strokeWidth: 2 },
              ],
              legend: ['Customer', 'Guest'],
            }}
            width={CHART_WIDTH}
            height={230}
            bezier
            chartConfig={getLineChartConfig(isDark)}
            style={CHART_STYLE}
          />
        </View>
      )}
    </ReportCard>
  );
};
