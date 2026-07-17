import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useMenus } from '@/hooks/useMenu';
import { AddCartPayload, MenuItem, OrderVariant } from '@/types';
import { formatCurrency, mediaUrl } from '@/utils/format';

interface MenuAddSectionProps {
  disabled?: boolean;
  adding?: boolean;
  onAdd: (payload: Omit<AddCartPayload, 'created_by' | 'user'>) => void;
}

const getVariations = (menu: MenuItem): OrderVariant[] => {
  const groups = menu.translations?.en?.type ?? [];
  return groups.flatMap((g) => g.variation ?? []);
};

export const MenuAddSection: React.FC<MenuAddSectionProps> = ({
  disabled,
  adding,
  onAdd,
}) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [variation, setVariation] = useState<OrderVariant | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { data, isFetching } = useMenus({ search, limit: 50, available: true });
  const menus = data?.results ?? [];

  const variations = useMemo(
    () => (selectedMenu ? getVariations(selectedMenu) : []),
    [selectedMenu],
  );

  const unitPrice = selectedMenu
    ? selectedMenu.type === 'variation'
      ? Number(variation?.price ?? 0)
      : Number(selectedMenu.price ?? 0)
    : 0;

  const pickMenu = (menu: MenuItem) => {
    setSelectedMenu(menu);
    setVariation(null);
    setQuantity(1);
    setPickerOpen(false);
  };

  const canAdd =
    !!selectedMenu &&
    (selectedMenu.type === 'simple' || !!variation) &&
    quantity > 0;

  const handleAdd = () => {
    if (!selectedMenu || !canAdd) return;
    onAdd({
      menu: selectedMenu.id,
      quantity,
      price: unitPrice,
      variant:
        selectedMenu.type === 'variation' && variation ? variation : undefined,
    });
    setSelectedMenu(null);
    setVariation(null);
    setQuantity(1);
  };

  return (
    <View className="gap-3">
      <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Add Items
      </Text>

      <TouchableOpacity
        onPress={() => !disabled && setPickerOpen(true)}
        activeOpacity={0.7}
        disabled={disabled}
        className={`flex-row items-center justify-between px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 ${
          disabled ? 'opacity-50' : ''
        }`}
      >
        <Text
          className={`text-base ${
            selectedMenu ? 'text-gray-900 dark:text-white' : 'text-gray-400'
          }`}
        >
          {selectedMenu
            ? selectedMenu.translations?.en?.name || 'Selected item'
            : disabled
              ? 'Select a customer first'
              : 'Select a menu item'}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#6B7280" />
      </TouchableOpacity>

      {/* Variation chips */}
      {selectedMenu?.type === 'variation' && (
        <View className="gap-2">
          <Text className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Choose variation
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {variations.length === 0 ? (
              <Text className="text-xs text-gray-400">
                No variations configured.
              </Text>
            ) : (
              variations.map((v) => {
                const active = variation?.name === v.name;
                return (
                  <TouchableOpacity
                    key={v.name}
                    onPress={() => setVariation(v)}
                    className={`px-3 py-1.5 rounded-lg border ${
                      active
                        ? 'bg-primary-600 border-primary-600'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                    }`}
                    activeOpacity={0.8}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        active
                          ? 'text-white'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {v.name} · {formatCurrency(Number(v.price))}
                    </Text>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </View>
      )}

      {/* Quantity + add */}
      {selectedMenu && (
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 items-center justify-center"
            >
              <Ionicons name="remove" size={18} color="#6B7280" />
            </TouchableOpacity>
            <Text className="text-base font-semibold text-gray-900 dark:text-white w-6 text-center">
              {quantity}
            </Text>
            <TouchableOpacity
              onPress={() => setQuantity((q) => q + 1)}
              className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 items-center justify-center"
            >
              <Ionicons name="add" size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleAdd}
            disabled={!canAdd || adding}
            className={`flex-row items-center px-4 py-2.5 rounded-xl bg-primary-600 ${
              !canAdd || adding ? 'opacity-50' : ''
            }`}
            activeOpacity={0.85}
          >
            {adding ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <>
                <Ionicons name="cart" size={16} color="#FFF" />
                <Text className="text-white font-semibold text-sm ml-1.5">
                  Add {formatCurrency(unitPrice * quantity)}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Menu picker modal */}
      <Modal
        visible={pickerOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerOpen(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white dark:bg-gray-800 rounded-t-3xl pb-8 max-h-[80%]">
            <View className="flex-row justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
              <Text className="text-lg font-bold text-gray-900 dark:text-white">
                Select Item
              </Text>
              <TouchableOpacity onPress={() => setPickerOpen(false)}>
                <Ionicons name="close" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <View className="px-5 py-3">
              <View className="flex-row items-center px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <Ionicons name="search" size={18} color="#9CA3AF" />
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search food items"
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 ml-2 text-gray-900 dark:text-white"
                  style={{ padding: 0, fontSize: 15 }}
                />
              </View>
            </View>

            {isFetching && menus.length === 0 ? (
              <ActivityIndicator size="small" color="#6FA25F" className="py-6" />
            ) : (
              <FlatList
                data={menus}
                keyExtractor={(m) => String(m.id)}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={
                  <Text className="text-center text-gray-500 py-6">
                    No items found.
                  </Text>
                }
                renderItem={({ item }) => {
                  const priceLabel =
                    item.type === 'simple'
                      ? formatCurrency(Number(item.price ?? 0))
                      : 'Variation';
                  return (
                    <TouchableOpacity
                      onPress={() => pickMenu(item)}
                      className="flex-row items-center px-5 py-3 border-b border-gray-100 dark:border-gray-700"
                    >
                      <View className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 items-center justify-center mr-3">
                        {item.image ? (
                          <Image
                            source={{ uri: mediaUrl(item.image) }}
                            className="w-full h-full"
                            resizeMode="cover"
                          />
                        ) : (
                          <Ionicons
                            name="fast-food-outline"
                            size={18}
                            color="#9CA3AF"
                          />
                        )}
                      </View>
                      <View className="flex-1">
                        <Text className="text-base text-gray-900 dark:text-white">
                          {item.translations?.en?.name || 'Unnamed'}
                        </Text>
                        <Text className="text-xs text-gray-500 dark:text-gray-400">
                          {priceLabel}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};
