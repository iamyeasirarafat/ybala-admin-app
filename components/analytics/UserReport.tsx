import { useState } from 'react';
import { useUserReport } from '@/hooks/useAnalytics';
import { AnalyticsPeriod } from '@/types';
import { CountReport } from './CountReport';

export const UserReport: React.FC = () => {
  const [period, setPeriod] = useState<AnalyticsPeriod>('12_months');
  const { data, isLoading } = useUserReport(period);

  return (
    <CountReport
      title="User Report"
      period={period}
      onPeriodChange={setPeriod}
      data={data}
      isLoading={isLoading}
      color="#6FA25F"
    />
  );
};
