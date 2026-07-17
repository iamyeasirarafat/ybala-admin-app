// User management types — mirrors yabala-be/apps/user UserSerializer

export type ManagedUserType = 'admin' | 'manager' | 'customer';

export interface ManagedUserAddress {
  id: number;
  [key: string]: unknown;
}

export interface ManagedUser {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string | null;
  phoneNumber?: string | null;
  userType: ManagedUserType;
  profile_image?: string | null;
  address?: ManagedUserAddress[];
  store_location?: number | null;
}

export interface UserPayload {
  first_name: string;
  last_name: string;
  email?: string;
  phoneNumber?: string;
  userType: ManagedUserType;
  countryCode?: string;
  password?: string;
  image?: string; // base64 data URL
}
