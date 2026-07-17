import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { MenuItem } from '@/components/MenuItem';
import { Screen } from '@/components/Screen';

export default function MenuScreen() {
  const router = useRouter();

  return (
    <Screen scroll>
      <View className="px-4 py-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          Menu
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage food items, categories and tags
        </Text>
      </View>

      <View>
        <MenuItem
          icon="fast-food-outline"
          text="Menu List"
          subtitle="Create & manage food items"
          onPress={() => router.push('/menu/menu-list')}
        />
        <MenuItem
          icon="grid-outline"
          text="Category"
          subtitle="Food categories with icon & banner"
          onPress={() => router.push('/menu/categories')}
        />
        <MenuItem
          icon="pricetag-outline"
          text="Tag"
          subtitle="Labels for food items"
          onPress={() => router.push('/menu/tags')}
        />
      </View>
    </Screen>
  );
}
