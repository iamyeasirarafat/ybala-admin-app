import { PageContentForm } from '@/components/settings/PageContentForm';
import { SocialLinkForm } from '@/components/settings/SocialLinkForm';
import { Button } from '@/components/ui';
import { useOtherSettings, useUpdateOtherSettings } from '@/hooks/useSettings';
import { OtherSettings } from '@/types';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

const EMPTY: OtherSettings = {
  email: '',
  phone: '',
  whatsapp: '',
  facebook: '',
  titktok: '',
  instagram: '',
  youtube: '',
  home_page_description: '',
  location_page_description: '',
  terms: '',
  privacy: '',
  about_us: '',
};

export const OthersSettingsForm: React.FC = () => {
  const { data, isLoading } = useOtherSettings();
  const updateOther = useUpdateOtherSettings();

  const [form, setForm] = useState<OtherSettings>(EMPTY);

  useEffect(() => {
    if (data) {
      setForm({
        email: data.email || '',
        phone: data.phone || '',
        whatsapp: data.whatsapp || '',
        facebook: data.facebook || '',
        titktok: data.titktok || '',
        instagram: data.instagram || '',
        youtube: data.youtube || '',
        home_page_description: data.home_page_description || '',
        location_page_description: data.location_page_description || '',
        terms: data.terms || '',
        privacy: data.privacy || '',
        about_us: data.about_us || '',
      });
    }
  }, [data]);

  const handleChange = (key: keyof OtherSettings, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => updateOther.mutate(form);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-16">
        <ActivityIndicator size="large" color="#6FA25F" />
      </View>
    );
  }

  return (
    <View className="px-4 py-5 gap-6">
      <SocialLinkForm values={form} onChange={handleChange} />
      <PageContentForm values={form} onChange={handleChange} />
      <Button onPress={handleSave} loading={updateOther.isPending}>
        <Text className="text-white font-semibold text-base">Update</Text>
      </Button>
    </View>
  );
};
