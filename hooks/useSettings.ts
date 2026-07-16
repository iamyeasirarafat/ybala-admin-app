import { settingsService } from '@/services/settingsService';
import {
  BrandStyle,
  OtherSettings,
  ShopSettings,
  StoreLocation,
} from '@/types';
import { extractApiError } from '@/utils/errorExtractor';
import { toast } from '@/utils/toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const keys = {
  shop: ['settings', 'shop'] as const,
  brand: ['settings', 'brand'] as const,
  other: ['settings', 'other'] as const,
  stores: ['settings', 'store_location'] as const,
  managers: ['settings', 'managers'] as const,
};

const STALE = 5 * 60 * 1000;

// ---------------- Queries ----------------

export const useShopSettings = () =>
  useQuery({
    queryKey: keys.shop,
    queryFn: settingsService.getShopSettings,
    staleTime: STALE,
    retry: false,
  });

export const useBrandStyle = () =>
  useQuery({
    queryKey: keys.brand,
    queryFn: settingsService.getBrandStyle,
    staleTime: STALE,
    retry: false,
  });

export const useOtherSettings = () =>
  useQuery({
    queryKey: keys.other,
    queryFn: settingsService.getOtherSettings,
    staleTime: STALE,
    retry: false,
  });

export const useStoreLocations = () =>
  useQuery({
    queryKey: keys.stores,
    queryFn: settingsService.getStoreLocations,
    staleTime: STALE,
    retry: false,
  });

export const useManagers = () =>
  useQuery({
    queryKey: keys.managers,
    queryFn: settingsService.getManagers,
    staleTime: STALE,
    retry: false,
  });

// ---------------- Mutations ----------------

export const useUpdateShopSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<ShopSettings>) =>
      settingsService.updateShopSettings(payload),
    onSuccess: (data) => {
      qc.setQueryData(keys.shop, data);
      toast.success('Shop settings updated successfully.');
    },
    onError: (error) => {
      toast.error(extractApiError(error, 'Failed to update shop settings.'));
    },
  });
};

export const useUpdateBrandStyle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      settingsService.updateBrandStyle(formData),
    onSuccess: (data: BrandStyle) => {
      qc.setQueryData(keys.brand, data);
      toast.success('Brand settings updated successfully.');
    },
    onError: (error) => {
      toast.error(extractApiError(error, 'Failed to update brand settings.'));
    },
  });
};

export const useUpdateOtherSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<OtherSettings>) =>
      settingsService.updateOtherSettings(payload),
    onSuccess: (data: OtherSettings) => {
      qc.setQueryData(keys.other, data);
      toast.success('Other settings updated successfully.');
    },
    onError: (error) => {
      toast.error(extractApiError(error, 'Failed to update settings.'));
    },
  });
};

export const useCreateStoreLocation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      settingsService.createStoreLocation(formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.stores });
      toast.success('Store location saved successfully.');
    },
    onError: (error) => {
      toast.error(extractApiError(error, 'Failed to save store location.'));
    },
  });
};

export const useUpdateStoreLocation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      settingsService.updateStoreLocation(id, formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.stores });
      toast.success('Store location updated successfully.');
    },
    onError: (error) => {
      toast.error(extractApiError(error, 'Failed to update store location.'));
    },
  });
};

export const useDeleteStoreLocation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => settingsService.deleteStoreLocation(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.stores });
      toast.success('Store location deleted successfully.');
    },
    onError: (error) => {
      toast.error(extractApiError(error, 'Failed to delete store location.'));
    },
  });
};

export type { StoreLocation };
