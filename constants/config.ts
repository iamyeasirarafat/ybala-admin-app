export const APP_CONFIG = {
  name: 'Ybala Customer App',
  version: '1.0.0',
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com',
  enableMockAuth: true, // Set to false in production
};

export const QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  retry: 1,
};
