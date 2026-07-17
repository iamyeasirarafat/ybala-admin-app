import {
  BrandStyle,
  Manager,
  MetaPixel,
  OtherSettings,
  Paginated,
  SeoInfo,
  ShopSettings,
  StoreLocation,
} from '@/types';
import { protectedApi } from './api';

// django-solo singleton models always live at primary key 1
const SINGLETON_ID = 1;

const multipart = { headers: { 'Content-Type': 'multipart/form-data' } };

export const settingsService = {
  // ---- Shop settings (singleton) ----
  // GET/PUT /settings/shop_settings/1/
  getShopSettings: async (): Promise<ShopSettings> => {
    const res = await protectedApi.get<ShopSettings>(
      `/settings/shop_settings/${SINGLETON_ID}/`,
    );
    return res.data;
  },
  updateShopSettings: async (
    payload: Partial<ShopSettings>,
  ): Promise<ShopSettings> => {
    const res = await protectedApi.put<ShopSettings>(
      `/settings/shop_settings/${SINGLETON_ID}/`,
      payload,
    );
    return res.data;
  },

  // ---- Brand style (singleton, images) ----
  // GET/PUT /settings/brand_style/1/
  getBrandStyle: async (): Promise<BrandStyle> => {
    const res = await protectedApi.get<BrandStyle>(
      `/settings/brand_style/${SINGLETON_ID}/`,
    );
    return res.data;
  },
  updateBrandStyle: async (formData: FormData): Promise<BrandStyle> => {
    const res = await protectedApi.put<BrandStyle>(
      `/settings/brand_style/${SINGLETON_ID}/`,
      formData,
      multipart,
    );
    return res.data;
  },

  // ---- Other settings (singleton) ----
  // GET/PUT /settings/other_settings/1/
  getOtherSettings: async (): Promise<OtherSettings> => {
    const res = await protectedApi.get<OtherSettings>(
      `/settings/other_settings/${SINGLETON_ID}/`,
    );
    return res.data;
  },
  updateOtherSettings: async (
    payload: Partial<OtherSettings>,
  ): Promise<OtherSettings> => {
    const res = await protectedApi.put<OtherSettings>(
      `/settings/other_settings/${SINGLETON_ID}/`,
      payload,
    );
    return res.data;
  },

  // ---- Store locations (CRUD) ----
  // GET /settings/store_location/?limit=100
  getStoreLocations: async (): Promise<StoreLocation[]> => {
    const res = await protectedApi.get<
      Paginated<StoreLocation> | StoreLocation[]
    >('/settings/store_location/', { params: { limit: 100 } });
    return Array.isArray(res.data) ? res.data : res.data.results ?? [];
  },
  createStoreLocation: async (formData: FormData): Promise<StoreLocation> => {
    const res = await protectedApi.post<StoreLocation>(
      '/settings/store_location/',
      formData,
      multipart,
    );
    return res.data;
  },
  updateStoreLocation: async (
    id: number,
    formData: FormData,
  ): Promise<StoreLocation> => {
    const res = await protectedApi.put<StoreLocation>(
      `/settings/store_location/${id}/`,
      formData,
      multipart,
    );
    return res.data;
  },
  deleteStoreLocation: async (id: number): Promise<void> => {
    await protectedApi.delete(`/settings/store_location/${id}/`);
  },

  // ---- Managers (for store-location assignment) ----
  // GET /user/?userType=manager&limit=100
  getManagers: async (): Promise<Manager[]> => {
    const res = await protectedApi.get<Paginated<Manager> | Manager[]>('/user/', {
      params: { userType: 'manager', limit: 100 },
    });
    return Array.isArray(res.data) ? res.data : res.data.results ?? [];
  },

  // ---- Website SEO: meta pixel (singleton) ----
  // GET/PUT /settings/meta_pixel/1/
  getMetaPixel: async (): Promise<MetaPixel> => {
    const res = await protectedApi.get<MetaPixel>(
      `/settings/meta_pixel/${SINGLETON_ID}/`,
    );
    return res.data;
  },
  updateMetaPixel: async (payload: Partial<MetaPixel>): Promise<MetaPixel> => {
    const res = await protectedApi.put<MetaPixel>(
      `/settings/meta_pixel/${SINGLETON_ID}/`,
      payload,
    );
    return res.data;
  },

  // ---- Website SEO: page seo info (singleton APIView) ----
  // GET/PUT /settings/seo_info
  getSeoInfo: async (): Promise<SeoInfo> => {
    const res = await protectedApi.get<SeoInfo>('/settings/seo_info');
    return res.data;
  },
  updateSeoInfo: async (payload: Partial<SeoInfo>): Promise<SeoInfo> => {
    const res = await protectedApi.put<SeoInfo>('/settings/seo_info', payload);
    return res.data;
  },
};
