import { protectedApi } from './api';
import { Category, MenuItem, Paginated, SelectOption, Tag } from '@/types';

const multipart = { headers: { 'Content-Type': 'multipart/form-data' } };

type ListResp<T> = Paginated<T> | T[];
const toArray = <T,>(data: ListResp<T>): T[] =>
  Array.isArray(data) ? data : data.results ?? [];

export interface MenuListParams {
  search?: string;
  available?: boolean;
  type?: string;
  category?: number;
  limit?: number;
  page?: number;
}

export const menuService = {
  // ---- Menu items ----
  getMenus: async (params: MenuListParams = {}): Promise<Paginated<MenuItem>> => {
    const query: Record<string, string | number | boolean> = {};
    if (params.search) query.search = params.search;
    if (typeof params.available === 'boolean') query.available = params.available;
    if (params.type) query.type = params.type;
    if (params.category) query.category = params.category;
    if (params.limit) query.limit = params.limit;
    if (params.page) query.page = params.page;
    const res = await protectedApi.get<Paginated<MenuItem>>('/menu/', {
      params: query,
    });
    return res.data;
  },
  getMenu: async (id: number): Promise<MenuItem> => {
    const res = await protectedApi.get<MenuItem>(`/menu/${id}/`);
    return res.data;
  },
  createMenu: async (formData: FormData): Promise<MenuItem> => {
    const res = await protectedApi.post<MenuItem>('/menu/', formData, multipart);
    return res.data;
  },
  updateMenu: async (id: number, formData: FormData): Promise<MenuItem> => {
    const res = await protectedApi.put<MenuItem>(
      `/menu/${id}/`,
      formData,
      multipart,
    );
    return res.data;
  },
  deleteMenu: async (id: number): Promise<void> => {
    await protectedApi.delete(`/menu/${id}/`);
  },

  // ---- Categories ----
  getCategories: async (search?: string): Promise<Category[]> => {
    const res = await protectedApi.get<ListResp<Category>>('/menu/category/', {
      params: { ...(search ? { search } : {}), limit: 200 },
    });
    return toArray(res.data);
  },
  getCategory: async (id: number): Promise<Category> => {
    const res = await protectedApi.get<Category>(`/menu/category/${id}/`);
    return res.data;
  },
  createCategory: async (formData: FormData): Promise<Category> => {
    const res = await protectedApi.post<Category>(
      '/menu/category/',
      formData,
      multipart,
    );
    return res.data;
  },
  updateCategory: async (id: number, formData: FormData): Promise<Category> => {
    const res = await protectedApi.patch<Category>(
      `/menu/category/${id}/`,
      formData,
      multipart,
    );
    return res.data;
  },
  deleteCategory: async (id: number): Promise<void> => {
    await protectedApi.delete(`/menu/category/${id}/`);
  },

  // ---- Tags ----
  getTags: async (search?: string): Promise<Tag[]> => {
    const res = await protectedApi.get<ListResp<Tag>>('/menu/tag/', {
      params: { ...(search ? { search } : {}), limit: 200 },
    });
    return toArray(res.data);
  },
  getTag: async (id: number): Promise<Tag> => {
    const res = await protectedApi.get<Tag>(`/menu/tag/${id}/`);
    return res.data;
  },
  createTag: async (name: string): Promise<Tag> => {
    const res = await protectedApi.post<Tag>('/menu/tag/', { name });
    return res.data;
  },
  updateTag: async (id: number, name: string): Promise<Tag> => {
    const res = await protectedApi.patch<Tag>(`/menu/tag/${id}/`, { name });
    return res.data;
  },
  deleteTag: async (id: number): Promise<void> => {
    await protectedApi.delete(`/menu/tag/${id}/`);
  },

  // ---- Lookups (as SelectOption for pickers) ----
  getCategoryOptions: async (): Promise<SelectOption[]> => {
    const cats = await menuService.getCategories();
    return cats.map((c) => ({ id: c.id, name: c.name }));
  },
  getTagOptions: async (): Promise<SelectOption[]> => {
    const tags = await menuService.getTags();
    return tags.map((t) => ({ id: t.id, name: t.name }));
  },
};
