import { ImageUpload } from '@/types';
import { mediaUrl } from '@/utils/format';
import { toast } from '@/utils/toast';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface ImagePickerFieldProps {
  label: string;
  // Remote image path already stored on the server
  defaultImage?: string | null;
  // Locally picked image (not yet uploaded)
  value?: ImageUpload | null;
  onPick: (asset: ImageUpload) => void;
  aspect?: [number, number];
}

const buildUpload = (
  asset: ImagePicker.ImagePickerAsset,
): ImageUpload => {
  const uri = asset.uri;
  const nameFromUri = uri.split('/').pop() || `upload-${Date.now()}.jpg`;
  const ext = nameFromUri.includes('.') ? nameFromUri.split('.').pop() : 'jpg';
  const mime = asset.mimeType || `image/${ext === 'jpg' ? 'jpeg' : ext}`;
  return { uri, name: nameFromUri, type: mime };
};

export const ImagePickerField: React.FC<ImagePickerFieldProps> = ({
  label,
  defaultImage,
  value,
  onPick,
  aspect,
}) => {
  const previewUri = value?.uri || mediaUrl(defaultImage) || undefined;

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
        allowsEditing: !!aspect,
        aspect,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onPick(buildUpload(result.assets[0]));
      }
    } catch {
      toast.error('Failed to pick image.');
    }
  };

  return (
    <View>
      <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </Text>
      <TouchableOpacity
        onPress={pickImage}
        activeOpacity={0.8}
        className="border border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-5 items-center bg-white dark:bg-gray-800"
      >
        <View className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 mb-3 items-center justify-center">
          {previewUri ? (
            <Image
              source={{ uri: previewUri }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="image-outline" size={34} color="#9CA3AF" />
          )}
        </View>
        <Text className="text-sm">
          <Text className="text-primary-600 dark:text-primary-400 font-semibold">
            {previewUri ? 'Change image' : 'Upload image'}
          </Text>
        </Text>
        <Text className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          PNG, JPG up to 5MB
        </Text>
      </TouchableOpacity>
    </View>
  );
};
