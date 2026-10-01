import { Order } from '@/types';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { useCallback, useEffect, useRef } from 'react';
import { getOrderListTab } from './orderStatus';

/**
 * Loops assets/sounds/order_alert.wav from the moment an order newly appears
 * in the "New" (pending) bucket — e.g. via the background poll — until it is
 * acknowledged: either the user calls `stopAlert` (opens or advances an
 * order), or every order that triggered the alert has left "New" (accepted,
 * cancelled, … from this device or another one).
 *
 * Orders merely revealed by "Load more" don't alert, and nothing alerts until
 * after the first successful fetch, so orders already pending on load are
 * silent.
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

  useEffect(() => {
    // Without playsInSilentMode, iOS mutes the alert whenever the ring/silent
    // switch is on — which on a shop device is most of the time.
    setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'duckOthers',
    }).catch((e) => console.warn('Order alert: setAudioModeAsync failed', e));
  }, []);

  useEffect(() => {
    alertPlayer.loop = true;
  }, [alertPlayer]);

  // Every pending order id seen so far. A union, not a snapshot: a search
  // narrows the list, and replacing the set made clearing the search look
  // like a burst of new arrivals.
  const knownNewOrderIdsRef = useRef<Set<number> | null>(null);
  // Orders that triggered the currently ringing alert.
  const alertingIdsRef = useRef<Set<number>>(new Set());
  const prevLimitRef = useRef(limit);

  const startAlert = useCallback(() => {
    if (alertPlayer.playing) return;
    void alertPlayer.seekTo(0);
    alertPlayer.play();
  }, [alertPlayer]);

  const stopAlert = useCallback(() => {
    alertingIdsRef.current.clear();
    alertPlayer.pause();
    void alertPlayer.seekTo(0);
  }, [alertPlayer]);

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

    const alerting = alertingIdsRef.current;
    if (knownIds && !isPagination) {
      for (const id of newTabOrderIds) {
        if (!knownIds.has(id)) alerting.add(id);
      }
    }

    // An order that moved out of "New" has been dealt with. Only orders seen
    // with another status count — one missing from the list may just be
    // hidden by the current search.
    for (const order of allOrders) {
      if (alerting.has(order.id) && getOrderListTab(order.status) !== 'new') {
        alerting.delete(order.id);
      }
    }

    if (alerting.size > 0) startAlert();
    else if (alertPlayer.playing) stopAlert();

    knownNewOrderIdsRef.current = new Set([
      ...(knownIds ?? []),
      ...newTabOrderIds,
    ]);
  }, [hasLoaded, allOrders, limit, alertPlayer, startAlert, stopAlert]);

  return { stopAlert };
};
