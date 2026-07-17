import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import {
  AddCartPayload,
  CouponValidatePayload,
  CreateOrderPayload,
  OrderListParams,
} from '@/types';
import { extractApiError } from '@/utils/errorExtractor';
import { toast } from '@/utils/toast';

const keys = {
  orders: (params: OrderListParams) => ['order', 'list', params] as const,
  order: (id: number) => ['order', 'detail', id] as const,
  cart: (userId: number) => ['order', 'cart', userId] as const,
};

export const useOrders = (params: OrderListParams) =>
  useQuery({
    queryKey: keys.orders(params),
    queryFn: () => orderService.getOrders(params),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });

export const useOrder = (id?: number) =>
  useQuery({
    queryKey: keys.order(id ?? 0),
    queryFn: () => orderService.getOrder(id as number),
    enabled: !!id,
  });

export const useCreateOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) =>
      orderService.createOrder(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['order', 'list'] });
      toast.success('Order created successfully.');
    },
    onError: (error) => {
      toast.error(extractApiError(error, 'Failed to create order.'));
    },
  });
};

export const useUpdateOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<CreateOrderPayload>;
    }) => orderService.updateOrder(id, payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['order', 'list'] });
      qc.invalidateQueries({ queryKey: keys.order(vars.id) });
      toast.success('Order updated successfully.');
    },
    onError: (error) => {
      toast.error(extractApiError(error, 'Failed to update order.'));
    },
  });
};

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: CreateOrderPayload['status'] }) =>
      orderService.updateOrder(id, { status }),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['order', 'list'] });
      qc.invalidateQueries({ queryKey: keys.order(vars.id) });
      toast.success('Order status updated.');
    },
    onError: (error) => {
      toast.error(extractApiError(error, 'Failed to update order.'));
    },
  });
};

export const useDeleteOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => orderService.deleteOrder(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['order', 'list'] });
      toast.success('Order deleted successfully.');
    },
    onError: (error) => {
      toast.error(extractApiError(error, 'Failed to delete order.'));
    },
  });
};

export const useAssignStoreLocation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, storeId }: { id: number; storeId: number }) =>
      orderService.assignStoreLocation(id, storeId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: keys.order(vars.id) });
      qc.invalidateQueries({ queryKey: ['order', 'list'] });
      toast.success('Store location assigned.');
    },
    onError: (error) => {
      toast.error(extractApiError(error, 'Failed to assign store location.'));
    },
  });
};

// ---- Cart ----
export const useCartItems = (userId?: number) =>
  useQuery({
    queryKey: keys.cart(userId ?? 0),
    queryFn: () => orderService.getCartItems(userId as number),
    enabled: !!userId,
  });

export const useAddCartItem = () =>
  useMutation({
    mutationFn: (payload: AddCartPayload) => orderService.addCartItem(payload),
    onError: (error) => {
      toast.error(extractApiError(error, 'Failed to add item.'));
    },
  });

export const useUpdateCartQuantity = () =>
  useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      orderService.updateCartQuantity(id, quantity),
    onError: (error) => {
      toast.error(extractApiError(error, 'Failed to update quantity.'));
    },
  });

export const useDeleteCartItem = () =>
  useMutation({
    mutationFn: (id: number) => orderService.deleteCartItem(id),
    onError: (error) => {
      toast.error(extractApiError(error, 'Failed to remove item.'));
    },
  });

// ---- Coupon ----
export const useValidateCoupon = () =>
  useMutation({
    mutationFn: (payload: CouponValidatePayload) =>
      orderService.validateCoupon(payload),
  });
