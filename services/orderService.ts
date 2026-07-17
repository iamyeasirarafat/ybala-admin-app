import { protectedApi } from './api';
import {
  AddCartPayload,
  CartLine,
  CouponValidatePayload,
  CouponValidateResponse,
  CreateOrderPayload,
  Order,
  OrderListParams,
  Paginated,
} from '@/types';

export const orderService = {
  // ---- Lists (role-based: admin sees all, manager sees own branch) ----
  getOrders: async (params: OrderListParams): Promise<Paginated<Order>> => {
    const path = params.role === 'manager' ? '/order/manager/' : '/order/admin/';
    const query: Record<string, string | number> = {
      page: params.page ?? 1,
      limit: params.limit ?? 15,
    };
    if (params.status && params.status !== 'all') query.status = params.status;
    if (params.search) query.search = params.search;
    const res = await protectedApi.get<Paginated<Order>>(path, { params: query });
    return res.data;
  },

  getOrder: async (id: number): Promise<Order> => {
    const res = await protectedApi.get<Order>(`/order/${id}/`);
    return res.data;
  },

  createOrder: async (payload: CreateOrderPayload): Promise<Order> => {
    const res = await protectedApi.post<Order>('/order/', payload);
    return res.data;
  },

  // Status change / edit (admin or manager). Managers scoped to own store.
  updateOrder: async (
    id: number,
    payload: Partial<CreateOrderPayload>,
  ): Promise<Order> => {
    const res = await protectedApi.patch<Order>(`/order/update/${id}/`, payload);
    return res.data;
  },

  deleteOrder: async (id: number): Promise<void> => {
    await protectedApi.delete(`/order/delete/${id}/`);
  },

  // Admin assigns an order to a store location (pending orders only).
  assignStoreLocation: async (
    orderId: number,
    storeLocationId: number,
  ): Promise<void> => {
    await protectedApi.get(`/order/${orderId}/assign/`, {
      params: { store_location: storeLocationId },
    });
  },

  // ---- Cart (server-side line items) ----
  getCartItems: async (userId: number): Promise<CartLine[]> => {
    const res = await protectedApi.get<Paginated<CartLine> | CartLine[]>(
      '/order/cart/',
      { params: { user_id: userId } },
    );
    return Array.isArray(res.data) ? res.data : res.data.results ?? [];
  },

  addCartItem: async (payload: AddCartPayload): Promise<CartLine> => {
    const res = await protectedApi.post<CartLine>('/order/cart/', payload);
    return res.data;
  },

  // NOTE: this endpoint intentionally has no trailing slash (matches backend).
  updateCartQuantity: async (
    id: number,
    quantity: number,
  ): Promise<CartLine> => {
    const res = await protectedApi.patch<CartLine>(
      `/order/cart/update_quantity/${id}`,
      { quantity },
    );
    return res.data;
  },

  deleteCartItem: async (id: number): Promise<void> => {
    await protectedApi.delete(`/order/cart/${id}/`);
  },

  // ---- Coupon validation ----
  validateCoupon: async (
    payload: CouponValidatePayload,
  ): Promise<CouponValidateResponse> => {
    const res = await protectedApi.post<CouponValidateResponse>(
      '/order/coupon_validate/',
      payload,
    );
    return res.data;
  },
};
