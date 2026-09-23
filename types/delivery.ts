// Delivery domain types — mirrors yabala-be/apps/delivery (models + serializers)
import { ManagedUser } from './user';

export type VehicleType = 'bike' | 'scooter' | 'car' | 'on_foot';

/** Live availability, maintained by the backend — never written from here. */
export type DeliveryManStatus = 'offline' | 'idle' | 'busy';

export type AssignmentStatus =
  | 'assigned'
  | 'accepted'
  | 'picked_up'
  | 'en_route'
  | 'delivered'
  | 'failed'
  | 'cancelled';

/** Statuses where the rider still owns the order. The backend allows only one
 *  active assignment per order and per rider at a time. */
export const ACTIVE_ASSIGNMENT_STATUSES: AssignmentStatus[] = [
  'assigned',
  'accepted',
  'picked_up',
  'en_route',
];

export interface DeliveryManProfile {
  id: number;
  user: number;
  user_data?: ManagedUser | null;
  store_location?: number | null;
  vehicle_type: VehicleType;
  vehicle_plate_number?: string | null;
  is_on_duty: boolean;
  current_status: DeliveryManStatus;
  last_known_latitude?: number | null;
  last_known_longitude?: number | null;
  last_location_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DeliveryManProfilePayload {
  user: number;
  store_location?: number | null;
  vehicle_type: VehicleType;
  vehicle_plate_number?: string;
  is_on_duty?: boolean;
}

/** The trimmed order payload the assignment endpoints embed. */
export interface AssignmentOrderBrief {
  id: number;
  full_name?: string | null;
  customer_phone?: string | null;
  status?: string;
  shipping_address?: Record<string, unknown> | null;
  dropoff_latitude?: number | null;
  dropoff_longitude?: number | null;
  total_price?: string | number | null;
}

export interface DeliveryAssignment {
  id: number;
  order: number;
  order_data?: AssignmentOrderBrief | null;
  delivery_man: number | null;
  delivery_man_data?: ManagedUser | null;
  assigned_by?: number | null;
  status: AssignmentStatus;
  assigned_at?: string | null;
  accepted_at?: string | null;
  picked_up_at?: string | null;
  delivered_at?: string | null;
  cancelled_at?: string | null;
  failure_reason?: string | null;
  dropoff_latitude?: number | null;
  dropoff_longitude?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAssignmentPayload {
  order_id: number;
  delivery_man_id: number;
}

export interface AssignmentListParams {
  order?: number;
  delivery_man?: number;
  status?: AssignmentStatus;
  page?: number;
  limit?: number;
}

/** A rider row as the management screen shows it: the user account joined with
 *  its delivery profile, which may not exist yet for accounts created through
 *  the generic user form. */
export interface DeliveryManRow {
  user: ManagedUser;
  profile?: DeliveryManProfile;
}
