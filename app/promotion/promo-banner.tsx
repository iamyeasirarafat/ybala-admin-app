import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { MenuItem } from '@/components/MenuItem';
import { Screen } from '@/components/Screen';
import { SectionHeading } from '@/components/settings';

export default function PromoBannerHub() {
  const router = useRouter();

  return (
    <Screen scroll>
      <View className="px-4 pt-5 pb-2">
        <SectionHeading
          title="Promo Banner"
          description="Manage storefront banners and the home page slider"
        />
      </View>
      <MenuItem
        icon="albums-outline"
        text="Home Page Slider"
        subtitle="Dynamic rotating banners"
        onPress={() => router.push('/promotion/home-slider')}
      />
      <MenuItem
        icon="tv-outline"
        text="Header Banner"
        subtitle="Desktop storefront header"
        onPress={() => router.push('/promotion/header-banner')}
      />
      <MenuItem
        icon="phone-portrait-outline"
        text="Mobile Header Banner"
        subtitle="Mobile storefront header"
        onPress={() => router.push('/promotion/mobile-header-banner')}
      />
      <MenuItem
        icon="tablet-portrait-outline"
        text="Popup Banner"
        subtitle="Popup shown to visitors"
        onPress={() => router.push('/promotion/popup-banner')}
      />
    </Screen>
  );
}
