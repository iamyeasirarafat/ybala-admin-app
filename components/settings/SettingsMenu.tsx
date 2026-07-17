import { MenuItem } from '@/components/MenuItem';
import { useProfile } from '@/hooks/useProfile';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

export const SettingsMenu: React.FC = () => {
  const router = useRouter();
  const { data: profile } = useProfile();

  if (profile?.userType !== 'admin') return null;

  return (
    <View className="mt-4">
      <View className="px-4 pb-2">
        <Text className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
          Settings
        </Text>
      </View>

      <MenuItem
        icon="people-outline"
        text="User Management"
        subtitle="Customers, admins & managers"
        onPress={() => router.push('/users')}
      />
      <MenuItem
        icon="color-palette-outline"
        text="Brand Settings"
        subtitle="Logo, favicon & login image"
        onPress={() => router.push('/settings/brand-settings')}
      />
      <MenuItem
        icon="storefront-outline"
        text="Shop Settings"
        subtitle="Delivery charge & VAT"
        onPress={() => router.push('/settings/shop-settings')}
      />
      <MenuItem
        icon="location-outline"
        text="Store Location"
        subtitle="Manage store branches"
        onPress={() => router.push('/settings/store-location')}
      />
      <MenuItem
        icon="search-outline"
        text="Website SEO"
        subtitle="Meta tags & tracking pixels"
        onPress={() => router.push('/settings/website-seo')}
      />
      <MenuItem
        icon="options-outline"
        text="Others"
        subtitle="Contact links & page content"
        onPress={() => router.push('/settings/others-settings')}
      />
    </View>
  );
};
