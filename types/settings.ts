// Settings domain types — mirrors yabala-be/apps/settings (models + serializers)

export interface ShopSettings {
  id?: number;
  enable_delivery_charge: boolean;
  devlivery_charge: number | string;
  enable_vat: boolean;
  vat: number | string;
}

export interface BrandStyle {
  id?: number;
  logo?: string | null;
  favicon?: string | null;
  login_page_image?: string | null;
}

export interface OtherSettings {
  id?: number;
  email?: string;
  phone?: string;
  whatsapp?: string;
  facebook?: string;
  titktok?: string;
  instagram?: string;
  youtube?: string;
  home_page_description?: string;
  location_page_description?: string;
  about_us?: string;
  terms?: string;
  privacy?: string;
}

export interface Manager {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  phoneNumber?: string | null;
  userType?: string;
}

export interface StoreLocation {
  id: number;
  en_title?: string;
  en_description?: string;
  en_map_link?: string;
  en_wa_link?: string;
  en_image?: string | null;
  ar_title?: string;
  ar_description?: string;
  ar_map_link?: string;
  ar_wa_link?: string;
  ar_image?: string | null;
  manager?: number | null;
  manager_data?: Manager | null;
  created_at?: string;
  updated_at?: string;
}

// Local image chosen from the device to upload via multipart/form-data
export interface ImageUpload {
  uri: string;
  name: string;
  type: string;
}

// ---- Website SEO ----
export interface MetaPixel {
  id?: number;
  enabled: boolean;
  pixel_enabled: boolean;
  pixel_id?: string;
  enable_conversation: boolean;
  enable_matching: boolean;
  conversation_api_key?: string;
  text_event_code?: string;
  verification_meta_tag?: string[];
}

export interface SeoMetaBlock {
  image?: string;
  meta_title?: string;
  meta_description?: string;
}

export interface SeoPageLocale {
  meta_title?: string;
  meta_description?: string;
  schema_type?: string;
  meta?: SeoMetaBlock;
  twitter?: SeoMetaBlock;
}

export interface SeoPage {
  en?: SeoPageLocale;
  ar?: SeoPageLocale;
}

export type SeoPageName =
  | 'home_page'
  | 'product_page'
  | 'contact_page'
  | 'location_page';

export interface SeoInfo {
  id?: number;
  home_page?: SeoPage;
  product_page?: SeoPage;
  contact_page?: SeoPage;
  location_page?: SeoPage;
}
