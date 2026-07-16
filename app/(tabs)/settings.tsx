import { Screen } from '@/components/Screen';
import {
  LogoutButton,
  PreferenceToggle,
  ProfileHeader,
  SettingsMenu
} from '@/components/settings';

export default function AccountScreen() {
  return (
    <Screen scroll>
      <ProfileHeader />
      <SettingsMenu />
      <PreferenceToggle />
      <LogoutButton />
    </Screen>
  );
}
