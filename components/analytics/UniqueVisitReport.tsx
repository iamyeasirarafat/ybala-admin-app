import { useState } from 'react';
import { useUniqueVisitorReport } from '@/hooks/useAnalytics';
import { AnalyticsPeriod } from '@/types';
import { CountReport } from './CountReport';

export const UniqueVisitReport: React.FC = () => {
  const [period, setPeriod] = useState<AnalyticsPeriod>('12_months');
  const { data, isLoading } = useUniqueVisitorReport(period);

  return (
    <CountReport
      title="Unique Visit Report"
      period={period}
      onPeriodChange={setPeriod}
      data={data}
      isLoading={isLoading}
      color="#F38744"
    />
  );
};
