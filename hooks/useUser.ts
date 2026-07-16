import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useProfile } from '@/hooks/useProfile';
import { UpdateProfilePayload, userService } from '@/services/userService';
import { extractApiError } from '@/utils/errorExtractor';
import { toast } from '@/utils/toast';

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
