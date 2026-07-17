import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { ImagePickerField } from '@/components/settings/ImagePickerField';
import { SectionHeading } from '@/components/settings/SectionHeading';
import { Button, Input } from '@/components/ui';
import { useCategory, useSaveCategory } from '@/hooks/useMenu';
import { ImageUpload } from '@/types';
import { toast } from '@/utils/toast';

export const CategoryForm: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const categoryId = id ? Number(id) : undefined;

  const { data: category, isLoading } = useCategory(categoryId);
  const saveCategory = useSaveCategory();

  const [name, setName] = useState('');
  const [arabicName, setArabicName] = useState('');
  const [bannerAlt, setBannerAlt] = useState('');
  const [icon, setIcon] = useState<ImageUpload | null>(null);
  const [banner, setBanner] = useState<ImageUpload | null>(null);

  useEffect(() => {
    if (!category) return;
    setName(category.name || '');
    setArabicName(category.arabic_name || '');
    setBannerAlt(category.banner_alt || '');
  }, [category]);

  const handleSave = async () => {
    if (!name.trim()) return toast.error('Category name is required.');
    if (!arabicName.trim())
      return toast.error('Category name in Arabic is required.');
    if (!bannerAlt.trim()) return toast.error('Banner alt text is required.');
    if (!categoryId && !icon) return toast.error('Category icon is required.');
    if (!categoryId && !banner)
      return toast.error('Category banner is required.');

    const fd = new FormData();
    fd.append('name', name.trim());
    fd.append('arabic_name', arabicName.trim());
    fd.append('banner_alt', bannerAlt.trim());
    if (icon) fd.append('icon', icon as unknown as Blob);
    if (banner) fd.append('banner', banner as unknown as Blob);

    try {
      await saveCategory.mutateAsync({ id: categoryId, formData: fd });
      router.back();
    } catch {
      // handled by hook
    }
  };

  if (categoryId && isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-16">
        <ActivityIndicator size="large" color="#6FA25F" />
      </View>
    );
  }

  return (
    <View className="px-4 py-5 gap-4">
      <SectionHeading title={categoryId ? 'Edit Category' : 'New Category'} />

      <Input
        label="Category Name"
        value={name}
        onChangeText={setName}
        placeholder="e.g. Fry"
      />
      <Input
        label="Category Name (Arabic)"
        value={arabicName}
        onChangeText={setArabicName}
        placeholder="فراي"
      />

      <ImagePickerField
        label="Icon"
        defaultImage={category?.icon}
        value={icon}
        onPick={setIcon}
        aspect={[1, 1]}
      />
      <ImagePickerField
        label="Banner Image"
        defaultImage={category?.banner}
        value={banner}
        onPick={setBanner}
      />
      <Input
        label="Banner Image Alt Text"
        value={bannerAlt}
        onChangeText={setBannerAlt}
        placeholder="Box of happiness"
      />

      <Button onPress={handleSave} loading={saveCategory.isPending}>
        <Text className="text-white font-semibold text-base">
          {categoryId ? 'Update' : 'Create'}
        </Text>
      </Button>
    </View>
  );
};
