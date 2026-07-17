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
import { Avatar } from '@/components/ui';
import { useDeleteUser, useUsers } from '@/hooks/useUser';
import { ManagedUser, ManagedUserType } from '@/types';
import { mediaUrl } from '@/utils/format';

const TYPE_TABS: { key: string; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'customer', label: 'Customer' },
  { key: 'admin', label: 'Admin' },
  { key: 'manager', label: 'Manager' },
];

const PAGE_SIZE = 15;

const typeBadge = (type: ManagedUserType) => {
  switch (type) {
    case 'admin':
      return 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300';
    case 'manager':
      return 'bg-secondary-100 dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300';
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
  }
};

export const UserList: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [userType, setUserType] = useState('all');
  const [limit, setLimit] = useState(PAGE_SIZE);

  const { data, isLoading, isFetching } = useUsers({
    search,
    userType,
    limit,
  });
  const deleteUser = useDeleteUser();

  const users = data?.results ?? [];
  const total = data?.count ?? 0;
  const canLoadMore = users.length < total;

  const onSearch = (v: string) => {
    setSearch(v);
    setLimit(PAGE_SIZE);
  };
  const onSelectType = (t: string) => {
    setUserType(t);
    setLimit(PAGE_SIZE);
  };

  const confirmDelete = (user: ManagedUser) => {
    const name =
      `${user.first_name || ''} ${user.last_name || ''}`.trim() ||
      user.email ||
      'this user';
    Alert.alert('Delete User', `Delete ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteUser.mutate(user.id),
      },
    ]);
  };

  return (
    <View className="px-4 py-5 gap-4">
      {/* Search + add */}
      <View className="flex-row items-center gap-3">
        <View className="flex-1 flex-row items-center px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput
            value={search}
            onChangeText={onSearch}
            placeholder="Search by name, email or phone"
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-2 text-gray-900 dark:text-white"
            style={{ padding: 0, fontSize: 15 }}
          />
        </View>
        <TouchableOpacity
          onPress={() => router.push('/users/user-form')}
          className="flex-row items-center px-3 py-2.5 rounded-xl bg-primary-600"
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={18} color="#FFF" />
          <Text className="text-white font-semibold text-sm ml-1">Add</Text>
        </TouchableOpacity>
      </View>

      {/* Type filter */}
      <View className="flex-row bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        {TYPE_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onSelectType(tab.key)}
            className={`flex-1 py-2 rounded-lg items-center ${
              userType === tab.key ? 'bg-white dark:bg-gray-700' : ''
            }`}
            activeOpacity={0.8}
          >
            <Text
              className={`text-xs font-semibold ${
                userType === tab.key
                  ? 'text-primary-600 dark:text-primary-300'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View className="items-center py-16">
          <ActivityIndicator size="large" color="#6FA25F" />
        </View>
      ) : users.length === 0 ? (
        <View className="items-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
          <Ionicons name="people-outline" size={32} color="#9CA3AF" />
          <Text className="text-gray-500 dark:text-gray-400 mt-2">
            No users found.
          </Text>
        </View>
      ) : (
        <View className="gap-3">
          {users.map((user) => {
            const name =
              `${user.first_name || ''} ${user.last_name || ''}`.trim() ||
              'Unnamed';
            return (
              <TouchableOpacity
                key={user.id}
                activeOpacity={0.7}
                onPress={() =>
                  router.push({
                    pathname: '/users/user-form',
                    params: { id: String(user.id) },
                  })
                }
                className="flex-row items-center p-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <Avatar
                  size="md"
                  source={mediaUrl(user.profile_image)}
                  initials={user.first_name?.charAt(0).toUpperCase()}
                />
                <View className="flex-1 ml-3">
                  <View className="flex-row items-center gap-2">
                    <Text
                      className="text-base font-semibold text-gray-900 dark:text-white"
                      numberOfLines={1}
                    >
                      {name}
                    </Text>
                    <View className={`px-2 py-0.5 rounded-full ${typeBadge(user.userType)}`}>
                      <Text className={`text-[10px] font-semibold capitalize ${typeBadge(user.userType)}`}>
                        {user.userType}
                      </Text>
                    </View>
                  </View>
                  <Text
                    className="text-xs text-gray-500 dark:text-gray-400 mt-0.5"
                    numberOfLines={1}
                  >
                    {user.email || user.phoneNumber || '—'}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => confirmDelete(user)}
                  hitSlop={8}
                  className="ml-2"
                >
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}

          {canLoadMore && (
            <TouchableOpacity
              onPress={() => setLimit((l) => l + PAGE_SIZE)}
              disabled={isFetching}
              className="flex-row items-center justify-center py-3"
              activeOpacity={0.7}
            >
              {isFetching ? (
                <ActivityIndicator size="small" color="#6FA25F" />
              ) : (
                <>
                  <Text className="text-sm font-semibold text-primary-600 dark:text-primary-400 mr-1">
                    Load more
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#6FA25F" />
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};
