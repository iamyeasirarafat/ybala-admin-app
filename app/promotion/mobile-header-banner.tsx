import { Screen } from '@/components/Screen';
import { BannerForm } from '@/components/promotion';

export default function MobileHeaderBannerScreen() {
  return (
    <Screen scroll>
      <BannerForm
        type="mobile_header"
        title="Mobile Header Banner"
        subtitle="Shown at the top of the mobile storefront"
      />
    </Screen>
  );
}
