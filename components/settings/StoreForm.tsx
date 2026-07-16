import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { ImagePickerField } from '@/components/settings/ImagePickerField';
import { ManagerSelector } from '@/components/settings/ManagerSelector';
import { SectionHeading } from '@/components/settings/SectionHeading';
import { Button, Input } from '@/components/ui';
import {
  useCreateStoreLocation,
  useDeleteStoreLocation,
  useUpdateStoreLocation,
} from '@/hooks/useSettings';
import { ImageUpload, StoreLocation } from '@/types';

type Lang = 'en' | 'ar';

interface FormState {
  en_title: string;
  en_description: string;
  en_map_link: string;
  en_wa_link: string;
  ar_title: string;
  ar_description: string;
  ar_map_link: string;
  ar_wa_link: string;
  manager: number | null;
}

const initFromStore = (store: StoreLocation | null): FormState => ({
  en_title: store?.en_title || '',
  en_description: store?.en_description || '',
  en_map_link: store?.en_map_link || '',
  en_wa_link: store?.en_wa_link || '',
  ar_title: store?.ar_title || '',
  ar_description: store?.ar_description || '',
  ar_map_link: store?.ar_map_link || '',
  ar_wa_link: store?.ar_wa_link || '',
  manager: store?.manager ?? store?.manager_data?.id ?? null,
});

interface StoreFormProps {
  // null => create mode. Remount via `key` to reset when selection changes.
  selected: StoreLocation | null;
  onDone: () => void;
}

export const StoreForm: React.FC<StoreFormProps> = ({ selected, onDone }) => {
  const createStore = useCreateStoreLocation();
  const updateStore = useUpdateStoreLocation();
  const deleteStore = useDeleteStoreLocation();

  const [lang, setLang] = useState<Lang>('en');
  const [form, setForm] = useState<FormState>(() => initFromStore(selected));
  const [enImage, setEnImage] = useState<ImageUpload | null>(null);
  const [arImage, setArImage] = useState<ImageUpload | null>(null);

  const set = (key: keyof FormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const buildFormData = () => {
    const fd = new FormData();
    fd.append('en_title', form.en_title);
    fd.append('en_description', form.en_description);
    fd.append('en_map_link', form.en_map_link);
    fd.append('en_wa_link', form.en_wa_link);
    fd.append('ar_title', form.ar_title);
    fd.append('ar_description', form.ar_description);
    fd.append('ar_map_link', form.ar_map_link);
    fd.append('ar_wa_link', form.ar_wa_link);
    if (form.manager) fd.append('manager', String(form.manager));
    if (enImage) {
      fd.append('en_image', {
        uri: enImage.uri,
        name: enImage.name,
        type: enImage.type,
      } as unknown as Blob);
    }
    if (arImage) {
      fd.append('ar_image', {
        uri: arImage.uri,
        name: arImage.name,
        type: arImage.type,
      } as unknown as Blob);
    }
    return fd;
  };

  const handleSubmit = async () => {
    const fd = buildFormData();
    try {
      if (selected?.id) {
        await updateStore.mutateAsync({ id: selected.id, formData: fd });
      } else {
        await createStore.mutateAsync(fd);
      }
      onDone();
    } catch {
      // handled by hook onError
    }
  };

  const handleDelete = () => {
    if (!selected?.id) return;
    Alert.alert(
      'Delete Store Location',
      'Are you sure you want to delete this store location?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteStore.mutateAsync(selected.id);
              onDone();
            } catch {
              // handled by hook onError
            }
          },
        },
      ],
    );
  };

  const submitting = createStore.isPending || updateStore.isPending;

  return (
    <View className="gap-5">
      <SectionHeading
        title={selected ? 'Store Details' : 'New Store'}
        description="Manager is language-independent. Store details support English & Arabic."
      />

      <ManagerSelector
        value={form.manager}
        onChange={(id) => setForm((prev) => ({ ...prev, manager: id }))}
      />

      {/* Language toggle */}
      <View className="flex-row bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        {(['en', 'ar'] as Lang[]).map((l) => (
          <TouchableOpacity
            key={l}
            onPress={() => setLang(l)}
            className={`flex-1 py-2 rounded-lg items-center ${
              lang === l ? 'bg-white dark:bg-gray-700' : ''
            }`}
            activeOpacity={0.8}
          >
            <Text
              className={`text-sm font-semibold ${
                lang === l
                  ? 'text-primary-600 dark:text-primary-300'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {l === 'en' ? 'English' : 'Arabic'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {lang === 'en' ? (
        <View className="gap-4">
          <Input
            label="Store Title"
            value={form.en_title}
            onChangeText={set('en_title')}
            placeholder="New Store"
          />
          <Input
            label="Store Location Description"
            value={form.en_description}
            onChangeText={set('en_description')}
            placeholder="Al Fitnah St AL Shamkha Mall"
            multiline
            numberOfLines={4}
          />
          <Input
            label="Map Link"
            value={form.en_map_link}
            onChangeText={set('en_map_link')}
            placeholder="https://"
            autoCapitalize="none"
          />
          <Input
            label="WhatsApp Link"
            value={form.en_wa_link}
            onChangeText={set('en_wa_link')}
            placeholder="https://wa.me/9715XXXXXXXX"
            autoCapitalize="none"
          />
          <ImagePickerField
            label="Image Banner (English)"
            defaultImage={selected?.en_image}
            value={enImage}
            onPick={setEnImage}
          />
        </View>
      ) : (
        <View className="gap-4">
          <Input
            label="Store Title"
            value={form.ar_title}
            onChangeText={set('ar_title')}
            placeholder="عنوان المتجر"
          />
          <Input
            label="Store Location Description"
            value={form.ar_description}
            onChangeText={set('ar_description')}
            placeholder="وصف الموقع"
            multiline
            numberOfLines={4}
          />
          <Input
            label="Map Link"
            value={form.ar_map_link}
            onChangeText={set('ar_map_link')}
            placeholder="https://"
            autoCapitalize="none"
          />
          <Input
            label="WhatsApp Link"
            value={form.ar_wa_link}
            onChangeText={set('ar_wa_link')}
            placeholder="https://wa.me/9715XXXXXXXX"
            autoCapitalize="none"
          />
          <ImagePickerField
            label="Image Banner (Arabic)"
            defaultImage={selected?.ar_image}
            value={arImage}
            onPick={setArImage}
          />
        </View>
      )}

      <View className="flex-row gap-3">
        {selected ? (
          <View className="flex-1">
            <Button
              variant="solid"
              className="bg-red-600 active:bg-red-700"
              onPress={handleDelete}
              loading={deleteStore.isPending}
            >
              <Text className="text-white font-semibold text-base">Delete</Text>
            </Button>
          </View>
        ) : (
          <View className="flex-1">
            <Button variant="outline" onPress={onDone}>
              <Text className="text-gray-700 dark:text-gray-200 font-semibold text-base">
                Cancel
              </Text>
            </Button>
          </View>
        )}
        <View className="flex-1">
          <Button onPress={handleSubmit} loading={submitting}>
            <Text className="text-white font-semibold text-base">
              {selected ? 'Update' : 'Save'}
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
};
