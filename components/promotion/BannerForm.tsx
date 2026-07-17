import React, { useEffect, useState } from 'react';
import { Switch, Text, View } from 'react-native';
import { ImagePickerField } from '@/components/settings/ImagePickerField';
import { Button, Input } from '@/components/ui';
import {
  useHeaderBanner,
  useMobileHeaderBanner,
  usePopupBanner,
  useUpdateHeaderBanner,
  useUpdateMobileHeaderBanner,
  useUpdatePopupBanner,
} from '@/hooks/usePromotion';
import { ImageUpload } from '@/types';

type BannerType = 'popup' | 'header' | 'mobile_header';

interface BannerFormProps {
  type: BannerType;
  title: string;
  subtitle?: string;
}

export const BannerForm: React.FC<BannerFormProps> = ({
  type,
  title,
  subtitle,
}) => {
  const isPopup = type === 'popup';

  const popupQuery = usePopupBanner();
  const headerQuery = useHeaderBanner();
  const mobileQuery = useMobileHeaderBanner();
  const query =
    type === 'popup' ? popupQuery : type === 'header' ? headerQuery : mobileQuery;
  const data = query.data;

  const updatePopup = useUpdatePopupBanner();
  const updateHeader = useUpdateHeaderBanner();
  const updateMobile = useUpdateMobileHeaderBanner();
  const mutation =
    type === 'popup'
      ? updatePopup
      : type === 'header'
      ? updateHeader
      : updateMobile;

  const [enabled, setEnabled] = useState(false);
  const [imageAlt, setImageAlt] = useState('');
  const [link, setLink] = useState('');
  const [delay, setDelay] = useState('');
  const [image, setImage] = useState<ImageUpload | null>(null);

  useEffect(() => {
    if (!data) return;
    setEnabled(!!data.enabled);
    setImageAlt(data.image_alt || '');
    setLink(data.link || '');
    setDelay(data.delay != null ? String(data.delay) : '');
  }, [data]);

  const handleSave = () => {
    const fd = new FormData();
    fd.append('enabled', enabled ? 'true' : 'false');
    fd.append('image_alt', imageAlt);
    fd.append('link', link);
    if (isPopup) fd.append('delay', delay || '0');
    if (image) fd.append('image', image as unknown as Blob);
    mutation.mutate(fd);
  };

  return (
    <View className="px-4 py-5 gap-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-lg font-bold text-gray-900 dark:text-white">
            {title}
          </Text>
          {subtitle ? (
            <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {subtitle}
            </Text>
          ) : null}
        </View>
        <Switch
          value={enabled}
          onValueChange={setEnabled}
          trackColor={{ true: '#6FA25F' }}
        />
      </View>

      <ImagePickerField
        label="Banner Image"
        defaultImage={data?.image}
        value={image}
        onPick={setImage}
      />

      <Input
        label="Banner Image Alt Text"
        value={imageAlt}
        onChangeText={setImageAlt}
        placeholder="Box of happiness"
      />
      <Input
        label="Banner Link"
        value={link}
        onChangeText={setLink}
        placeholder="https://ybalashop.com/offer"
        keyboardType="url"
        autoCapitalize="none"
      />
      {isPopup && (
        <Input
          label="Show After Visit (milliseconds)"
          value={delay}
          onChangeText={setDelay}
          placeholder="5000"
          keyboardType="numeric"
        />
      )}

      <Button onPress={handleSave} loading={mutation.isPending}>
        <Text className="text-white font-semibold text-base">Update</Text>
      </Button>
    </View>
  );
};
