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

// Single-series reports keyed by month/day label, e.g. { jan: 12, feb: 8, ... }
export type UserReport = Record<string, number>;
export type VisitorReport = Record<string, number>;

export type ReportOrder = 'asc' | 'desc';

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface MenuSummary {
  id: number;
  translations?: { en?: { name?: string }; [key: string]: any };
  image?: string | null;
  type?: string;
  price?: number | string;
}

export interface TopSellingProduct {
  menu: MenuSummary;
  sold_count: number;
  total_price: number | string | null;
}

export interface TopWishlistedProduct {
  menu: MenuSummary;
  total_wishlisted: number;
}

export interface TopProductsParams {
  period: AnalyticsPeriod;
  order?: ReportOrder;
  page?: number;
  limit?: number;
}
