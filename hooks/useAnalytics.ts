import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analyticsService';
import { useAuthStore } from '@/store/auth.store';
import {
  AnalyticsPeriod,
  PaymentAnalyticsParams,
  TopProductsParams,
} from '@/types';

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

export const useUserReport = (period: AnalyticsPeriod) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['analytics', 'user-report', period],
    queryFn: () => analyticsService.getUserReport(period),
    enabled: isAuthenticated,
  });
};

export const useUniqueVisitorReport = (period: AnalyticsPeriod) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['analytics', 'unique-visitor-report', period],
    queryFn: () => analyticsService.getUniqueVisitorReport(period),
    enabled: isAuthenticated,
  });
};

export const useTopSellingProducts = (params: TopProductsParams) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['analytics', 'top-selling', params],
    queryFn: () => analyticsService.getTopSellingProducts(params),
    enabled: isAuthenticated,
    placeholderData: keepPreviousData,
  });
};

export const useTopWishlistedProducts = (params: TopProductsParams) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['analytics', 'top-wishlisted', params],
    queryFn: () => analyticsService.getTopWishlistedProducts(params),
    enabled: isAuthenticated,
    placeholderData: keepPreviousData,
  });
};
