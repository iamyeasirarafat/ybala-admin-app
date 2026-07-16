import {
  BrandStyle,
  Manager,
  OtherSettings,
  Paginated,
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
};
