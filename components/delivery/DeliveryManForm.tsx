import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { SingleSelectField } from '@/components/menu/SingleSelectField';
import { ImagePickerField } from '@/components/settings/ImagePickerField';
import { SectionHeading } from '@/components/settings/SectionHeading';
import { Button, Input } from '@/components/ui';
import { useDeliveryProfile, useSaveDeliveryProfile } from '@/hooks/useDelivery';
import { useStoreLocations } from '@/hooks/useSettings';
import { useManagedUser, useSaveUser } from '@/hooks/useUser';
import { useAuthStore } from '@/store/auth.store';
import { ImageUpload, UserPayload, VehicleType } from '@/types';
import { convertImageToBase64 } from '@/utils/convertImgToBase64';
import { toast } from '@/utils/toast';
import { DeliveryManStats } from './DeliveryManStats';
import { VEHICLE_TYPES } from './deliveryStatus';

const COUNTRY_CODE = '+971';

const stripCode = (phone?: string | null): string =>
  (phone || '').replace(COUNTRY_CODE, '');

/**
 * Creates or edits a rider. A rider is two records — the `delivery_man` user
 * account and its DeliveryManProfile (vehicle + store) — so this form saves
 * both in sequence. An existing account that has no profile yet (created
 * through the generic user form) is completed here rather than duplicated.
 */
export const DeliveryManForm: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ userId?: string; profileId?: string }>();
  const userId = params.userId ? Number(params.userId) : undefined;
  const profileId = params.profileId ? Number(params.profileId) : undefined;
  const isAdmin = useAuthStore((s) => s.userType) === 'admin';

  const { data: user, isLoading: loadingUser } = useManagedUser(userId);
  const { data: profile, isLoading: loadingProfile } =
    useDeliveryProfile(profileId);
  const { data: storeLocations = [] } = useStoreLocations();

  const saveUser = useSaveUser();
  const saveProfile = useSaveDeliveryProfile();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState<ImageUpload | null>(null);
  const [vehicleType, setVehicleType] = useState<VehicleType>('bike');
  const [plate, setPlate] = useState('');
  const [storeId, setStoreId] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    setFullName(user.full_name || '');
    setEmail(user.email || '');
    setPhone(stripCode(user.phoneNumber));
  }, [user]);

  useEffect(() => {
    if (!profile) return;
    setVehicleType(profile.vehicle_type);
    setPlate(profile.vehicle_plate_number || '');
    setStoreId(profile.store_location ?? null);
  }, [profile]);

  const handleSave = async () => {
    if (!fullName.trim()) return toast.error('Full name is required.');
    if (!email.trim()) return toast.error('Email is required.');
    if (!phone.trim()) return toast.error('Phone number is required.');
    if (!userId && !password.trim())
      return toast.error('Password is required.');

    const payload: UserPayload = {
      full_name: fullName.trim(),
      email: email.trim(),
      phoneNumber: `${COUNTRY_CODE}${phone.trim()}`,
      countryCode: COUNTRY_CODE,
      userType: 'delivery_man',
    };
    if (!userId && password.trim()) payload.password = password.trim();
    if (image) payload.image = await convertImageToBase64(image.uri);

    try {
      const saved = await saveUser.mutateAsync({ id: userId, payload });
      const riderId = userId ?? saved.id;

      // Second write. If it fails the account still exists and the roster
      // flags it "Setup needed", so reopening this form completes it.
      await saveProfile.mutateAsync({
        id: profileId,
        payload: {
          user: riderId,
          vehicle_type: vehicleType,
          vehicle_plate_number: plate.trim(),
          // Managers cannot pick a store — the backend pins their own.
          ...(isAdmin ? { store_location: storeId } : {}),
        },
      });
      router.back();
    } catch {
      // Both hooks surface their own error toasts.
    }
  };

  const storeOptions = storeLocations.map((store) => ({
    id: store.id,
    name: store.en_title || `Store #${store.id}`,
  }));

  const saving = saveUser.isPending || saveProfile.isPending;

  if ((userId && loadingUser) || (profileId && loadingProfile)) {
    return (
      <View className="flex-1 items-center justify-center py-16">
        <ActivityIndicator size="large" color="#6FA25F" />
      </View>
    );
  }

  return (
    <View className="px-4 py-5 gap-4">
      <SectionHeading
        title={userId ? 'Edit Delivery Man' : 'New Delivery Man'}
      />

      {userId && !profileId && (
        <View className="flex-row items-start p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <Ionicons name="alert-circle-outline" size={18} color="#F59E0B" />
          <Text className="flex-1 ml-2 text-xs text-amber-700 dark:text-amber-300">
            This account has no delivery profile yet. Save to create one so the
            rider shows up with a vehicle and availability status.
          </Text>
        </View>
      )}

      <Input
        label="Full Name"
        value={fullName}
        onChangeText={setFullName}
        placeholder="Full name"
      />

      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Email address"
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon="mail-outline"
      />

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

      {/* Vehicle */}
      <View>
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Vehicle Type
        </Text>
        <View className="flex-row bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {VEHICLE_TYPES.map((type) => (
            <TouchableOpacity
              key={type.key}
              onPress={() => setVehicleType(type.key)}
              className={`flex-1 py-2 rounded-lg items-center ${
                vehicleType === type.key ? 'bg-white dark:bg-gray-700' : ''
              }`}
              activeOpacity={0.8}
            >
              <Text
                className={`text-xs font-semibold ${
                  vehicleType === type.key
                    ? 'text-primary-600 dark:text-primary-300'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Input
        label="Vehicle Plate Number"
        value={plate}
        onChangeText={setPlate}
        placeholder="e.g. A 12345"
        autoCapitalize="characters"
      />

      {isAdmin && (
        <SingleSelectField
          label="Store Location"
          options={storeOptions}
          value={storeId}
          onChange={setStoreId}
          placeholder="Select a store"
        />
      )}

      <ImagePickerField
        label="Profile Image"
        defaultImage={user?.profile_image}
        value={image}
        onPick={setImage}
        aspect={[1, 1]}
      />

      <Button onPress={handleSave} loading={saving}>
        <Text className="text-white font-semibold text-base">
          {userId ? 'Update' : 'Create'}
        </Text>
      </Button>

      {/* Delivery record — only meaningful once the rider exists. */}
      {!!userId && <DeliveryManStats deliveryManId={userId} />}
    </View>
  );
};
