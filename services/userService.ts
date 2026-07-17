import { protectedApi } from './api';
import { ManagedUser, Paginated, ProfileResponse, UserPayload } from '@/types';

export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  phoneNumber?: string;
  email?: string;
  image?: string; // base64 data URL
}

export interface GetUsersParams {
  search?: string;
  userType?: string; // 'admin' | 'manager' | 'customer'
  page?: number;
  limit?: number;
}

export const userService = {
  // PATCH /user/{userId}/
  updateProfile: async (
    userId: number,
    data: UpdateProfilePayload,
  ): Promise<ProfileResponse> => {
    const response = await protectedApi.patch<ProfileResponse>(
      `/user/${userId}/`,
      data,
    );
    return response.data;
  },

  // ---- Admin user management ----
  // GET /user/?page=&limit=&search=&userType=
  getUsers: async (
    params: GetUsersParams = {},
  ): Promise<Paginated<ManagedUser>> => {
    const query: Record<string, string | number> = {};
    if (params.search) query.search = params.search;
    if (params.userType && params.userType !== 'all')
      query.userType = params.userType;
    if (params.page) query.page = params.page;
    if (params.limit) query.limit = params.limit;
    const res = await protectedApi.get<Paginated<ManagedUser>>('/user/', {
      params: query,
    });
    return res.data;
  },

  // GET /user/{id}/
  getUser: async (id: number): Promise<ManagedUser> => {
    const res = await protectedApi.get<ManagedUser>(`/user/${id}/`);
    return res.data;
  },

  // POST /user/
  createUser: async (payload: UserPayload): Promise<ManagedUser> => {
    const res = await protectedApi.post<ManagedUser>('/user/', payload);
    return res.data;
  },

  // PATCH /user/{id}/
  updateUser: async (
    id: number,
    payload: Partial<UserPayload>,
  ): Promise<ManagedUser> => {
    const res = await protectedApi.patch<ManagedUser>(`/user/${id}/`, payload);
    return res.data;
  },

  // DELETE /user/{id}/
  deleteUser: async (id: number): Promise<void> => {
    await protectedApi.delete(`/user/${id}/`);
  },
};
