import { AuthProvider } from '@/providers/AuthProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { setNavigationHandler } from '@/services/api';
import {
  initializeOneSignal,
  requestPushPermission,
} from '@/services/onesignal';
import { useAuthStore } from '@/store/auth.store';
import {
  consumePendingRoute,
  routeFromNotification,
  setPendingRoute,
} from '@/utils/deepLink';
import { ToastContainer } from '@/utils/toast';
import { Ionicons } from '@expo/vector-icons';
import { Stack, router, useRootNavigationState } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect, useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import { OneSignal } from 'react-native-onesignal';
import 'react-native-reanimated';
import '../global.css';


export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const rootNavigationState = useRootNavigationState();

  // Kept in a ref so the OneSignal click listener (registered once, on
  // mount) always sees the latest readiness without re-subscribing.
  const navReadyRef = useRef(false);
  useEffect(() => {
    navReadyRef.current = !!rootNavigationState?.key;
  }, [rootNavigationState?.key]);

  //onsignal setup
  useEffect(() => {
    // Gated behind a ready-promise in the service: React fires child effects
    // (AuthProvider's session restore) before this one, so callers must be able
    // to wait for the SDK rather than assume it is up.
    initializeOneSignal();

    // Result is handled, not discarded — a denial on Android 13+ means no FCM
    // token and therefore no device in OneSignal at all.
    void requestPushPermission();

    // Handle taps on a notification -> deep link into the app.
    const onClick = (event: any) => {
      // We navigate ourselves, so stop OneSignal from also opening the URL
      // (avoids a double navigation when a launch URL is set).
      event?.preventDefault?.();

      const route = routeFromNotification(event?.notification);
      if (!route) return;

      // Always stash first so the route is never lost. On a cold start
      // (app launched by tapping the notification), this listener can
      // fire before the root navigator has mounted — calling router.push
      // that early is silently dropped by React Navigation. When that's
      // the case, leave it stashed; AuthProvider flushes it once the
      // navigator is ready and the session is restored.
      setPendingRoute(route);

      if (useAuthStore.getState().isAuthenticated && navReadyRef.current) {
        const pending = consumePendingRoute();
        if (pending) router.push(pending as any);
      }
    };

    // Surfaces the actual bind/unbind result. OneSignal.login/logout are
    // fire-and-forget void calls, so this listener is the only way to confirm
    // the device really registered rather than assuming it did.
    const onSubscriptionChange = (event: any) => {
      console.log('OneSignal subscription:', {
        id: event?.current?.id,
        optedIn: event?.current?.optedIn,
        token: event?.current?.token ? 'present' : 'missing',
      });
    };

    OneSignal.Notifications.addEventListener('click', onClick);
    OneSignal.User.pushSubscription.addEventListener(
      'change',
      onSubscriptionChange
    );
    return () => {
      OneSignal.Notifications.removeEventListener('click', onClick);
      OneSignal.User.pushSubscription.removeEventListener(
        'change',
        onSubscriptionChange
      );
    };
  }, []);

  useEffect(() => {
    // When a protected request fails auth (refresh expired), clear the
    // session — AuthProvider then redirects to the login screen.
    setNavigationHandler(() => {
      useAuthStore.getState().logout();
      router.replace('/(auth)/login');
    });
  }, []);

  const isDark = colorScheme === 'dark';

  const defaultScreenOptions = {
    headerStyle: { backgroundColor: isDark ? '#111827' : '#FFFFFF' },
    headerTintColor: isDark ? '#FFFFFF' : '#111827',
    headerTitleStyle: {
      fontWeight: '600' as const,
      fontSize: 18,
      color: isDark ? '#FFFFFF' : '#111827',
    },
    headerShadowVisible: false,
    animation: 'slide_from_right' as const,
    gestureEnabled: true,
  };

  const backButton = () => (
    <TouchableOpacity onPress={() => router.back()} style={{ paddingRight: 8 }}>
      <Ionicons
        name="chevron-back"
        size={28}
        color={isDark ? '#FFFFFF' : '#111827'}
      />
    </TouchableOpacity>
  );

  return (
    <QueryProvider>
      <AuthProvider>
        <Stack screenOptions={defaultScreenOptions}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="settings/account-info"
            options={{ title: 'Personal Information', headerLeft: backButton }}
          />
          <Stack.Screen
            name="settings/brand-settings"
            options={{ title: 'Brand Settings', headerLeft: backButton }}
          />
          <Stack.Screen
            name="settings/shop-settings"
            options={{ title: 'Shop Settings', headerLeft: backButton }}
          />
          <Stack.Screen
            name="settings/store-location"
            options={{ title: 'Store Location', headerLeft: backButton }}
          />
          <Stack.Screen
            name="settings/store-form"
            options={{ title: 'Store', headerLeft: backButton }}
          />
          <Stack.Screen
            name="settings/others-settings"
            options={{ title: 'Others', headerLeft: backButton }}
          />
          <Stack.Screen
            name="settings/website-seo"
            options={{ title: 'Website SEO', headerLeft: backButton }}
          />
          <Stack.Screen
            name="settings/page-seo"
            options={{ title: 'Page SEO', headerLeft: backButton }}
          />
          <Stack.Screen
            name="settings/pixels"
            options={{ title: 'Pixels', headerLeft: backButton }}
          />
          <Stack.Screen
            name="users/index"
            options={{ title: 'User Management', headerLeft: backButton }}
          />
          <Stack.Screen
            name="users/user-form"
            options={{ title: 'User', headerLeft: backButton }}
          />
          <Stack.Screen
            name="promotion/index"
            options={{ title: 'Promotion', headerLeft: backButton }}
          />
          <Stack.Screen
            name="promotion/promo-code"
            options={{ title: 'Promo Code', headerLeft: backButton }}
          />
          <Stack.Screen
            name="promotion/coupon-form"
            options={{ title: 'Coupon', headerLeft: backButton }}
          />
          <Stack.Screen
            name="promotion/promo-banner"
            options={{ title: 'Promo Banner', headerLeft: backButton }}
          />
          <Stack.Screen
            name="promotion/home-slider"
            options={{ title: 'Home Page Slider', headerLeft: backButton }}
          />
          <Stack.Screen
            name="promotion/header-banner"
            options={{ title: 'Header Banner', headerLeft: backButton }}
          />
          <Stack.Screen
            name="promotion/mobile-header-banner"
            options={{ title: 'Mobile Header Banner', headerLeft: backButton }}
          />
          <Stack.Screen
            name="promotion/popup-banner"
            options={{ title: 'Popup Banner', headerLeft: backButton }}
          />
          <Stack.Screen
            name="menu/menu-list"
            options={{ title: 'Menu List', headerLeft: backButton }}
          />
          <Stack.Screen
            name="menu/menu-form"
            options={{ title: 'Menu', headerLeft: backButton }}
          />
          <Stack.Screen
            name="menu/categories"
            options={{ title: 'Category', headerLeft: backButton }}
          />
          <Stack.Screen
            name="menu/category-form"
            options={{ title: 'Category', headerLeft: backButton }}
          />
          <Stack.Screen
            name="menu/tags"
            options={{ title: 'Tag', headerLeft: backButton }}
          />
          <Stack.Screen
            name="menu/tag-form"
            options={{ title: 'Tag', headerLeft: backButton }}
          />
          <Stack.Screen
            name="orders/order-form"
            options={{ title: 'Order', headerLeft: backButton }}
          />
          <Stack.Screen
            name="orders/order-detail"
            options={{ title: 'Order Details', headerLeft: backButton }}
          />
        </Stack>
        <StatusBar style="auto" />
      </AuthProvider>
      <ToastContainer />
    </QueryProvider>
  );
}
