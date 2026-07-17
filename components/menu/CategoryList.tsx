import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCategories, useDeleteCategory } from '@/hooks/useMenu';
import { useAuthStore } from '@/store/auth.store';
import { Category } from '@/types';
import { mediaUrl } from '@/utils/format';

export const CategoryList: React.FC = () => {
  const router = useRouter();
  const isManager = useAuthStore((s) => s.userType === 'manager');
  const [search, setSearch] = useState('');
  const { data: categories = [], isLoading } = useCategories(search);
  const deleteCategory = useDeleteCategory();

  const confirmDelete = (category: Category) => {
    Alert.alert('Delete Category', `Delete "${category.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteCategory.mutate(category.id),
      },
    ]);
  };

  return (
    <View className="px-4 py-5 gap-4">
      <View className="flex-row items-center gap-3">
        <View className="flex-1 flex-row items-center px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search categories"
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-2 text-gray-900 dark:text-white"
            style={{ padding: 0, fontSize: 15 }}
          />
        </View>
        {!isManager && (
          <TouchableOpacity
            onPress={() => router.push('/menu/category-form')}
            className="flex-row items-center px-3 py-2.5 rounded-xl bg-primary-600"
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={18} color="#FFF" />
            <Text className="text-white font-semibold text-sm ml-1">New</Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View className="items-center py-16">
          <ActivityIndicator size="large" color="#6FA25F" />
        </View>
      ) : categories.length === 0 ? (
        <View className="items-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
          <Ionicons name="grid-outline" size={32} color="#9CA3AF" />
          <Text className="text-gray-500 dark:text-gray-400 mt-2">
            No categories found.
          </Text>
        </View>
      ) : (
        <View className="gap-3">
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              activeOpacity={isManager ? 1 : 0.7}
              disabled={isManager}
              onPress={
                isManager
                  ? undefined
                  : () =>
                      router.push({
                        pathname: '/menu/category-form',
                        params: { id: String(category.id) },
                      })
              }
              className="flex-row items-center p-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <View className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 items-center justify-center">
                {category.icon ? (
                  <Image
                    source={{ uri: mediaUrl(category.icon) }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons name="image-outline" size={22} color="#9CA3AF" />
                )}
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-base font-semibold text-gray-900 dark:text-white capitalize">
                  {category.name}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {category.arabic_name || '—'} · {category.items ?? 0} item
                  {category.items === 1 ? '' : 's'}
                </Text>
              </View>
              {!isManager && (
                <TouchableOpacity
                  onPress={() => confirmDelete(category)}
                  hitSlop={8}
                  className="ml-2"
                >
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};
