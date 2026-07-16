import { StoreForm } from '@/components/settings';
import { useStoreLocations } from '@/hooks/useSettings';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

export const StoreFormContainer: React.FC = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { data: stores = [], isLoading } = useStoreLocations();

  const selected = id ? stores.find((s) => s.id === Number(id)) ?? null : null;

  // Only block while we still need to resolve an existing store from cache/network
  if (id && isLoading && !selected) {
    return (
      <View className="flex-1 items-center justify-center py-16">
        <ActivityIndicator size="large" color="#6FA25F" />
      </View>
    );
  }

  return (
    <View className="px-4 py-5">
      <Stack.Screen options={{ title: selected ? 'Edit Store' : 'Add Store' }} />
      <StoreForm selected={selected} onDone={() => router.back()} />
    </View>
  );
};
