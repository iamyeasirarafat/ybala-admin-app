import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { menuService, MenuListParams } from '@/services/menuService';
import { extractApiError } from '@/utils/errorExtractor';
import { toast } from '@/utils/toast';

const keys = {
  menus: (params: MenuListParams) => ['menu', 'list', params] as const,
  menu: (id: number) => ['menu', 'detail', id] as const,
  categories: (search?: string) => ['menu', 'categories', search ?? ''] as const,
  category: (id: number) => ['menu', 'category', id] as const,
  categoryOptions: ['menu', 'category-options'] as const,
  tags: (search?: string) => ['menu', 'tags', search ?? ''] as const,
  tag: (id: number) => ['menu', 'tag', id] as const,
  tagOptions: ['menu', 'tag-options'] as const,
};

const STALE = 60 * 1000;

// ---------------- Menu items ----------------

export const useMenus = (params: MenuListParams) =>
  useQuery({
    queryKey: keys.menus(params),
    queryFn: () => menuService.getMenus(params),
    placeholderData: keepPreviousData,
    staleTime: STALE,
  });

export const useMenu = (id?: number) =>
  useQuery({
    queryKey: keys.menu(id ?? 0),
    queryFn: () => menuService.getMenu(id as number),
    enabled: !!id,
  });

export const useSaveMenu = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id?: number; formData: FormData }) =>
      id ? menuService.updateMenu(id, formData) : menuService.createMenu(formData),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['menu', 'list'] });
      toast.success(`Menu ${vars.id ? 'updated' : 'created'} successfully.`);
    },
    onError: (error) => {
      toast.error(extractApiError(error, 'Failed to save menu.'));
    },
  });
};

export const useDeleteMenu = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => menuService.deleteMenu(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['menu', 'list'] });
      toast.success('Menu deleted successfully.');
    },
    onError: (error) => {
      toast.error(extractApiError(error, 'Failed to delete menu.'));
    },
  });
};

// ---------------- Categories ----------------

export const useCategories = (search?: string) =>
  useQuery({
    queryKey: keys.categories(search),
    queryFn: () => menuService.getCategories(search),
    staleTime: STALE,
  });

export const useCategory = (id?: number) =>
  useQuery({
    queryKey: keys.category(id ?? 0),
    queryFn: () => menuService.getCategory(id as number),
    enabled: !!id,
  });

export const useCategoryOptions = () =>
  useQuery({
    queryKey: keys.categoryOptions,
    queryFn: menuService.getCategoryOptions,
    staleTime: STALE,
  });

export const useSaveCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id?: number; formData: FormData }) =>
      id
        ? menuService.updateCategory(id, formData)
        : menuService.createCategory(formData),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['menu', 'categories'] });
      qc.invalidateQueries({ queryKey: keys.categoryOptions });
      toast.success(`Category ${vars.id ? 'updated' : 'created'} successfully.`);
    },
    onError: (error) => {
      toast.error(extractApiError(error, 'Failed to save category.'));
    },
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => menuService.deleteCategory(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['menu', 'categories'] });
      qc.invalidateQueries({ queryKey: keys.categoryOptions });
      toast.success('Category deleted successfully.');
    },
    onError: (error) => {
      toast.error(extractApiError(error, 'Failed to delete category.'));
    },
  });
};

// ---------------- Tags ----------------

export const useTags = (search?: string) =>
  useQuery({
    queryKey: keys.tags(search),
    queryFn: () => menuService.getTags(search),
    staleTime: STALE,
  });

export const useTag = (id?: number) =>
  useQuery({
    queryKey: keys.tag(id ?? 0),
    queryFn: () => menuService.getTag(id as number),
    enabled: !!id,
  });

export const useTagOptions = () =>
  useQuery({
    queryKey: keys.tagOptions,
    queryFn: menuService.getTagOptions,
    staleTime: STALE,
  });

export const useSaveTag = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id?: number; name: string }) =>
      id ? menuService.updateTag(id, name) : menuService.createTag(name),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['menu', 'tags'] });
      qc.invalidateQueries({ queryKey: keys.tagOptions });
      toast.success(`Tag ${vars.id ? 'updated' : 'created'} successfully.`);
    },
    onError: (error) => {
      toast.error(extractApiError(error, 'Failed to save tag.'));
    },
  });
};

export const useDeleteTag = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => menuService.deleteTag(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['menu', 'tags'] });
      qc.invalidateQueries({ queryKey: keys.tagOptions });
      toast.success('Tag deleted successfully.');
    },
    onError: (error) => {
      toast.error(extractApiError(error, 'Failed to delete tag.'));
    },
  });
};
