import {
  AssignmentStatus,
  DeliveryManStatus,
  OrderStatus,
  VehicleType,
} from '@/types';

interface Meta {
  label: string;
  bg: string; // tailwind background classes
  text: string; // tailwind text-color classes
  dot: string; // hex for indicators
}

export const ASSIGNMENT_STATUS_META: Record<AssignmentStatus, Meta> = {
  assigned: {
    label: 'Assigned',
    bg: 'bg-blue-100 dark:bg-blue-900',
    text: 'text-blue-700 dark:text-blue-300',
    dot: '#3B82F6',
  },
  accepted: {
    label: 'Accepted',
    bg: 'bg-indigo-100 dark:bg-indigo-900',
    text: 'text-indigo-700 dark:text-indigo-300',
    dot: '#6366F1',
  },
  picked_up: {
    label: 'Picked Up',
    bg: 'bg-purple-100 dark:bg-purple-900',
    text: 'text-purple-700 dark:text-purple-300',
    dot: '#A855F7',
  },
  en_route: {
    label: 'On The Way',
    bg: 'bg-teal-100 dark:bg-teal-900',
    text: 'text-teal-700 dark:text-teal-300',
    dot: '#14B8A6',
  },
  delivered: {
    label: 'Delivered',
    bg: 'bg-green-100 dark:bg-green-900',
    text: 'text-green-700 dark:text-green-300',
    dot: '#22C55E',
  },
  failed: {
    label: 'Failed',
    bg: 'bg-red-100 dark:bg-red-900',
    text: 'text-red-700 dark:text-red-300',
    dot: '#EF4444',
  },
  cancelled: {
    label: 'Cancelled',
    bg: 'bg-gray-100 dark:bg-gray-700',
    text: 'text-gray-600 dark:text-gray-300',
    dot: '#9CA3AF',
  },
};

/** Live availability of a rider. `is_on_duty` is the shift toggle the rider
 *  controls; `current_status` is what the backend derives from their work. */
export const RIDER_STATUS_META: Record<DeliveryManStatus, Meta> = {
  offline: {
    label: 'Offline',
    bg: 'bg-gray-100 dark:bg-gray-700',
    text: 'text-gray-600 dark:text-gray-300',
    dot: '#9CA3AF',
  },
  idle: {
    label: 'Available',
    bg: 'bg-green-100 dark:bg-green-900',
    text: 'text-green-700 dark:text-green-300',
    dot: '#22C55E',
  },
  busy: {
    label: 'On Delivery',
    bg: 'bg-amber-100 dark:bg-amber-900',
    text: 'text-amber-700 dark:text-amber-300',
    dot: '#F59E0B',
  },
};

const UNKNOWN_META: Meta = {
  label: 'Unknown',
  bg: 'bg-gray-100 dark:bg-gray-700',
  text: 'text-gray-600 dark:text-gray-300',
  dot: '#9CA3AF',
};

/** Never index the maps directly: an unrecognised status from the API should
 *  render as "Unknown", not crash the badge. */
export const assignmentMeta = (status?: AssignmentStatus | null): Meta =>
  (status && ASSIGNMENT_STATUS_META[status]) || UNKNOWN_META;

export const riderMeta = (status?: DeliveryManStatus | null): Meta =>
  (status && RIDER_STATUS_META[status]) || UNKNOWN_META;

export const VEHICLE_TYPES: { key: VehicleType; label: string; icon: string }[] =
  [
    { key: 'bike', label: 'Bike', icon: 'bicycle-outline' },
    { key: 'scooter', label: 'Scooter', icon: 'speedometer-outline' },
    { key: 'car', label: 'Car', icon: 'car-outline' },
    { key: 'on_foot', label: 'On Foot', icon: 'walk-outline' },
  ];

export const vehicleLabel = (type?: VehicleType | null): string =>
  VEHICLE_TYPES.find((v) => v.key === type)?.label ?? '—';

/**
 * An order can take a rider once it has been accepted into the store
 * (`processing`). `delivering` stays assignable so a failed or cancelled
 * attempt can be handed to someone else — the backend's one-active-assignment
 * -per-order constraint is what actually blocks a double assignment.
 */
export const ASSIGNABLE_ORDER_STATUSES: OrderStatus[] = [
  'processing',
  'delivering',
];

export const isOrderAssignable = (
  status: OrderStatus,
  isPickup?: boolean,
): boolean => !isPickup && ASSIGNABLE_ORDER_STATUSES.includes(status);

/** "12 Mar, 14:05" — compact enough for the assignment timeline rows. */
export const formatTimestamp = (value?: string | null): string => {
  if (!value) return '—';
  const date = new Date(value);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};
