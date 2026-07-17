// Order domain types — mirrors yabala-be/apps/order (+ payment fields)
import { MenuItem } from './menu';
import { StoreLocation } from './settings';

export type OrderStatus =
  | 'draft'
  | 'payment_required'
  | 'pending'
  | 'processing'
  | 'completed'
  | 'delivering'
  | 'returned'
  | 'cancelled';

export type PaymentMethod = 'cash_on_delivery' | 'stripe';

export interface ShippingAddress {
  street: string;
  city: string;
  zip: string;
  state?: string;
}

export interface OrderVariant {
  name: string;
  price: string | number;
}

export interface CartLine {
  id: number;
  menu: number;
  menu_data?: MenuItem;
  quantity: number;
  price: string | number; // unit price
  variant?: OrderVariant | Record<string, unknown> | null;
  instruction?: string | null;
  user?: number | null;
  order?: number | null;
}

export interface AddCartPayload {
  menu: number;
  quantity: number;
  price: number | string;
  variant?: OrderVariant | null;
  created_by?: number;
  user?: number;
  instruction?: string;
}

export interface CouponValidatePayload {
  code: string;
  user_id?: number | string | null;
  cart_ids: number[];
}

export interface ValidatedCoupon {
  code: string;
  amount: number | string;
  percentage: boolean;
}

export interface CouponValidateResponse {
  valid: boolean;
  coupon?: ValidatedCoupon;
  message?: string;
}

export interface BranchInfo {
  id?: number;
  en_title?: string;
  ar_title?: string;
  en_map_link?: string;
  ar_map_link?: string;
  en_wa_link?: string;
  ar_wa_link?: string;
}

export interface OrderUserData {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  profile_image?: string | null;
  phoneNumber?: string | null;
}

export interface Order {
  id: number;
  user_data?: OrderUserData | null;
  status: OrderStatus;
  first_name?: string;
  last_name?: string;
  customer_phone?: string;
  customer_email?: string;
  shipping_address?: ShippingAddress | Record<string, unknown>;
  total_price?: string | number; // subtotal
  discount_price?: string | number;
  price?: string | number; // grand total
  vat?: string | number;
  delivery_charge?: string | number;
  payment_method?: PaymentMethod;
  carts?: CartLine[];
  coupon_data?: ValidatedCoupon[];
  created_at?: string;
  updated_at?: string;
  delivery_note?: string | null;
  is_pickup?: boolean;
  branch_info?: BranchInfo | null;
  store_location?: number | null;
  store_location_data?: StoreLocation | null;
}

export interface CreateOrderPayload {
  status?: OrderStatus;
  first_name: string;
  last_name: string;
  customer_phone: string;
  customer_email?: string;
  shipping_address?: ShippingAddress;
  delivery_note?: string;
  payment_method: PaymentMethod;
  is_pickup: boolean;
  branch_info?: BranchInfo | null;
  create_account?: boolean;
  password?: string;
  cart_ids: number[];
  coupon_code?: string[];
  coupon_data?: ValidatedCoupon[];
  user_id?: number;
  store_location?: number;
}

export type OrderRole = 'admin' | 'manager';

export interface OrderListParams {
  role: OrderRole;
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}
