import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analyticsService';
import { useAnalyticsFilterStore } from '@/store/analyticsFilter.store';
import { useAuthStore } from '@/store/auth.store';
import {
  AnalyticsPeriod,
  BranchFilterParams,
  PaymentAnalyticsParams,
  TopProductsParams,
} from '@/types';

/**
 * Current branch scope as request params.
 *
 * Returned as an object (empty for "All branches") so it can be both spread
 * into the request and folded into the query key — the key must include it, or
 * switching branches would serve the previous branch's cached numbers.
 */
const useBranchFilter = (): BranchFilterParams => {
  const branchId = useAnalyticsFilterStore((s) => s.branchId);
  return branchId == null ? {} : { branch_id: branchId };
};

export const usePaymentAnalytics = (params: PaymentAnalyticsParams = {}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const branch = useBranchFilter();

  return useQuery({
    queryKey: ['analytics', 'payment', params, branch],
    queryFn: () => analyticsService.getPaymentAnalytics(params, branch),
    enabled: isAuthenticated,
  });
};

export const useOrderReport = (period: AnalyticsPeriod) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const branch = useBranchFilter();

  return useQuery({
    queryKey: ['analytics', 'order-report', period, branch],
    queryFn: () => analyticsService.getOrderReport(period, branch),
    enabled: isAuthenticated,
  });
};

export const useSalesReport = (period: AnalyticsPeriod) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const branch = useBranchFilter();

  return useQuery({
    queryKey: ['analytics', 'sales-report', period, branch],
    queryFn: () => analyticsService.getSalesReport(period, branch),
    enabled: isAuthenticated,
  });
};

export const useUserReport = (period: AnalyticsPeriod) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const branch = useBranchFilter();

  return useQuery({
    queryKey: ['analytics', 'user-report', period, branch],
    queryFn: () => analyticsService.getUserReport(period, branch),
    enabled: isAuthenticated,
  });
};

export const useUniqueVisitorReport = (period: AnalyticsPeriod) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const branch = useBranchFilter();

  return useQuery({
    queryKey: ['analytics', 'unique-visitor-report', period, branch],
    queryFn: () => analyticsService.getUniqueVisitorReport(period, branch),
    enabled: isAuthenticated,
  });
};

export const useTopSellingProducts = (params: TopProductsParams) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const branch = useBranchFilter();

  return useQuery({
    queryKey: ['analytics', 'top-selling', params, branch],
    queryFn: () => analyticsService.getTopSellingProducts(params, branch),
    enabled: isAuthenticated,
    placeholderData: keepPreviousData,
  });
};

export const useTopWishlistedProducts = (params: TopProductsParams) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const branch = useBranchFilter();

  return useQuery({
    queryKey: ['analytics', 'top-wishlisted', params, branch],
    queryFn: () => analyticsService.getTopWishlistedProducts(params, branch),
    enabled: isAuthenticated,
    placeholderData: keepPreviousData,
  });
};
