import { create } from 'zustand';
import { AuthState, User, LoginResponse } from '@/types';
import { saveToken, getToken, deleteToken } from '@/storage/secure';
import { api } from '@/services/api';

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isAuthenticated: false,

  setToken: (token: string | null) => {
    set({ token, isAuthenticated: !!token });
  },

  setUser: (user: User | null) => {
    set({ user });
  },

  login: async (email: string, password: string) => {
    try {
      // Mock API call - replace with your actual endpoint
      const response = await api.post<LoginResponse>('/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      // Save token to secure storage
      await saveToken(token);

      // Update store
      set({
        token,
        user,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      // Delete token from secure storage
      await deleteToken();

      // Clear store
      set({
        token: null,
        user: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
}));

// Initialize auth state from secure storage
export const initializeAuth = async () => {
  try {
    const token = await getToken();
    if (token) {
      useAuthStore.getState().setToken(token);

      // Optionally fetch user data
      // const user = await fetchUserProfile();
      // useAuthStore.getState().setUser(user);
    }
  } catch (error) {
    console.error('Error initializing auth:', error);
  }
};
