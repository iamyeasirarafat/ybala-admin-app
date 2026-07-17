import '../global.css';
import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import 'react-native-reanimated';
import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { setNavigationHandler } from '@/services/api';
import { useAuthStore } from '@/store/auth.store';
import { ToastContainer } from '@/utils/toast';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

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
            options={{ title: 'New Order', headerLeft: backButton }}
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
