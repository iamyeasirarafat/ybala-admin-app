import { protectedApi } from './api';
import {
  AnalyticsPeriod,
  BranchFilterParams,
  OrderReport,
  Paginated,
  PaymentAnalytics,
  PaymentAnalyticsParams,
  SalesReport,
  TopProductsParams,
  TopSellingProduct,
  TopWishlistedProduct,
  UserReport,
  VisitorReport,
} from '@/types';

/**
 * Every endpoint takes an optional branch filter. It is spread in rather than
 * passed as `branch_id: value` so that "All branches" ({}) sends no parameter
 * at all, which is what the API treats as unscoped.
 */
export const analyticsService = {
  // GET /analytics/payment_analytics/?start_date=&end_date=&branch_id=
  getPaymentAnalytics: async (
    params: PaymentAnalyticsParams = {},
    branch: BranchFilterParams = {}
  ): Promise<PaymentAnalytics> => {
    const response = await protectedApi.get<PaymentAnalytics>(
      '/analytics/payment_analytics/',
      { params: { ...params, ...branch } }
    );
    return response.data;
  },

  // GET /analytics/order_report/?period=12_months|3_months|7_days&branch_id=
  getOrderReport: async (
    period: AnalyticsPeriod,
    branch: BranchFilterParams = {}
  ): Promise<OrderReport> => {
    const response = await protectedApi.get<OrderReport>('/analytics/order_report/', {
      params: { period, ...branch },
    });
    return response.data;
  },

  // GET /analytics/sales_report/?period=12_months|3_months|7_days&branch_id=
  getSalesReport: async (
    period: AnalyticsPeriod,
    branch: BranchFilterParams = {}
  ): Promise<SalesReport> => {
    const response = await protectedApi.get<SalesReport>('/analytics/sales_report/', {
      params: { period, ...branch },
    });
    return response.data;
  },

  // GET /analytics/user_report/?period=...&branch_id=  (new users per month/day)
  getUserReport: async (
    period: AnalyticsPeriod,
    branch: BranchFilterParams = {}
  ): Promise<UserReport> => {
    const response = await protectedApi.get<UserReport>('/analytics/user_report/', {
      params: { period, ...branch },
    });
    return response.data;
  },

  // GET /analytics/unique_visitor_report/?period=...&branch_id=
  getUniqueVisitorReport: async (
    period: AnalyticsPeriod,
    branch: BranchFilterParams = {}
  ): Promise<VisitorReport> => {
    const response = await protectedApi.get<VisitorReport>(
      '/analytics/unique_visitor_report/',
      { params: { period, ...branch } }
    );
    return response.data;
  },

  // GET /analytics/top_selling_product/?period=&order=&page=&limit=&branch_id=
  getTopSellingProducts: async (
    { period, order = 'desc', page = 1, limit = 5 }: TopProductsParams,
    branch: BranchFilterParams = {}
  ): Promise<Paginated<TopSellingProduct>> => {
    const response = await protectedApi.get<Paginated<TopSellingProduct>>(
      '/analytics/top_selling_product/',
      { params: { period, order, page, limit, ...branch } }
    );
    return response.data;
  },

  // GET /analytics/top_wishlisted_product/?period=&order=&page=&limit=&branch_id=
  getTopWishlistedProducts: async (
    { period, order = 'desc', page = 1, limit = 5 }: TopProductsParams,
    branch: BranchFilterParams = {}
  ): Promise<Paginated<TopWishlistedProduct>> => {
    const response = await protectedApi.get<Paginated<TopWishlistedProduct>>(
      '/analytics/top_wishlisted_product/',
      { params: { period, order, page, limit, ...branch } }
    );
    return response.data;
  },
};
