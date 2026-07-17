import { create } from 'zustand';
import axios from 'axios';
import { OneSignal } from 'react-native-onesignal';
import { AuthState, LoginResponse, UserType } from '@/types';
import {
  saveTokens,
  getAccessToken,
  getRefreshToken,
  deleteAllTokens,
  saveAccessToken,
} from '@/storage/secure';
import { publicApi } from '@/services/api';
import { queryClient } from '@/providers/QueryProvider';
import { APP_CONFIG } from '@/constants/config';

const isStaff = (userType: string): userType is UserType =>
  userType === 'admin' || userType === 'manager';

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  userType: null,
  isAuthenticated: false,

  setTokens: (accessToken, refreshToken) => {
    set({
      accessToken,
      refreshToken,
      isAuthenticated: !!(accessToken && refreshToken),
    });
  },

  setUserType: (userType) => {
    set({ userType });
  },

  login: async (userName: string, password: string) => {
    try {
      const response = await publicApi.post<LoginResponse>('/login', {
        user_name: userName,
        password,
      });

      const { access, refresh, userType } = response.data;

      // Security: this app is for staff only. Reject customers.
      if (!isStaff(userType)) {
        throw new Error('This account is not authorized to use the admin app.');
      }

      await saveTokens(access, refresh);

      set({
        accessToken: access,
        refreshToken: refresh,
        userType,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      // Unbind this device from the user so it stops receiving their pushes.
      OneSignal.logout();

      await deleteAllTokens();

      set({
        accessToken: null,
        refreshToken: null,
        userType: null,
        isAuthenticated: false,
      });

      // Remove cached profile so it re-fetches fresh on next login
      queryClient.removeQueries({ queryKey: ['profile'] });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  refreshAccessToken: async () => {
    try {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post<{ access: string }>(
        `${APP_CONFIG.apiUrl}/refresh`,
        { refresh: refreshToken }
      );

      const newAccessToken = response.data.access;
      await saveAccessToken(newAccessToken);
      set({ accessToken: newAccessToken });

      return newAccessToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      await get().logout();
      return null;
    }
  },
}));

/**
 * Initialize auth state from secure storage on cold start.
 * Profile data (and userType) is restored reactively by the useProfile
 * hook once isAuthenticated becomes true.
 */
export const initializeAuth = async () => {
  try {
    const accessToken = await getAccessToken();
    const refreshToken = await getRefreshToken();

    if (accessToken && refreshToken) {
      useAuthStore.getState().setTokens(accessToken, refreshToken);
    }
  } catch (error) {
    console.error('Error initializing auth:', error);
  }
};
