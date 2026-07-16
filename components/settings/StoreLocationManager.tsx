import { StoreList } from '@/components/settings';
import { useStoreLocations } from '@/hooks/useSettings';
import { StoreLocation } from '@/types';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

export const StoreLocationManager: React.FC = () => {
  const { data: stores = [], isLoading } = useStoreLocations();
  const router = useRouter();

  const openEdit = (store: StoreLocation) =>
    router.push({
      pathname: '/settings/store-form',
      params: { id: String(store.id) },
    });

  const openCreate = () => router.push('/settings/store-form');

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-16">
        <ActivityIndicator size="large" color="#6FA25F" />
      </View>
    );
  }

  return (
    <View className="px-4 py-5 gap-5">
      <StoreList stores={stores} onSelect={openEdit} onAddNew={openCreate} />
    </View>
  );
};
