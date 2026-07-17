import type { OSNotification } from 'react-native-onesignal';

/**
 * A pending in-app route captured from a notification tap while the user is
 * not yet authenticated. AuthProvider consumes it right after login/restore
 * so the deep link resumes to its intended screen.
 */
let _pendingRoute: string | null = null;

export const setPendingRoute = (route: string | null): void => {
  _pendingRoute = route;
};

export const consumePendingRoute = (): string | null => {
  const route = _pendingRoute;
  _pendingRoute = null;
  return route;
};

/**
 * Resolve an in-app router path from a OneSignal notification.
 *
 * Supports two payload styles from the backend:
 *  1. additionalData: { type: 'order', order_id: 42 }  (recommended)
 *  2. a launch URL: `ybalaadminapp://orders/order-detail?id=42`
 *
 * Returns null when the notification carries no navigable target.
 */
export const routeFromNotification = (
  notification?: OSNotification | null
): string | null => {
  if (!notification) return null;

  const data = (notification.additionalData ?? {}) as Record<string, unknown>;

  const orderId = data.order_id ?? data.orderId ?? data.id;
  if (data.type === 'order' && orderId != null) {
    return `/orders/order-detail?id=${orderId}`;
  }

  const url = notification.launchURL;
  if (url) {
    // Strip the custom scheme: `ybalaadminapp://orders/...` -> `/orders/...`
    const match = url.match(/:\/\/(.*)$/);
    if (match?.[1]) {
      return `/${match[1]}`;
    }
  }

  return null;
};
