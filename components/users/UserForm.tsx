import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { ImagePickerField } from '@/components/settings/ImagePickerField';
import { SectionHeading } from '@/components/settings/SectionHeading';
import { Button, Input } from '@/components/ui';
import { useManagedUser, useSaveUser } from '@/hooks/useUser';
import { ImageUpload, ManagedUserType, UserPayload } from '@/types';
import { convertImageToBase64 } from '@/utils/convertImgToBase64';
import { toast } from '@/utils/toast';

const COUNTRY_CODE = '+971';
const USER_TYPES: { key: ManagedUserType; label: string }[] = [
  { key: 'admin', label: 'Admin' },
  { key: 'manager', label: 'Manager' },
  { key: 'customer', label: 'Customer' },
];

const stripCode = (phone?: string | null): string =>
  (phone || '').replace(COUNTRY_CODE, '');

export const UserForm: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const userId = id ? Number(id) : undefined;

  const { data: user, isLoading } = useManagedUser(userId);
  const saveUser = useSaveUser();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [userType, setUserType] = useState<ManagedUserType | ''>('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState<ImageUpload | null>(null);

  useEffect(() => {
    if (!user) return;
    setFirstName(user.first_name || '');
    setLastName(user.last_name || '');
    setEmail(user.email || '');
    setPhone(stripCode(user.phoneNumber));
    setUserType(user.userType || '');
  }, [user]);

  const handleSave = async () => {
    if (!firstName.trim()) return toast.error('First name is required.');
    if (!lastName.trim()) return toast.error('Last name is required.');
    if (!email.trim()) return toast.error('Email is required.');
    if (!phone.trim()) return toast.error('Phone number is required.');
    if (!userType) return toast.error('User type is required.');
    if (!userId && !password.trim())
      return toast.error('Password is required.');
    if (!userId && !image) return toast.error('Profile image is required.');

    const payload: UserPayload = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      phoneNumber: `${COUNTRY_CODE}${phone.trim()}`,
      countryCode: COUNTRY_CODE,
      userType,
    };

    if (!userId && password.trim()) payload.password = password.trim();
    // Only send the image when a new one was picked (backend expects base64).
    if (image) payload.image = await convertImageToBase64(image.uri);

    try {
      await saveUser.mutateAsync({ id: userId, payload });
      router.back();
    } catch {
      // handled by hook onError
    }
  };

  if (userId && isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-16">
        <ActivityIndicator size="large" color="#6FA25F" />
      </View>
    );
  }

  return (
    <View className="px-4 py-5 gap-4">
      <SectionHeading title={userId ? 'Edit User' : 'New User'} />

      <View className="flex-row gap-3">
        <View className="flex-1">
          <Input
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First name"
          />
        </View>
        <View className="flex-1">
          <Input
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last name"
          />
        </View>
      </View>

      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Email address"
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon="mail-outline"
      />

      {/* Phone with fixed country code */}
      <View>
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Phone Number
        </Text>
        <View className="flex-row items-center gap-2">
          <View className="px-3 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800">
            <Text className="text-base text-gray-700 dark:text-gray-200">
              {COUNTRY_CODE}
            </Text>
          </View>
          <View className="flex-1">
            <Input
              value={phone}
              onChangeText={setPhone}
              placeholder="50 123 4567"
              keyboardType="phone-pad"
            />
          </View>
        </View>
      </View>

      {!userId && (
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          secureTextEntry
          autoCapitalize="none"
          leftIcon="lock-closed-outline"
        />
      )}

      {/* User type */}
      <View>
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          User Type
        </Text>
        <View className="flex-row bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {USER_TYPES.map((t) => (
            <TouchableOpacity
              key={t.key}
              onPress={() => setUserType(t.key)}
              className={`flex-1 py-2 rounded-lg items-center ${
                userType === t.key ? 'bg-white dark:bg-gray-700' : ''
              }`}
              activeOpacity={0.8}
            >
              <Text
                className={`text-sm font-semibold ${
                  userType === t.key
                    ? 'text-primary-600 dark:text-primary-300'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ImagePickerField
        label="Profile Image"
        defaultImage={user?.profile_image}
        value={image}
        onPick={setImage}
        aspect={[1, 1]}
      />

      <Button onPress={handleSave} loading={saveUser.isPending}>
        <Text className="text-white font-semibold text-base">
          {userId ? 'Update' : 'Create'}
        </Text>
      </Button>
    </View>
  );
};
