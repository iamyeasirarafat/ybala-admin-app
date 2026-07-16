import { protectedApi } from './api';
import {
  AnalyticsPeriod,
  OrderReport,
  PaymentAnalytics,
  PaymentAnalyticsParams,
  SalesReport,
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
};
