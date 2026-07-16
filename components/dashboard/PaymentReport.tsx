import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { usePaymentAnalytics } from '@/hooks/useAnalytics';
import { formatCurrency } from '@/utils/format';
import { DateRangeSelector } from './DateRangeSelector';
import { ReportCard } from './ReportCard';
import { StatCard } from './StatCard';

export const PaymentReport: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data, isLoading } = usePaymentAnalytics({
    ...(startDate ? { start_date: startDate } : {}),
    ...(endDate ? { end_date: endDate } : {}),
  });

  return (
    <ReportCard title="Payment Overview">
      <View className="mb-4">
        <DateRangeSelector
          startDate={startDate}
          endDate={endDate}
          onChange={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
        />
      </View>

      {isLoading || !data ? (
        <View className="h-40 items-center justify-center">
          <ActivityIndicator color="#6FA25F" />
        </View>
      ) : (
        <View className="flex-row flex-wrap gap-3">
          <StatCard label="Total Orders" value={data.total_orders ?? 0} icon="receipt-outline" />
          <StatCard
            label="Completed Orders"
            value={data.completed_orders ?? 0}
            icon="checkmark-done-outline"
          />
          <StatCard
            label="Total Sales"
            value={formatCurrency(data.total_sales_price ?? 0)}
            icon="cash-outline"
          />
          <StatCard
            label="Total Discount"
            value={formatCurrency(data.total_discount_price ?? 0)}
            icon="pricetag-outline"
          />
          <StatCard
            label="Delivery Charge"
            value={formatCurrency(data.total_delivery_charge ?? 0)}
            icon="bicycle-outline"
          />
          <StatCard
            label="Total Price"
            value={formatCurrency(data.total_price ?? 0)}
            icon="wallet-outline"
          />
        </View>
      )}
    </ReportCard>
  );
};
