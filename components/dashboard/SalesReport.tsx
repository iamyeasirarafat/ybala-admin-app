import { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useColorScheme } from 'nativewind';
import { useSalesReport } from '@/hooks/useAnalytics';
import { AnalyticsPeriod } from '@/types';
import { CHART_STYLE, CHART_WIDTH, getLineChartConfig } from './chartConfig';
import { PeriodTabs } from './PeriodTabs';
import { ReportCard } from './ReportCard';

export const SalesReport: React.FC = () => {
  const [period, setPeriod] = useState<AnalyticsPeriod>('12_months');
  const { data, isLoading } = useSalesReport(period);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const labels = data ? Object.keys(data) : [];
  const salesData = labels.map((key) => Number(data?.[key]?.sales || 0));
  const canceledData = labels.map((key) => Number(data?.[key]?.canceled || 0));

  return (
    <ReportCard title="Sales Report">
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
                { data: salesData, color: () => '#6FA25F', strokeWidth: 2 },
                { data: canceledData, color: () => '#F38744', strokeWidth: 2 },
              ],
              legend: ['Completed', 'Canceled'],
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
