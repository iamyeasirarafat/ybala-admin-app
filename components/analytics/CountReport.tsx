import { ActivityIndicator, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useColorScheme } from 'nativewind';
import {
  CHART_STYLE,
  CHART_WIDTH,
  getBarChartConfig,
} from '@/components/dashboard/chartConfig';
import { PeriodTabs } from '@/components/dashboard/PeriodTabs';
import { ReportCard } from '@/components/dashboard/ReportCard';
import { AnalyticsPeriod } from '@/types';

interface CountReportProps {
  title: string;
  period: AnalyticsPeriod;
  onPeriodChange: (period: AnalyticsPeriod) => void;
  data?: Record<string, number>;
  isLoading: boolean;
  color?: string;
}

export const CountReport: React.FC<CountReportProps> = ({
  title,
  period,
  onPeriodChange,
  data,
  isLoading,
  color = '#6FA25F',
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const labels = data ? Object.keys(data) : [];
  const values = labels.map((key) => Number(data?.[key] || 0));

  return (
    <ReportCard title={title}>
      <View className="mb-4">
        <PeriodTabs value={period} onChange={onPeriodChange} />
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
          <BarChart
            data={{
              labels: labels.map((l) => l.toUpperCase()),
              datasets: [{ data: values }],
            }}
            width={CHART_WIDTH}
            height={230}
            fromZero
            yAxisLabel=""
            yAxisSuffix=""
            withInnerLines={false}
            chartConfig={getBarChartConfig(isDark, color)}
            style={CHART_STYLE}
          />
        </View>
      )}
    </ReportCard>
  );
};
