import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analyticsService';
import { useAuthStore } from '@/store/auth.store';
import { AnalyticsPeriod, PaymentAnalyticsParams } from '@/types';

export const usePaymentAnalytics = (params: PaymentAnalyticsParams = {}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['analytics', 'payment', params],
    queryFn: () => analyticsService.getPaymentAnalytics(params),
    enabled: isAuthenticated,
  });
};

export const useOrderReport = (period: AnalyticsPeriod) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['analytics', 'order-report', period],
    queryFn: () => analyticsService.getOrderReport(period),
    enabled: isAuthenticated,
  });
};

export const useSalesReport = (period: AnalyticsPeriod) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['analytics', 'sales-report', period],
    queryFn: () => analyticsService.getSalesReport(period),
    enabled: isAuthenticated,
  });
};
