import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { Image, Text, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg';
  source?: string; // image URL or local path
  initials?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  className?: string;
  backgroundColor?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  size = 'md',
  source,
  initials,
  icon = 'person',
  className = '',
  backgroundColor = 'bg-primary-600 dark:bg-primary-500',
}) => {
  const sizeMap = {
    sm: { container: 'w-8 h-8', text: 'text-xs', icon: 16 },
    md: { container: 'w-10 h-10', text: 'text-sm', icon: 20 },
    lg: { container: 'w-14 h-14', text: 'text-base', icon: 24 },
  };

  const sizeConfig = sizeMap[size];

  const containerStyles = twMerge(
    'flex items-center justify-center rounded-full overflow-hidden',
    sizeConfig.container,
    backgroundColor,
    className,
  );

  return (
    <View className={containerStyles}>
      {source ? (
        <Image
          key={source}
          style={{ width: '100%', height: '100%' }}
          source={{ uri: source }}
          resizeMode="cover"
        />
      ) : initials ? (
        <Text className={twMerge('font-semibold text-white', sizeConfig.text)}>
          {initials}
        </Text>
      ) : (
        <Ionicons name={icon} size={sizeConfig.icon} color="white" />
      )}
    </View>
  );
};
