import { protectedApi } from './api';
import {
  Banner,
  Coupon,
  CouponPayload,
  Paginated,
  SelectOption,
  Slider,
} from '@/types';

const multipart = { headers: { 'Content-Type': 'multipart/form-data' } };

type ListResp<T> = Paginated<T> | T[];
const toArray = <T,>(data: ListResp<T>): T[] =>
  Array.isArray(data) ? data : data.results ?? [];

export const promotionService = {
  // ---- Coupons ----
  // GET /promotion/coupon/?search=&status=
  getCoupons: async (params: {
    search?: string;
    status?: string;
  } = {}): Promise<Coupon[]> => {
    const res = await protectedApi.get<ListResp<Coupon>>('/promotion/coupon/', {
      params,
    });
    return toArray(res.data);
  },
  getCoupon: async (id: number): Promise<Coupon> => {
    const res = await protectedApi.get<Coupon>(`/promotion/coupon/${id}/`);
    return res.data;
  },
  createCoupon: async (payload: CouponPayload): Promise<Coupon> => {
    const res = await protectedApi.post<Coupon>('/promotion/coupon/', payload);
    return res.data;
  },
  updateCoupon: async (
    id: number,
    payload: Partial<CouponPayload>,
  ): Promise<Coupon> => {
    const res = await protectedApi.patch<Coupon>(
      `/promotion/coupon/${id}/`,
      payload,
    );
    return res.data;
  },
  deleteCoupon: async (id: number): Promise<void> => {
    await protectedApi.delete(`/promotion/coupon/${id}/`);
  },

  // ---- Banners (singletons) ----
  // GET/PUT /promotion/popup_banner
  getPopupBanner: async (): Promise<Banner> => {
    const res = await protectedApi.get<Banner>('/promotion/popup_banner');
    return res.data;
  },
  updatePopupBanner: async (formData: FormData): Promise<Banner> => {
    const res = await protectedApi.put<Banner>(
      '/promotion/popup_banner',
      formData,
      multipart,
    );
    return res.data;
  },

  // GET/PUT /promotion/header_banner
  getHeaderBanner: async (): Promise<Banner> => {
    const res = await protectedApi.get<Banner>('/promotion/header_banner');
    return res.data;
  },
  updateHeaderBanner: async (formData: FormData): Promise<Banner> => {
    const res = await protectedApi.put<Banner>(
      '/promotion/header_banner',
      formData,
      multipart,
    );
    return res.data;
  },

  // GET/PUT /promotion/mobile_header_banner
  getMobileHeaderBanner: async (): Promise<Banner> => {
    const res = await protectedApi.get<Banner>('/promotion/mobile_header_banner');
    return res.data;
  },
  updateMobileHeaderBanner: async (formData: FormData): Promise<Banner> => {
    const res = await protectedApi.put<Banner>(
      '/promotion/mobile_header_banner',
      formData,
      multipart,
    );
    return res.data;
  },

  // ---- Home page slider (singleton, JSON items) ----
  // GET/PUT /promotion/slider
  getSlider: async (): Promise<Slider> => {
    const res = await protectedApi.get<Slider>('/promotion/slider');
    return res.data;
  },
  updateSlider: async (payload: Slider): Promise<Slider> => {
    const res = await protectedApi.put<Slider>('/promotion/slider', payload);
    return res.data;
  },
  createSlider: async (payload: Slider): Promise<Slider> => {
    const res = await protectedApi.post<Slider>('/promotion/slider', payload);
    return res.data;
  },

  // Upload a file, returns the stored path/url — POST /file/
  uploadFile: async (file: {
    uri: string;
    name: string;
    type: string;
  }): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file as unknown as Blob);
    const res = await protectedApi.post<{ file: string }>('/file/', fd, multipart);
    return res.data.file;
  },

  // ---- Lookups for complex coupons ----
  getMenus: async (): Promise<SelectOption[]> => {
    const res = await protectedApi.get<ListResp<any>>('/menu/');
    return toArray(res.data).map((m) => ({
      id: m.id,
      name: m?.translations?.en?.name || `Item #${m.id}`,
    }));
  },
  getCategories: async (): Promise<SelectOption[]> => {
    const res = await protectedApi.get<ListResp<any>>('/menu/category/');
    return toArray(res.data).map((c) => ({ id: c.id, name: c.name }));
  },
  getCustomers: async (): Promise<SelectOption[]> => {
    const res = await protectedApi.get<ListResp<any>>('/user/');
    return toArray(res.data).map((u) => ({
      id: u.id,
      name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email || `User #${u.id}`,
      subtitle: u.email || u.phoneNumber || '',
    }));
  },
};
