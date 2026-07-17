import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SingleSelectField } from '@/components/menu/SingleSelectField';
import { useCategoryOptions, useDeleteMenu, useMenus } from '@/hooks/useMenu';
import { MenuItem } from '@/types';
import { mediaUrl } from '@/utils/format';

const PAGE_SIZE = 15;

const AVAIL_TABS: { key: string; label: string; value?: boolean }[] = [
  { key: 'all', label: 'All' },
  { key: 'available', label: 'Available', value: true },
  { key: 'unavailable', label: 'Unavailable', value: false },
];

interface MenuRowProps {
  item: MenuItem;
  onEdit: (id: number) => void;
  onDelete: (item: MenuItem) => void;
}

const MenuRow = React.memo(({ item, onEdit, onDelete }: MenuRowProps) => {
  const priceLabel =
    item.type === 'simple' ? `${item.price ?? 0} AED` : 'Variation';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onEdit(item.id)}
      className="flex-row items-center p-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 mb-3"
    >
      <View className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 items-center justify-center">
        {item.image ? (
          <Image
            source={{ uri: mediaUrl(item.image) }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <Ionicons name="image-outline" size={22} color="#9CA3AF" />
        )}
      </View>
      <View className="flex-1 ml-3">
        <Text
          className="text-base font-semibold text-gray-900 dark:text-white"
          numberOfLines={1}
        >
          {item.translations?.en?.name || 'Unnamed'}
        </Text>
        <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {item.category_data?.name || 'No category'} · {priceLabel}
        </Text>
      </View>
      <View
        className={`px-2 py-0.5 rounded-full mr-2 ${
          item.available
            ? 'bg-green-100 dark:bg-green-900'
            : 'bg-gray-100 dark:bg-gray-700'
        }`}
      >
        <Text
          className={`text-[10px] font-semibold ${
            item.available
              ? 'text-green-700 dark:text-green-300'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {item.available ? 'Active' : 'Off'}
        </Text>
      </View>
      <TouchableOpacity onPress={() => onDelete(item)} hitSlop={8}>
        <Ionicons name="trash-outline" size={20} color="#EF4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
});
MenuRow.displayName = 'MenuRow';

export const MenuList: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [availability, setAvailability] = useState('all');
  const [category, setCategory] = useState<number | null>(null);
  const [limit, setLimit] = useState(PAGE_SIZE);

  const { data: categoryOptions = [] } = useCategoryOptions();
  const availValue = AVAIL_TABS.find((t) => t.key === availability)?.value;

  const { data, isLoading, isFetching } = useMenus({
    search,
    available: availValue,
    category: category ?? undefined,
    limit,
  });
  const deleteMenu = useDeleteMenu();

  const menus = data?.results ?? [];
  const total = data?.count ?? 0;
  const canLoadMore = menus.length < total;

  const resetPage = () => setLimit(PAGE_SIZE);

  const onEdit = useCallback(
    (id: number) =>
      router.push({ pathname: '/menu/menu-form', params: { id: String(id) } }),
    [router],
  );

  const onDelete = useCallback(
    (item: MenuItem) => {
      const name = item.translations?.en?.name || 'this item';
      Alert.alert('Delete Menu', `Delete "${name}"?`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMenu.mutate(item.id),
        },
      ]);
    },
    [deleteMenu],
  );

  const loadMore = useCallback(() => {
    if (canLoadMore && !isFetching) setLimit((l) => l + PAGE_SIZE);
  }, [canLoadMore, isFetching]);

  const renderItem = useCallback(
    ({ item }: { item: MenuItem }) => (
      <MenuRow item={item} onEdit={onEdit} onDelete={onDelete} />
    ),
    [onEdit, onDelete],
  );

  const header = useMemo(
    () => (
      <View className="gap-4 pb-3">
        {/* Search + add */}
        <View className="flex-row items-center gap-3">
          <View className="flex-1 flex-row items-center px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
            <Ionicons name="search" size={18} color="#9CA3AF" />
            <TextInput
              value={search}
              onChangeText={(v) => {
                setSearch(v);
                resetPage();
              }}
              placeholder="Search food items"
              placeholderTextColor="#9CA3AF"
              className="flex-1 ml-2 text-gray-900 dark:text-white"
              style={{ padding: 0, fontSize: 15 }}
            />
          </View>
          <TouchableOpacity
            onPress={() => router.push('/menu/menu-form')}
            className="flex-row items-center px-3 py-2.5 rounded-xl bg-primary-600"
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={18} color="#FFF" />
            <Text className="text-white font-semibold text-sm ml-1">New</Text>
          </TouchableOpacity>
        </View>

        {/* Availability filter */}
        <View className="flex-row bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {AVAIL_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => {
                setAvailability(tab.key);
                resetPage();
              }}
              className={`flex-1 py-2 rounded-lg items-center ${
                availability === tab.key ? 'bg-white dark:bg-gray-700' : ''
              }`}
              activeOpacity={0.8}
            >
              <Text
                className={`text-xs font-semibold ${
                  availability === tab.key
                    ? 'text-primary-600 dark:text-primary-300'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Category filter */}
        <SingleSelectField
          label="Filter by Category"
          options={categoryOptions}
          value={category}
          onChange={(id) => {
            setCategory(id);
            resetPage();
          }}
          placeholder="All categories"
        />
      </View>
    ),
    [search, availability, category, categoryOptions, router],
  );

  const footer = useMemo(() => {
    if (isLoading) return null;
    if (canLoadMore) {
      return (
        <TouchableOpacity
          onPress={loadMore}
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
      );
    }
    return null;
  }, [isLoading, canLoadMore, isFetching, loadMore]);

  const empty = useMemo(() => {
    if (isLoading) {
      return (
        <View className="items-center py-16">
          <ActivityIndicator size="large" color="#6FA25F" />
        </View>
      );
    }
    return (
      <View className="items-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
        <Ionicons name="fast-food-outline" size={32} color="#9CA3AF" />
        <Text className="text-gray-500 dark:text-gray-400 mt-2">
          No menu items found.
        </Text>
      </View>
    );
  }, [isLoading]);

  return (
    <FlatList
      data={menus}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      ListHeaderComponent={header}
      ListFooterComponent={footer}
      ListEmptyComponent={empty}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20 }}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
      onEndReachedThreshold={0.4}
      onEndReached={loadMore}
      removeClippedSubviews
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={7}
    />
  );
};
