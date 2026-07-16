import { protectedApi } from './api';
import { ProfileResponse } from '@/types';

export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  phoneNumber?: string;
  email?: string;
  image?: string; // base64 data URL
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
};
