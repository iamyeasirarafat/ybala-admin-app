import { SectionHeading } from '@/components/settings/SectionHeading';
import { Input } from '@/components/ui';
import { OtherSettings } from '@/types';
import React from 'react';
import { View } from 'react-native';

interface PageContentFormProps {
  values: OtherSettings;
  onChange: (key: keyof OtherSettings, value: string) => void;
}

export const PageContentForm: React.FC<PageContentFormProps> = ({
  values,
  onChange,
}) => {
  return (
    <View className="gap-4">
      <SectionHeading
        title="Page Content"
        description="Text content shown on the website pages."
      />
      <Input
        label="Home Page Text"
        value={values.home_page_description || ''}
        onChangeText={(v) => onChange('home_page_description', v)}
        placeholder="Home page description"
        multiline
        numberOfLines={4}
      />
      <Input
        label="Location Page Text"
        value={values.location_page_description || ''}
        onChangeText={(v) => onChange('location_page_description', v)}
        placeholder="Location page description"
        multiline
        numberOfLines={4}
      />
      <Input
        label="Terms & Conditions Text"
        value={values.terms || ''}
        onChangeText={(v) => onChange('terms', v)}
        placeholder="Terms & conditions"
        multiline
        numberOfLines={4}
      />
      <Input
        label="Privacy Policy Text"
        value={values.privacy || ''}
        onChangeText={(v) => onChange('privacy', v)}
        placeholder="Privacy policy"
        multiline
        numberOfLines={4}
      />
      <Input
        label="About Us Text"
        value={values.about_us || ''}
        onChangeText={(v) => onChange('about_us', v)}
        placeholder="About us"
        multiline
        numberOfLines={4}
      />
    </View>
  );
};
