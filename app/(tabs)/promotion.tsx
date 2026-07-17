import { MenuItem } from '@/components/MenuItem';
import { Screen } from '@/components/Screen';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

export default function PromotionScreen() {
  const router = useRouter();

  return (
    <Screen scroll>

      <View>
        <MenuItem
          icon="pricetag-outline"
          text="Promo Code"
          subtitle="Create & manage discount coupons"
          onPress={() => router.push('/promotion/promo-code')}
        />
        <MenuItem
          icon="images-outline"
          text="Promo Banner"
          subtitle="Home slider, header & popup banners"
          onPress={() => router.push('/promotion/promo-banner')}
        />
      </View>
    </Screen>
  );
}
