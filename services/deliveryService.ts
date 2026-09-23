import { protectedApi } from './api';
import {
  AssignmentListParams,
  CreateAssignmentPayload,
  DeliveryAssignment,
  DeliveryManProfile,
  DeliveryManProfilePayload,
  Paginated,
} from '@/types';

/** CustomPagination is opt-in on the backend: a request without ?page/?limit
 *  comes back as a bare array instead of {count,results}. */
const unwrap = <T>(data: Paginated<T> | T[]): T[] =>
  Array.isArray(data) ? data : data?.results ?? [];

export const deliveryService = {
  // ---- Delivery man profiles ----

  // GET /delivery/profile/  (admin: all, manager: own store only)
  getProfiles: async (): Promise<DeliveryManProfile[]> => {
    const res = await protectedApi.get<
      Paginated<DeliveryManProfile> | DeliveryManProfile[]
    >('/delivery/profile/', { params: { limit: 100 } });
    return unwrap(res.data);
  },

  // GET /delivery/profile/{id}/
  getProfile: async (id: number): Promise<DeliveryManProfile> => {
    const res = await protectedApi.get<DeliveryManProfile>(
      `/delivery/profile/${id}/`,
    );
    return res.data;
  },

  // POST /delivery/profile/ — links an existing delivery_man user to a profile.
  createProfile: async (
    payload: DeliveryManProfilePayload,
  ): Promise<DeliveryManProfile> => {
    const res = await protectedApi.post<DeliveryManProfile>(
      '/delivery/profile/',
      payload,
    );
    return res.data;
  },

  // PATCH /delivery/profile/{id}/
  updateProfile: async (
    id: number,
    payload: Partial<DeliveryManProfilePayload>,
  ): Promise<DeliveryManProfile> => {
    const res = await protectedApi.patch<DeliveryManProfile>(
      `/delivery/profile/${id}/`,
      payload,
    );
    return res.data;
  },

  // ---- Assignments ----

  // GET /delivery/assignments/?order=&delivery_man=&status=
  getAssignments: async (
    params: AssignmentListParams = {},
  ): Promise<DeliveryAssignment[]> => {
    const query: Record<string, string | number> = {};
    if (params.order) query.order = params.order;
    if (params.delivery_man) query.delivery_man = params.delivery_man;
    if (params.status) query.status = params.status;
    if (params.page) query.page = params.page;
    if (params.limit) query.limit = params.limit;
    const res = await protectedApi.get<
      Paginated<DeliveryAssignment> | DeliveryAssignment[]
    >('/delivery/assignments/', { params: query });
    return unwrap(res.data);
  },

  // POST /delivery/assignments/ — admin/manager assigns one order to one rider.
  createAssignment: async (
    payload: CreateAssignmentPayload,
  ): Promise<DeliveryAssignment> => {
    const res = await protectedApi.post<DeliveryAssignment>(
      '/delivery/assignments/',
      payload,
    );
    return res.data;
  },

  // GET /delivery/stats/{deliveryManId}/
  getStats: async (
    deliveryManId: number,
  ): Promise<{ today: number; this_month: number; all_time: number }> => {
    const res = await protectedApi.get(`/delivery/stats/${deliveryManId}/`);
    return res.data;
  },
};
