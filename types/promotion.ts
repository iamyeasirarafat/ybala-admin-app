// Promotion domain types — mirrors yabala-be/apps/promotion

export type CouponType = 'simple' | 'complex';
export type CouponMethod = 'and' | 'or';

export interface CouponMenuRef {
  id: number;
  translations?: { en?: { name?: string } };
}
export interface CouponCategoryRef {
  id: number;
  name?: string;
}
export interface CouponCustomerRef {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface Coupon {
  id: number;
  code: string;
  description?: string;
  amount: number;
  percentage: boolean;
  start_date: string;
  end_date: string;
  type: CouponType;
  method?: CouponMethod | null;
  customers: CouponCustomerRef[];
  category: CouponCategoryRef[];
  menu: CouponMenuRef[];
  autoapply?: boolean;
  mid_price?: number | string | null;
  mid_discount?: number | string | null;
  min_amount?: number | string | null;
  status?: string;
  usage_count?: number;
}

export interface CouponPayload {
  code: string;
  description: string;
  amount: number;
  percentage: boolean;
  start_date: string;
  end_date: string;
  type: CouponType;
  method?: CouponMethod | null;
  customers?: number[];
  category?: number[];
  menu?: number[];
  mid_price?: number | null;
  mid_discount?: number | null;
  min_amount?: number | null;
}

export interface SliderItem {
  image: string | null;
  banner_link: string | null;
  image_alt_text: string | null;
}

export interface Slider {
  id?: number;
  number_of_banners: number;
  items: SliderItem[];
}

export interface Banner {
  id?: number;
  image?: string | null;
  enabled: boolean;
  image_alt?: string | null;
  link?: string | null;
  delay?: number | null; // popup only
}

// Simple option shape for multi-select pickers (menu/category/customer)
export interface SelectOption {
  id: number;
  name: string;
  subtitle?: string;
}
