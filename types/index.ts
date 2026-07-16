export * from './analytics';
export * from './settings';

export type UserType = 'admin' | 'manager';

export interface User {
  id: number;
  email?: string;
  phoneNumber?: string;
  first_name?: string;
  last_name?: string;
  userType: UserType;
  profile_image?: string;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userType: UserType | null;
  isAuthenticated: boolean;
  setTokens: (accessToken: string | null, refreshToken: string | null) => void;
  setUserType: (userType: UserType | null) => void;
  login: (userName: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<string | null>;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// API response types (mirror yabala-be / ybala-customer-app)
export interface LoginResponse {
  access: string;
  refresh: string;
  userType: UserType | 'customer';
}

export interface RefreshTokenResponse {
  access: string;
}

export interface ProfileResponse {
  id: number;
  email?: string;
  phoneNumber?: string;
  first_name?: string;
  last_name?: string;
  userType: UserType;
  profile_image?: string;
}
