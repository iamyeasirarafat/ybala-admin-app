import { ImagePickerField } from '@/components/settings/ImagePickerField';
import { SectionHeading } from '@/components/settings/SectionHeading';
import { Button } from '@/components/ui';
import { useBrandStyle, useUpdateBrandStyle } from '@/hooks/useSettings';
import { ImageUpload } from '@/types';
import { toast } from '@/utils/toast';
import React, { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

const appendImage = (fd: FormData, field: string, img: ImageUpload | null) => {
  if (img) {
    fd.append(field, {
      uri: img.uri,
      name: img.name,
      type: img.type,
    } as unknown as Blob);
  }
};

export const BrandSettingsForm: React.FC = () => {
  const { data, isLoading } = useBrandStyle();
  const updateBrand = useUpdateBrandStyle();

  const [logo, setLogo] = useState<ImageUpload | null>(null);
  const [favicon, setFavicon] = useState<ImageUpload | null>(null);
  const [loginImage, setLoginImage] = useState<ImageUpload | null>(null);

  const handleSave = async () => {
    if (!logo && !favicon && !loginImage) {
      toast.error('Pick at least one image to update.');
      return;
    }
    const fd = new FormData();
    appendImage(fd, 'logo', logo);
    appendImage(fd, 'favicon', favicon);
    appendImage(fd, 'login_page_image', loginImage);

    try {
      await updateBrand.mutateAsync(fd);
      setLogo(null);
      setFavicon(null);
      setLoginImage(null);
    } catch {
      // handled by hook's onError toast
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-16">
        <ActivityIndicator size="large" color="#6FA25F" />
      </View>
    );
  }

  return (
    <View className="px-4 py-5 gap-6">
      <SectionHeading
        title="Brand Assets"
        description="Upload the images used across the storefront and admin panel."
      />

      <ImagePickerField
        label="Logo"
        defaultImage={data?.logo}
        value={logo}
        onPick={setLogo}
      />
      <ImagePickerField
        label="Favicon"
        defaultImage={data?.favicon}
        value={favicon}
        onPick={setFavicon}
      />
      <ImagePickerField
        label="Login Page Image"
        defaultImage={data?.login_page_image}
        value={loginImage}
        onPick={setLoginImage}
      />

      <Button onPress={handleSave} loading={updateBrand.isPending}>
        <Text className="text-white font-semibold text-base">Save Changes</Text>
      </Button>
    </View>
  );
};
