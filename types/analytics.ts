export type AnalyticsPeriod = '12_months' | '3_months' | '7_days';

export interface PaymentAnalytics {
  total_orders: number;
  completed_orders: number;
  total_sales_price: number;
  total_discount_price: number;
  total_delivery_charge: number;
  total_price: number;
}

export interface PaymentAnalyticsParams {
  start_date?: string;
  end_date?: string;
}

// Keyed by month/day label, e.g. { jan: { customer_orders, guest_orders }, ... }
export type OrderReport = Record<
  string,
  {
    customer_orders: number;
    guest_orders: number;
  }
>;

// Keyed by month/day label, e.g. { jan: { sales, canceled }, ... }
export type SalesReport = Record<
  string,
  {
    sales: number;
    canceled: number;
  }
>;
