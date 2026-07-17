import { OrderStatus } from '@/types';

interface StatusMeta {
  label: string;
  bg: string; // tailwind background classes
  text: string; // tailwind text-color classes
  dot: string; // hex for indicators
}

export const STATUS_META: Record<OrderStatus, StatusMeta> = {
  draft: {
    label: 'Draft',
    bg: 'bg-gray-100 dark:bg-gray-700',
    text: 'text-gray-600 dark:text-gray-300',
    dot: '#9CA3AF',
  },
  payment_required: {
    label: 'Payment Required',
    bg: 'bg-amber-100 dark:bg-amber-900',
    text: 'text-amber-700 dark:text-amber-300',
    dot: '#F59E0B',
  },
  pending: {
    label: 'Pending',
    bg: 'bg-blue-100 dark:bg-blue-900',
    text: 'text-blue-700 dark:text-blue-300',
    dot: '#3B82F6',
  },
  processing: {
    label: 'Processing',
    bg: 'bg-indigo-100 dark:bg-indigo-900',
    text: 'text-indigo-700 dark:text-indigo-300',
    dot: '#6366F1',
  },
  delivering: {
    label: 'Delivering',
    bg: 'bg-teal-100 dark:bg-teal-900',
    text: 'text-teal-700 dark:text-teal-300',
    dot: '#14B8A6',
  },
  completed: {
    label: 'Completed',
    bg: 'bg-green-100 dark:bg-green-900',
    text: 'text-green-700 dark:text-green-300',
    dot: '#22C55E',
  },
  returned: {
    label: 'Returned',
    bg: 'bg-orange-100 dark:bg-orange-900',
    text: 'text-orange-700 dark:text-orange-300',
    dot: '#F97316',
  },
  cancelled: {
    label: 'Cancelled',
    bg: 'bg-red-100 dark:bg-red-900',
    text: 'text-red-700 dark:text-red-300',
    dot: '#EF4444',
  },
};

// Statuses selectable in the list filter tabs (matches the frontend tabs).
export const STATUS_FILTER_TABS: { key: string; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'processing', label: 'Processing' },
  { key: 'delivering', label: 'Delivering' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

// Statuses a staff member can transition an order to from the detail screen.
export const STATUS_ACTIONS: OrderStatus[] = [
  'pending',
  'processing',
  'delivering',
  'completed',
  'returned',
  'cancelled',
];
