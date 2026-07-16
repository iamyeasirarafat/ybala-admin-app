import { Avatar } from '@/components/ui';
import { useProfile } from '@/hooks/useProfile';
import { mediaUrl } from '@/utils/format';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export const ProfileHeader: React.FC = () => {
  const router = useRouter();
  const { data: profile } = useProfile();
  const canEdit = profile?.userType === 'manager';
  const fullName =
    profile?.first_name && profile?.last_name
      ? `${profile.first_name} ${profile.last_name}`
      : profile?.first_name || profile?.email || 'Account';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => canEdit && router.push('/settings/account-info')}
      className="bg-white dark:bg-gray-800 px-6 py-5 border-b border-gray-100 dark:border-gray-700"
    >
      <View className="flex-row items-center">
        <Avatar
          size="lg"
          source={mediaUrl(profile?.profile_image)}
          initials={profile?.first_name?.charAt(0).toUpperCase()}
          backgroundColor="bg-primary-600 dark:bg-primary-500"
        />
        <View className="ml-4 flex-1">
          <Text className="text-xl font-bold text-gray-900 dark:text-white">
            {fullName}
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {profile?.email || profile?.phoneNumber || ''}
          </Text>
          <View className="self-start mt-2 px-2.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900">
            <Text className="text-xs font-semibold text-primary-700 dark:text-primary-300 capitalize">
              {profile?.userType === 'admin' ? 'Administrator' : 'Manager'}
            </Text>
          </View>
        </View>
        {canEdit && <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />}
      </View>
    </TouchableOpacity>
  );
};
