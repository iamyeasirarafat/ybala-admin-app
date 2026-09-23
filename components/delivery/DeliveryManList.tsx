import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Avatar } from '@/components/ui';
import { useDeliveryProfiles } from '@/hooks/useDelivery';
import { useUsers } from '@/hooks/useUser';
import { DeliveryManProfile } from '@/types';
import { mediaUrl } from '@/utils/format';
import { riderMeta, vehicleLabel } from './deliveryStatus';

const PAGE_SIZE = 15;

/**
 * Rider roster. Driven by the user list (server-side search over name, email
 * and phone) rather than the profile list, so a delivery_man account created
 * through the generic user form still shows up — flagged as incomplete until
 * its DeliveryManProfile exists.
 */
export const DeliveryManList: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(PAGE_SIZE);

  const { data, isLoading, isFetching } = useUsers({
    search,
    userType: 'delivery_man',
    limit,
  });
  const { data: profiles = [] } = useDeliveryProfiles();

  const profileByUser = useMemo(() => {
    const map = new Map<number, DeliveryManProfile>();
    profiles.forEach((p) => map.set(p.user, p));
    return map;
  }, [profiles]);

  const riders = data?.results ?? [];
  const total = data?.count ?? 0;
  const canLoadMore = riders.length < total;

  const onSearch = (value: string) => {
    setSearch(value);
    setLimit(PAGE_SIZE);
  };

  return (
    <View className="px-4 py-5 gap-4">
      <View className="flex-row items-center gap-3">
        <View className="flex-1 flex-row items-center px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput
            value={search}
            onChangeText={onSearch}
            placeholder="Search by name or phone number"
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-2 text-gray-900 dark:text-white"
            style={{ padding: 0, fontSize: 15 }}
            autoCorrect={false}
          />
        </View>
        <TouchableOpacity
          onPress={() => router.push('/delivery/delivery-man-form')}
          className="flex-row items-center px-3 py-2.5 rounded-xl bg-primary-600"
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={18} color="#FFF" />
          <Text className="text-white font-semibold text-sm ml-1">Add</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View className="items-center py-16">
          <ActivityIndicator size="large" color="#6FA25F" />
        </View>
      ) : riders.length === 0 ? (
        <View className="items-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
          <Ionicons name="bicycle-outline" size={32} color="#9CA3AF" />
          <Text className="text-gray-500 dark:text-gray-400 mt-2">
            No delivery man found.
          </Text>
        </View>
      ) : (
        <View className="gap-3">
          {riders.map((rider) => {
            const profile = profileByUser.get(rider.id);
            const meta = profile ? riderMeta(profile.current_status) : null;
            return (
              <TouchableOpacity
                key={rider.id}
                activeOpacity={0.7}
                onPress={() =>
                  router.push({
                    pathname: '/delivery/delivery-man-form',
                    params: {
                      userId: String(rider.id),
                      ...(profile ? { profileId: String(profile.id) } : {}),
                    },
                  })
                }
                className="flex-row items-center p-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <Avatar
                  size="md"
                  source={mediaUrl(rider.profile_image)}
                  initials={rider.full_name?.charAt(0).toUpperCase()}
                />
                <View className="flex-1 ml-3">
                  <Text
                    className="text-base font-semibold text-gray-900 dark:text-white"
                    numberOfLines={1}
                  >
                    {rider.full_name || 'Unnamed'}
                  </Text>
                  <Text
                    className="text-xs text-gray-500 dark:text-gray-400 mt-0.5"
                    numberOfLines={1}
                  >
                    {rider.phoneNumber || rider.email || `#${rider.id}`}
                    {profile ? ` · ${vehicleLabel(profile.vehicle_type)}` : ''}
                  </Text>
                </View>
                {meta ? (
                  <View className="items-end">
                    <View className={`px-2 py-0.5 rounded-full ${meta.bg}`}>
                      <Text className={`text-[10px] font-semibold ${meta.text}`}>
                        {meta.label}
                      </Text>
                    </View>
                    {profile?.is_on_duty && (
                      <Text className="text-[10px] text-gray-400 mt-0.5">
                        On duty
                      </Text>
                    )}
                  </View>
                ) : (
                  <View className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900">
                    <Text className="text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                      Setup needed
                    </Text>
                  </View>
                )}
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
