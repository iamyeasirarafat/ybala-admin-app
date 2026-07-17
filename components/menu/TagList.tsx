import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDeleteTag, useTags } from '@/hooks/useMenu';
import { Tag } from '@/types';

export const TagList: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const { data: tags = [], isLoading } = useTags(search);
  const deleteTag = useDeleteTag();

  const confirmDelete = (tag: Tag) => {
    Alert.alert('Delete Tag', `Delete "${tag.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteTag.mutate(tag.id),
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
            placeholder="Search tags"
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-2 text-gray-900 dark:text-white"
            style={{ padding: 0, fontSize: 15 }}
          />
        </View>
        <TouchableOpacity
          onPress={() => router.push('/menu/tag-form')}
          className="flex-row items-center px-3 py-2.5 rounded-xl bg-primary-600"
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={18} color="#FFF" />
          <Text className="text-white font-semibold text-sm ml-1">New</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View className="items-center py-16">
          <ActivityIndicator size="large" color="#6FA25F" />
        </View>
      ) : tags.length === 0 ? (
        <View className="items-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
          <Ionicons name="pricetag-outline" size={32} color="#9CA3AF" />
          <Text className="text-gray-500 dark:text-gray-400 mt-2">
            No tags found.
          </Text>
        </View>
      ) : (
        <View className="gap-3">
          {tags.map((tag) => (
            <TouchableOpacity
              key={tag.id}
              activeOpacity={0.7}
              onPress={() =>
                router.push({
                  pathname: '/menu/tag-form',
                  params: { id: String(tag.id) },
                })
              }
              className="flex-row items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 dark:text-white capitalize">
                  {tag.name}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {tag.items ?? 0} item{tag.items === 1 ? '' : 's'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => confirmDelete(tag)} hitSlop={8}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};
