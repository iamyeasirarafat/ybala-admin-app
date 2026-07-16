import { SectionHeading } from '@/components/settings/SectionHeading';
import { Input } from '@/components/ui';
import { OtherSettings } from '@/types';
import React from 'react';
import { View } from 'react-native';

interface SocialLinkFormProps {
  values: OtherSettings;
  onChange: (key: keyof OtherSettings, value: string) => void;
}

export const SocialLinkForm: React.FC<SocialLinkFormProps> = ({
  values,
  onChange,
}) => {
  return (
    <View className="gap-4">
      <SectionHeading
        title="Social & Contact Links"
        description="Public contact details shown across the website."
      />
      <Input
        label="Email"
        value={values.email || ''}
        onChangeText={(v) => onChange('email', v)}
        placeholder="hello@ybala.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        label="Phone"
        value={values.phone || ''}
        onChangeText={(v) => onChange('phone', v)}
        placeholder="+971 485789523"
        keyboardType="phone-pad"
      />
      <Input
        label="Whatsapp"
        value={values.whatsapp || ''}
        onChangeText={(v) => onChange('whatsapp', v)}
        placeholder="1450485596"
        keyboardType="phone-pad"
      />
      <Input
        label="Facebook"
        value={values.facebook || ''}
        onChangeText={(v) => onChange('facebook', v)}
        placeholder="https://www.facebook.com/"
        autoCapitalize="none"
      />
      <Input
        label="Tiktok"
        value={values.titktok || ''}
        onChangeText={(v) => onChange('titktok', v)}
        placeholder="https://www.tiktok.com/"
        autoCapitalize="none"
      />
      <Input
        label="Instagram"
        value={values.instagram || ''}
        onChangeText={(v) => onChange('instagram', v)}
        placeholder="https://www.instagram.com/"
        autoCapitalize="none"
      />
      <Input
        label="Youtube"
        value={values.youtube || ''}
        onChangeText={(v) => onChange('youtube', v)}
        placeholder="https://www.youtube.com/"
        autoCapitalize="none"
      />
    </View>
  );
};
