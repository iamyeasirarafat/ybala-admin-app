import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { MenuItem } from '@/components/MenuItem';
import { Screen } from '@/components/Screen';
import { SectionHeading } from '@/components/settings';

export default function WebsiteSeoScreen() {
  const router = useRouter();

  return (
    <Screen scroll>
      <View className="px-4 pt-5 pb-2">
        <SectionHeading
          title="Website SEO"
          description="Control search engine metadata and tracking pixels"
        />
      </View>
      <MenuItem
        icon="document-text-outline"
        text="Page SEO"
        subtitle="Meta tags for each public page"
        onPress={() => router.push('/settings/page-seo')}
      />
      <MenuItem
        icon="analytics-outline"
        text="Pixels"
        subtitle="Meta pixel & conversion tracking"
        onPress={() => router.push('/settings/pixels')}
      />
    </Screen>
  );
}
