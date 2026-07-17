import { Screen } from '@/components/Screen';
import { BannerForm } from '@/components/promotion';

export default function PopupBannerScreen() {
  return (
    <Screen scroll>
      <BannerForm
        type="popup"
        title="Popup Banner"
        subtitle="Appears as a popup after visitors land on the site"
      />
    </Screen>
  );
}
