import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';
import { Button, Input } from '@/components/ui';
import { useProfile } from '@/hooks/useProfile';
import { useUpdateProfile } from '@/hooks/useUser';
import { convertImageToBase64 } from '@/utils/convertImgToBase64';
import { mediaUrl } from '@/utils/format';
import { toast } from '@/utils/toast';

export const AccountInfoForm: React.FC = () => {
  const router = useRouter();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();

  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName, setLastName] = useState(profile?.last_name || '');
  const [phone, setPhone] = useState(profile?.phoneNumber || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [profileImage, setProfileImage] = useState<string | undefined>(
    mediaUrl(profile?.profile_image),
  );

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        toast.error('Permission to access photos is required.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch {
      toast.error('Failed to pick image.');
    }
  };

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error('First and last name are required.');
      return;
    }

    try {
      const payload: {
        first_name: string;
        last_name: string;
        phoneNumber: string;
        email: string;
        image?: string;
      } = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phoneNumber: phone.trim(),
        email: email.trim(),
      };

      // Only send image when the user picked a new local file
      if (
        profileImage &&
        profileImage !== mediaUrl(profile?.profile_image) &&
        !profileImage.startsWith('http')
      ) {
        payload.image = await convertImageToBase64(profileImage);
      }

      await updateProfile.mutateAsync(payload);
      router.back();
    } catch {
      // handled by hook onError toast
    }
  };

  return (
    <View className="px-4 py-6">
      {/* Profile image */}
      <View className="items-center mb-6">
        <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
          <View className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 items-center justify-center">
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <Ionicons name="person" size={44} color="#9CA3AF" />
            )}
          </View>
          <View className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary-600 items-center justify-center border-2 border-white dark:border-gray-900">
            <Ionicons name="camera" size={16} color="#FFF" />
          </View>
        </TouchableOpacity>
        <Text className="text-sm text-gray-500 dark:text-gray-400 mt-3">
          Tap to change photo
        </Text>
      </View>

      <View className="gap-4">
        <Input
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
          placeholder="First name"
        />
        <Input
          label="Last Name"
          value={lastName}
          onChangeText={setLastName}
          placeholder="Last name"
        />
        <Input
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone number"
          keyboardType="phone-pad"
        />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Email address"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View className="mt-6">
        <Button onPress={handleSave} loading={updateProfile.isPending}>
          {updateProfile.isPending ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text className="text-white font-semibold text-base">
              Save Changes
            </Text>
          )}
        </Button>
      </View>
    </View>
  );
};
