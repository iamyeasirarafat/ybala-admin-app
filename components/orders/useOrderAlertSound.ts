import { Order } from '@/types';
import { useAudioPlayer } from 'expo-audio';
import { useCallback, useEffect, useRef } from 'react';
import { getOrderListTab } from './orderStatus';

/**
 * Plays assets/sounds/order_alert.wav once whenever an order newly appears in
 * the "New" (pending) bucket — e.g. via the background poll — as opposed to
 * one merely revealed by paging further into history via "Load more". Stays
 * silent until after the first successful fetch, so orders already pending
 * on load don't trigger it.
 *
 * `allOrders` must be the raw fetched list (unfiltered by whichever tab is
 * currently active), since a new order should alert regardless of which tab
 * the user is looking at.
 */
export const useOrderAlertSound = (
  allOrders: Order[],
  hasLoaded: boolean,
  limit: number,
) => {
  const alertPlayer = useAudioPlayer(require('@/assets/sounds/order_alert.wav'));

  const stopAlert = useCallback(() => {
    alertPlayer.pause();
    alertPlayer.seekTo(0);
  }, [alertPlayer]);

  const knownNewOrderIdsRef = useRef<Set<number> | null>(null);
  const prevLimitRef = useRef(limit);

  useEffect(() => {
    if (!hasLoaded) return;

    const newTabOrderIds = allOrders
      .filter((o) => getOrderListTab(o.status) === 'new')
      .map((o) => o.id);

    const knownIds = knownNewOrderIdsRef.current;
    // "Load more" grows `allOrders` with older orders that were always
    // pending, not ones that just arrived — skip alerting for those, but
    // still fold them in below so they don't trigger later.
    const isPagination = limit !== prevLimitRef.current;
    prevLimitRef.current = limit;

    if (knownIds && !isPagination) {
      const hasNewArrival = newTabOrderIds.some((id) => !knownIds.has(id));
      if (hasNewArrival) {
        alertPlayer.seekTo(0);
        alertPlayer.play();
      }
    }

    knownNewOrderIdsRef.current = new Set(newTabOrderIds);
  }, [hasLoaded, allOrders, limit, alertPlayer]);

  return { stopAlert };
};
