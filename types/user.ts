// User management types — mirrors yabala-be/apps/user UserSerializer

export type ManagedUserType =
  | 'admin'
  | 'manager'
  | 'customer'
  | 'delivery_man';

export interface ManagedUserAddress {
  id: number;
  [key: string]: unknown;
}

export interface ManagedUser {
  id: number;
  full_name?: string;
  email?: string | null;
  phoneNumber?: string | null;
  userType: ManagedUserType;
  profile_image?: string | null;
  address?: ManagedUserAddress[];
  store_location?: number | null;
  /** Set only for delivery_man users that already have a DeliveryManProfile. */
  delivery_profile_id?: number | null;
}

export interface UserPayload {
  full_name: string;
  email?: string;
  phoneNumber?: string;
  userType: ManagedUserType;
  countryCode?: string;
  password?: string;
  image?: string; // base64 data URL
}
