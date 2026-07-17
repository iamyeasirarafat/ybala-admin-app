import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { promotionService } from '@/services/promotionService';
import { Coupon, CouponPayload, Slider } from '@/types';
import { extractApiError } from '@/utils/errorExtractor';
import { toast } from '@/utils/toast';

const keys = {
  coupons: (search?: string) => ['promotion', 'coupons', search ?? ''] as const,
  coupon: (id: number) => ['promotion', 'coupon', id] as const,
  slider: ['promotion', 'slider'] as const,
  popup: ['promotion', 'popup_banner'] as const,
  header: ['promotion', 'header_banner'] as const,
  mobileHeader: ['promotion', 'mobile_header_banner'] as const,
  menus: ['promotion', 'menus'] as const,
  categories: ['promotion', 'categories'] as const,
  customers: ['promotion', 'customers'] as const,
};

const STALE = 5 * 60 * 1000;

// ---------------- Coupons ----------------

export const useCoupons = (search?: string) =>
  useQuery({
    queryKey: keys.coupons(search),
    queryFn: () => promotionService.getCoupons({ search }),
    staleTime: STALE,
  });

export const useCoupon = (id?: number) =>
  useQuery({
    queryKey: keys.coupon(id ?? 0),
    queryFn: () => promotionService.getCoupon(id as number),
    enabled: !!id,
  });

export const useSaveCoupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id?: number; payload: CouponPayload }) =>
      id
        ? promotionService.updateCoupon(id, payload)
        : promotionService.createCoupon(payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['promotion', 'coupons'] });
      toast.success(`Coupon ${vars.id ? 'updated' : 'created'} successfully.`);
    },
    onError: (error) => {
      toast.error(extractApiError(error, 'Failed to save coupon.'));
    },
  });
};

export const useDeleteCoupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => promotionService.deleteCoupon(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['promotion', 'coupons'] });
      toast.success('Coupon deleted successfully.');
    },
    onError: (error) => {
      toast.error(extractApiError(error, 'Failed to delete coupon.'));
    },
  });
};

// ---------------- Banners / Slider ----------------

export const useSlider = () =>
  useQuery({
    queryKey: keys.slider,
    queryFn: promotionService.getSlider,
    staleTime: STALE,
    retry: false,
  });

export const useUpdateSlider = () => {
  const qc = useQueryClient();
  return useMutation({
    // POST when the singleton doesn't exist yet, otherwise PUT.
    mutationFn: ({ payload, exists }: { payload: Slider; exists: boolean }) =>
      exists
        ? promotionService.updateSlider(payload)
        : promotionService.createSlider(payload),
    onSuccess: (data) => {
      qc.setQueryData(keys.slider, data);
      toast.success('Home page slider updated successfully.');
    },
    onError: (error) => {
      toast.error(extractApiError(error, 'Failed to update slider.'));
    },
  });
};

export const usePopupBanner = () =>
  useQuery({
    queryKey: keys.popup,
    queryFn: promotionService.getPopupBanner,
    staleTime: STALE,
    retry: false,
  });

export const useUpdatePopupBanner = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      promotionService.updatePopupBanner(formData),
    onSuccess: (data) => {
      qc.setQueryData(keys.popup, data);
      toast.success('Popup banner updated successfully.');
    },
    onError: (error) => {
      toast.error(extractApiError(error, 'Failed to update popup banner.'));
    },
  });
};

export const useHeaderBanner = () =>
  useQuery({
    queryKey: keys.header,
    queryFn: promotionService.getHeaderBanner,
    staleTime: STALE,
    retry: false,
  });

export const useUpdateHeaderBanner = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      promotionService.updateHeaderBanner(formData),
    onSuccess: (data) => {
      qc.setQueryData(keys.header, data);
      toast.success('Header banner updated successfully.');
    },
    onError: (error) => {
      toast.error(extractApiError(error, 'Failed to update header banner.'));
    },
  });
};

export const useMobileHeaderBanner = () =>
  useQuery({
    queryKey: keys.mobileHeader,
    queryFn: promotionService.getMobileHeaderBanner,
    staleTime: STALE,
    retry: false,
  });

export const useUpdateMobileHeaderBanner = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      promotionService.updateMobileHeaderBanner(formData),
    onSuccess: (data) => {
      qc.setQueryData(keys.mobileHeader, data);
      toast.success('Header banner updated successfully.');
    },
    onError: (error) => {
      toast.error(extractApiError(error, 'Failed to update header banner.'));
    },
  });
};

// ---------------- Lookups ----------------

export const useMenuOptions = () =>
  useQuery({ queryKey: keys.menus, queryFn: promotionService.getMenus, staleTime: STALE });

export const useCategoryOptions = () =>
  useQuery({
    queryKey: keys.categories,
    queryFn: promotionService.getCategories,
    staleTime: STALE,
  });

export const useCustomerOptions = () =>
  useQuery({
    queryKey: keys.customers,
    queryFn: promotionService.getCustomers,
    staleTime: STALE,
  });

export type { Coupon };
