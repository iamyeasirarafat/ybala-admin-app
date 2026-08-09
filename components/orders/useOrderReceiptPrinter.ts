import { useOtherSettings, useShopSettings } from '@/hooks/useSettings';
import { printReceipt } from '@/services/printer';
import { Order } from '@/types';
import { buildOrderReceipt } from '@/utils/receipt/orderReceipt';
import { useCallback } from 'react';

/**
 * Prints an order receipt on the POS's built-in printer.
 *
 * Shop details come from the settings singletons, which are already cached by
 * React Query with a 5-minute staleTime — so an accept-and-print does not pay
 * for extra round trips on every order.
 */
export const useOrderReceiptPrinter = () => {
  const { data: other } = useOtherSettings();
  const { data: shop } = useShopSettings();

  const print = useCallback(
    (order: Order) => printReceipt(buildOrderReceipt(order, { other, shop })),
    [other, shop],
  );

  return { print };
};
