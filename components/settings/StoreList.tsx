import { SectionHeading } from '@/components/settings/SectionHeading';
import { StoreLocation } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface StoreListProps {
  stores: StoreLocation[];
  selectedId?: number | null;
  onSelect: (store: StoreLocation) => void;
  onAddNew: () => void;
}

const managerLabel = (store: StoreLocation) => {
  const m = store.manager_data;
  if (!m) return 'No manager assigned';
  const name = `${m.first_name || ''} ${m.last_name || ''}`.trim();
  return name || m.email || 'Manager';
};

export const StoreList: React.FC<StoreListProps> = ({
  stores,
  selectedId,
  onSelect,
  onAddNew,
}) => {
  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <SectionHeading title="Store Locations" />
        <TouchableOpacity
          onPress={onAddNew}
          className="flex-row items-center px-3 py-2 rounded-lg bg-primary-600"
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={18} color="#FFF" />
          <Text className="text-white font-semibold text-sm ml-1">Add new</Text>
        </TouchableOpacity>
      </View>

      {stores.length === 0 ? (
        <View className="items-center py-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
          <Ionicons name="location-outline" size={32} color="#9CA3AF" />
          <Text className="text-gray-500 dark:text-gray-400 mt-2">
            No store locations yet.
          </Text>
        </View>
      ) : (
        stores.map((store) => {
          const isActive = selectedId === store.id;
          return (
            <TouchableOpacity
              key={store.id}
              onPress={() => onSelect(store)}
              activeOpacity={0.7}
              className={`flex-row items-center justify-between px-4 py-3 rounded-xl border ${
                isActive
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'
              }`}
            >
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 dark:text-white">
                  {store.en_title || store.ar_title || `Store #${store.id}`}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {managerLabel(store)}
                </Text>
              </View>
              <Ionicons name="create-outline" size={20} color="#6FA25F" />
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
};
