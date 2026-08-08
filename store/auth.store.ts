import { create } from 'zustand';
import axios from 'axios';
import { bindPushUser, unbindPushUser } from '@/services/onesignal';
import { AuthState, LoginResponse, ProfileResponse, UserType } from '@/types';
import {
  saveTokens,
  getAccessToken,
  getRefreshToken,
  deleteAllTokens,
  saveAccessToken,
} from '@/storage/secure';
import { protectedApi, publicApi } from '@/services/api';
import { queryClient } from '@/providers/QueryProvider';
import { APP_CONFIG } from '@/constants/config';

const isStaff = (userType: string): userType is UserType =>
  userType === 'admin' || userType === 'manager';

/**
 * Bind this device's push subscription to the logged-in user so the backend
 * can target it via `include_aliases: { external_id: [...] }`.
 *
 * The profile is fetched directly rather than through the `useProfile` query
 * so the binding can never be skipped by a cache hit — React Query serves a
 * profile cached within `staleTime` without changing object identity, which
 * silently suppressed the effect that used to live in the hook. Driving it
 * from the auth lifecycle instead means every login binds, every time.
 *
 * Failures are swallowed: a device that can't register should not block the
 * user from getting into the app.
 */
async function bindPushSubscription(): Promise<void> {
  try {
    const { data } = await protectedApi.get<ProfileResponse>(
      '/user/?profile=true'
    );

    if (data?.id == null) {
      console.warn('OneSignal: profile has no id, skipping bind');
      return;
    }

    useAuthStore.getState().setUserType(data.userType);

    // Not awaited: bindPushUser waits for the FCM token and verifies the write
    // with retries, which can take seconds. That must not sit in front of the
    // user on the login screen — it self-corrects in the background.
    void bindPushUser(String(data.id));
  } catch (error) {
    console.error('OneSignal bind error:', error);
  }
}

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

      // Awaited so the device is bound before the user reaches the app.
      // Never throws — see bindPushSubscription.
      await bindPushSubscription();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      // Not awaited: waiting on the server round trip would freeze the logout
      // button for seconds. Ordering is still guaranteed — bind and unbind are
      // serialized inside the service, so a login on a different account queues
      // behind this unbind instead of racing it.
      void unbindPushUser();

      await deleteAllTokens();

      set({
        accessToken: null,
        refreshToken: null,
        userType: null,
        isAuthenticated: false,
      });

      // Drop every cached query, not just the profile: all of it belongs to
      // the user who just logged out, and a stale entry served to the next
      // user is both a data leak and the reason re-login used to skip binding.
      queryClient.clear();
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

      // Re-bind on every cold start so a device whose registration failed
      // earlier recovers on its own, without waiting for a re-login. Not
      // awaited: app launch must not block on a network round trip.
      void bindPushSubscription();
    }
  } catch (error) {
    console.error('Error initializing auth:', error);
  }
};
