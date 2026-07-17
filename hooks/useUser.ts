import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useProfile } from '@/hooks/useProfile';
import {
  GetUsersParams,
  UpdateProfilePayload,
  userService,
} from '@/services/userService';
import { UserPayload } from '@/types';
import { extractApiError } from '@/utils/errorExtractor';
import { toast } from '@/utils/toast';

const userKeys = {
  list: (params: GetUsersParams) => ['users', 'list', params] as const,
  detail: (id: number) => ['users', 'detail', id] as const,
};

// PATCH /user/{id}/ — update the authenticated user's profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { data: profile } = useProfile();

  return useMutation({
    mutationFn: (data: UpdateProfilePayload) => {
      if (!profile?.id) {
        throw new Error('User not authenticated');
      }
      return userService.updateProfile(profile.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully.');
    },
    onError: (error) => {
      toast.error(extractApiError(error, 'Failed to update profile.'));
    },
  });
};

// ---------------- Admin user management ----------------

export const useUsers = (params: GetUsersParams) =>
  useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userService.getUsers(params),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });

export const useManagedUser = (id?: number) =>
  useQuery({
    queryKey: userKeys.detail(id ?? 0),
    queryFn: () => userService.getUser(id as number),
    enabled: !!id,
  });

export const useSaveUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id?: number; payload: UserPayload }) =>
      id
        ? userService.updateUser(id, payload)
        : userService.createUser(payload),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(`User ${vars.id ? 'updated' : 'created'} successfully.`);
    },
    onError: (error) => {
      toast.error(extractApiError(error, 'Failed to save user.'));
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully.');
    },
    onError: (error) => {
      toast.error(extractApiError(error, 'Failed to delete user.'));
    },
  });
};
