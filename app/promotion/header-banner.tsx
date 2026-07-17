import { Screen } from '@/components/Screen';
import { BannerForm } from '@/components/promotion';

export default function HeaderBannerScreen() {
  return (
    <Screen scroll>
      <BannerForm
        type="header"
        title="Header Banner"
        subtitle="Shown at the top of the desktop storefront"
      />
    </Screen>
  );
}
