import React from 'react';
import { Text, View } from 'react-native';

interface SectionHeadingProps {
  title: string;
  description?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  description,
}) => (
  <View className="mb-1">
    <Text className="text-lg font-bold text-gray-900 dark:text-white">
      {title}
    </Text>
    {description ? (
      <Text className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
        {description}
      </Text>
    ) : null}
  </View>
);
