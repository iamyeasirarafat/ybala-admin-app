import { OneSignal } from 'react-native-onesignal';

const ONESIGNAL_APP_ID = '43e00645-7378-4b28-b67e-03379eefd79f';

/** How long to wait for the SDK to produce a push subscription (FCM token). */
const SUBSCRIPTION_TIMEOUT_MS = 15_000;
/** How long to wait for the server to commit a login/logout. */
const SETTLE_TIMEOUT_MS = 10_000;
const POLL_INTERVAL_MS = 300;
const MAX_BIND_ATTEMPTS = 3;

let initialized = false;
let resolveReady: () => void;

/**
 * Resolves once `initializeOneSignal` has run.
 *
 * Every other export awaits this, because React runs child effects before
 * parent effects: the AuthProvider effect that restores a session fires
 * *before* the RootLayout effect that initializes the SDK. Without this gate a
 * cold start can call `login()` on an uninitialized SDK, which the native layer
 * silently drops.
 */
const ready = new Promise<void>((resolve) => {
  resolveReady = resolve;
});

/**
 * Serializes bind/unbind so they can never overlap.
 *
 * A logout immediately followed by a login on a different account is exactly
 * the sequence that stranded the new external_id on the old user record: the
 * two operations ran concurrently and raced each other through OneSignal's
 * server queue. Chaining them here makes a bind wait for the preceding unbind
 * to commit, without the callers having to await anything.
 */
let queue: Promise<unknown> = Promise.resolve();

const serialize = <T>(task: () => Promise<T>): Promise<T> => {
  const run = queue.then(task, task);
  queue = run.catch(() => undefined);
  return run;
};

export const initializeOneSignal = (): void => {
  if (initialized) return;
  initialized = true;
  OneSignal.initialize(ONESIGNAL_APP_ID);
  resolveReady();
};

/** Re-reads `read` until it returns a value or the timeout elapses. */
const poll = async <T>(
  read: () => Promise<T | null | undefined>,
  timeoutMs: number
): Promise<T | null> => {
  const deadline = Date.now() + timeoutMs;

  for (;;) {
    const value = await read();
    if (value) return value;
    if (Date.now() >= deadline) return null;
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }
};

/**
 * Ask for notification permission and make sure the device is opted in.
 *
 * The result matters: on Android 13+ POST_NOTIFICATIONS is a runtime
 * permission, and a denial means no FCM token, so the device never appears in
 * OneSignal at all. Discarding this promise is why that failure was silent.
 */
export const requestPushPermission = async (): Promise<boolean> => {
  await ready;

  try {
    const granted = await OneSignal.Notifications.requestPermission(true);

    if (!granted) {
      console.warn(
        'OneSignal: notification permission denied — this device cannot receive pushes'
      );
      return false;
    }

    // Permission alone is not a subscription: a device that previously opted
    // out stays out until explicitly opted back in.
    OneSignal.User.pushSubscription.optIn();
    return true;
  } catch (error) {
    console.error('OneSignal permission error:', error);
    return false;
  }
};

/**
 * Bind this device to a backend user, then confirm the server committed it.
 *
 * `getExternalId` alone is not proof: it reflects local SDK state and flips the
 * moment `login()` is called, whether or not the server ever agreed. The
 * server-assigned `onesignalId` is the real signal, so both are checked
 * together — which is what the SDK's own observer docs advise.
 */
export const bindPushUser = (externalId: string): Promise<boolean> =>
  serialize(async () => {
    await ready;

    // Wait for a push subscription to exist before claiming it. Calling login()
    // while the FCM token is still in flight lets the SDK file the subscription
    // under an anonymous user and the external_id under a *second* record.
    const subscriptionId = await poll(
      () => OneSignal.User.pushSubscription.getIdAsync(),
      SUBSCRIPTION_TIMEOUT_MS
    );

    if (!subscriptionId) {
      console.warn(
        'OneSignal: no push subscription yet; binding anyway (check notification permission)'
      );
    }

    // Fired once. Re-calling login() on every retry (as this used to do) hands
    // the native SDK a fresh identity operation each time, which supersedes
    // the one still in flight — so a round trip slower than one poll window
    // could never finish before being restarted, and every attempt "timed
    // out" even though the server would have committed it if left alone.
    OneSignal.login(externalId);

    // Raw values from the last poll read, kept so a failure can report *which*
    // half never arrived. Collapsing both into one boolean made every distinct
    // failure mode print the same unactionable "did not commit".
    let lastOnesignalId: string | null | undefined;
    let lastExternalId: string | null | undefined;

    for (let attempt = 1; attempt <= MAX_BIND_ATTEMPTS; attempt++) {
      const confirmed = await poll(async () => {
        const [onesignalId, current] = await Promise.all([
          OneSignal.User.getOnesignalId(),
          OneSignal.User.getExternalId(),
        ]);
        lastOnesignalId = onesignalId;
        lastExternalId = current;
        // An externalId with no server-assigned onesignalId means the
        // association has not committed yet — keep waiting rather than
        // reporting a success that only exists on-device.
        return onesignalId && current === externalId ? onesignalId : null;
      }, SETTLE_TIMEOUT_MS);

      if (confirmed) {
        console.log(
          `OneSignal: bound external_id=${externalId} onesignal_id=${confirmed} subscription=${subscriptionId ?? 'none'}`
        );
        return true;
      }

      console.warn(
        `OneSignal: bind attempt ${attempt}/${MAX_BIND_ATTEMPTS} did not commit ` +
          `(onesignal_id=${lastOnesignalId ?? 'null'} ` +
          `external_id=${lastExternalId ?? 'null'} want=${externalId} ` +
          `subscription=${subscriptionId ?? 'null'})`
      );
    }

    console.error(
      `OneSignal: failed to bind external_id=${externalId} ` +
        `(last onesignal_id=${lastOnesignalId ?? 'null'}, ` +
        `last external_id=${lastExternalId ?? 'null'})`
    );
    return false;
  });

/**
 * Unbind the device so it stops receiving the previous user's pushes.
 *
 * Waits for the server to hand back a *new* anonymous user rather than for
 * `getExternalId` to go null — the latter clears instantly and locally, which
 * is a false confirmation that let the next login overwrite the outgoing user.
 */
export const unbindPushUser = (): Promise<void> =>
  serialize(async () => {
    await ready;

    const previousId = await OneSignal.User.getOnesignalId();
    OneSignal.logout();

    const settled = await poll(async () => {
      const current = await OneSignal.User.getOnesignalId();
      return current && current !== previousId ? current : null;
    }, SETTLE_TIMEOUT_MS);

    if (settled) {
      console.log(`OneSignal: unbound device, new anonymous user ${settled}`);
    } else {
      console.warn(
        'OneSignal: logout did not settle in time; next bind may need a retry'
      );
    }
  });
