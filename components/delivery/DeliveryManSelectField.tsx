import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Avatar } from '@/components/ui';
import { useDeliveryProfiles } from '@/hooks/useDelivery';
import { useUsers } from '@/hooks/useUser';
import { DeliveryManProfile, ManagedUser } from '@/types';
import { mediaUrl } from '@/utils/format';
import { riderMeta, vehicleLabel } from './deliveryStatus';

interface DeliveryManSelectFieldProps {
  label?: string;
  value: ManagedUser | null;
  onChange: (rider: ManagedUser | null) => void;
  placeholder?: string;
}

/**
 * Searchable rider picker. The search is server-side — `/user/` matches
 * full_name, email and phoneNumber — so typing a phone number or a name both
 * work. Profiles are fetched separately and joined by user id purely to show
 * availability; a rider whose profile row is missing is still selectable,
 * because the assignment endpoint only requires userType='delivery_man'.
 */
export const DeliveryManSelectField: React.FC<DeliveryManSelectFieldProps> = ({
  label = 'Delivery Man',
  value,
  onChange,
  placeholder = 'Select a delivery man',
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { data, isFetching } = useUsers({
    search,
    userType: 'delivery_man',
    limit: 50,
  });
  const { data: profiles = [] } = useDeliveryProfiles();

  const profileByUser = useMemo(() => {
    const map = new Map<number, DeliveryManProfile>();
    profiles.forEach((p) => map.set(p.user, p));
    return map;
  }, [profiles]);

  // Available riders first, then on-duty, so the usable ones are reachable
  // without scrolling past everyone who is mid-delivery or off shift.
  const riders = useMemo(() => {
    const rank = (user: ManagedUser) => {
      const profile = profileByUser.get(user.id);
      if (!profile) return 2;
      if (profile.current_status === 'idle') return 0;
      if (profile.is_on_duty) return 1;
      return 3;
    };
    return [...(data?.results ?? [])].sort((a, b) => rank(a) - rank(b));
  }, [data?.results, profileByUser]);

  return (
    <View>
      {!!label && (
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </Text>
      )}
      <TouchableOpacity
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
        className="flex-row items-center justify-between px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50"
      >
        <View className="flex-1 pr-2">
          <Text
            className={`text-base ${
              value ? 'text-gray-900 dark:text-white' : 'text-gray-400'
            }`}
            numberOfLines={1}
          >
            {value ? value.full_name || `Rider #${value.id}` : placeholder}
          </Text>
          {!!value?.phoneNumber && (
            <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {value.phoneNumber}
            </Text>
          )}
        </View>
        <View className="flex-row items-center">
          {!!value && (
            <TouchableOpacity
              onPress={() => onChange(null)}
              hitSlop={8}
              className="mr-2"
            >
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
          <Ionicons name="chevron-down" size={20} color="#6B7280" />
        </View>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white dark:bg-gray-800 rounded-t-3xl pb-8 max-h-[80%]">
            <View className="flex-row justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
              <Text className="text-lg font-bold text-gray-900 dark:text-white">
                Select Delivery Man
              </Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Ionicons name="close" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <View className="px-5 py-3">
              <View className="flex-row items-center px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <Ionicons name="search" size={18} color="#9CA3AF" />
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search by name or phone number"
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 ml-2 text-gray-900 dark:text-white"
                  style={{ padding: 0, fontSize: 15 }}
                  autoCorrect={false}
                />
                {isFetching && <ActivityIndicator size="small" color="#6FA25F" />}
              </View>
            </View>

            {isFetching && riders.length === 0 ? (
              <ActivityIndicator size="small" color="#6FA25F" className="py-6" />
            ) : (
              <FlatList
                data={riders}
                keyExtractor={(u) => String(u.id)}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={
                  <Text className="text-center text-gray-500 py-6">
                    No delivery man found.
                  </Text>
                }
                renderItem={({ item }) => {
                  const profile = profileByUser.get(item.id);
                  const meta = profile ? riderMeta(profile.current_status) : null;
                  const active = value?.id === item.id;
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        onChange(item);
                        setOpen(false);
                      }}
                      className="flex-row items-center px-5 py-3 border-b border-gray-100 dark:border-gray-700"
                      activeOpacity={0.7}
                    >
                      <Avatar
                        size="md"
                        source={mediaUrl(item.profile_image)}
                        initials={item.full_name?.charAt(0).toUpperCase()}
                      />
                      <View className="flex-1 ml-3">
                        <Text
                          className="text-base text-gray-900 dark:text-white"
                          numberOfLines={1}
                        >
                          {item.full_name || `Rider #${item.id}`}
                        </Text>
                        <Text className="text-xs text-gray-500 dark:text-gray-400">
                          {item.phoneNumber || item.email || `#${item.id}`}
                          {profile ? ` · ${vehicleLabel(profile.vehicle_type)}` : ''}
                        </Text>
                      </View>
                      {meta ? (
                        <View className={`px-2 py-0.5 rounded-full ${meta.bg}`}>
                          <Text className={`text-[10px] font-semibold ${meta.text}`}>
                            {meta.label}
                          </Text>
                        </View>
                      ) : (
                        <View className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">
                          <Text className="text-[10px] font-semibold text-gray-500 dark:text-gray-300">
                            No profile
                          </Text>
                        </View>
                      )}
                      {active && (
                        <Ionicons
                          name="checkmark"
                          size={20}
                          color="#6FA25F"
                          style={{ marginLeft: 8 }}
                        />
                      )}
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
