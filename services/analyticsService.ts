import { protectedApi } from './api';
import {
  AnalyticsPeriod,
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

export const analyticsService = {
  // GET /analytics/payment_analytics/?start_date=&end_date=
  getPaymentAnalytics: async (
    params: PaymentAnalyticsParams = {}
  ): Promise<PaymentAnalytics> => {
    const response = await protectedApi.get<PaymentAnalytics>(
      '/analytics/payment_analytics/',
      { params }
    );
    return response.data;
  },

  // GET /analytics/order_report/?period=12_months|3_months|7_days
  getOrderReport: async (period: AnalyticsPeriod): Promise<OrderReport> => {
    const response = await protectedApi.get<OrderReport>('/analytics/order_report/', {
      params: { period },
    });
    return response.data;
  },

  // GET /analytics/sales_report/?period=12_months|3_months|7_days
  getSalesReport: async (period: AnalyticsPeriod): Promise<SalesReport> => {
    const response = await protectedApi.get<SalesReport>('/analytics/sales_report/', {
      params: { period },
    });
    return response.data;
  },

  // GET /analytics/user_report/?period=...  (new users per month/day)
  getUserReport: async (period: AnalyticsPeriod): Promise<UserReport> => {
    const response = await protectedApi.get<UserReport>('/analytics/user_report/', {
      params: { period },
    });
    return response.data;
  },

  // GET /analytics/unique_visitor_report/?period=...
  getUniqueVisitorReport: async (period: AnalyticsPeriod): Promise<VisitorReport> => {
    const response = await protectedApi.get<VisitorReport>(
      '/analytics/unique_visitor_report/',
      { params: { period } }
    );
    return response.data;
  },

  // GET /analytics/top_selling_product/?period=&order=&page=&limit=
  getTopSellingProducts: async ({
    period,
    order = 'desc',
    page = 1,
    limit = 5,
  }: TopProductsParams): Promise<Paginated<TopSellingProduct>> => {
    const response = await protectedApi.get<Paginated<TopSellingProduct>>(
      '/analytics/top_selling_product/',
      { params: { period, order, page, limit } }
    );
    return response.data;
  },

  // GET /analytics/top_wishlisted_product/?period=&order=&page=&limit=
  getTopWishlistedProducts: async ({
    period,
    order = 'desc',
    page = 1,
    limit = 5,
  }: TopProductsParams): Promise<Paginated<TopWishlistedProduct>> => {
    const response = await protectedApi.get<Paginated<TopWishlistedProduct>>(
      '/analytics/top_wishlisted_product/',
      { params: { period, order, page, limit } }
    );
    return response.data;
  },
};
