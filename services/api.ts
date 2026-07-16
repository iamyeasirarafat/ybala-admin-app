import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import { APP_CONFIG } from '@/constants/config';
import { RefreshTokenResponse } from '@/types';
import {
  deleteAllTokens,
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
} from '@/storage/secure';

// Navigation helper to avoid import cycles with expo-router
let navigationHandler: (() => void) | null = null;

export const setNavigationHandler = (handler: () => void) => {
  navigationHandler = handler;
};

const redirectToLogin = () => {
  if (navigationHandler) {
    navigationHandler();
  } else {
    console.warn(
      'Navigation handler not set. Call setNavigationHandler from your root layout.'
    );
  }
};

const API_BASE_URL = APP_CONFIG.apiUrl;

// Track if we're currently refreshing to avoid multiple refresh requests
let isRefreshing = false;
let failedQueue: {
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * PUBLIC API SERVICE
 * - Used for public endpoints (login, etc.)
 * - Optionally includes auth token if user is logged in
 * - Does NOT redirect to login on 401
 */
const createPublicApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    async (config) => {
      const token = await getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};

/**
 * PROTECTED API SERVICE
 * - Used for authenticated endpoints (profile, orders, menu, etc.)
 * - Requires authentication
 * - Automatically refreshes token on 401
 * - Redirects to login if refresh fails
 */
const createProtectedApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    async (config) => {
      const token = await getAccessToken();
      if (!token) {
        redirectToLogin();
        return Promise.reject(
          new Error('You must be logged in to access this resource.')
        );
      }
      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // Another request is already refreshing, queue this one
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return instance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = await getRefreshToken();
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await axios.post<RefreshTokenResponse>(
            `${API_BASE_URL}/refresh`,
            { refresh: refreshToken }
          );

          const newAccessToken = response.data.access;
          await saveAccessToken(newAccessToken);

          processQueue(null, newAccessToken);
          isRefreshing = false;

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return instance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError as Error, null);
          isRefreshing = false;

          await deleteAllTokens();
          redirectToLogin();

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const publicApi = createPublicApiInstance();
export const protectedApi = createProtectedApiInstance();

// Legacy export (defaults to public API)
export const api = publicApi;

export const apiService = {
  get: publicApi.get,
  post: publicApi.post,
  put: publicApi.put,
  delete: publicApi.delete,
  patch: publicApi.patch,
};

export const protectedApiService = {
  get: protectedApi.get,
  post: protectedApi.post,
  put: protectedApi.put,
  delete: protectedApi.delete,
  patch: protectedApi.patch,
};
