import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { ProfileResponse } from '@/types';

const fetchProfile = async (): Promise<ProfileResponse> => {
  const response = await api.get<ProfileResponse>('/user/profile');
  return response.data;
};

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
