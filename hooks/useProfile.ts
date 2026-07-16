import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { protectedApi } from '@/services/api';
import { useAuthStore } from '@/store/auth.store';
import { ProfileResponse } from '@/types';

const fetchProfile = async (): Promise<ProfileResponse> => {
  const response = await protectedApi.get<ProfileResponse>('/user/?profile=true');
  return response.data;
};

export const useProfile = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUserType = useAuthStore((state) => state.setUserType);

  const query = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  useEffect(() => {
    const profile = query.data;
    if (!profile) return;

    // Restore userType on cold start (initializeAuth doesn't fetch profile)
    if (profile.userType) {
      setUserType(profile.userType);
    }
  }, [query.data, setUserType]);

  return query;
};
