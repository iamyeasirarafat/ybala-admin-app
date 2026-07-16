import type React from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: 'solid' | 'ghost' | 'link' | 'outline' | 'outline-primary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  children,
  variant = 'solid',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
}) => {
  const baseStyles =
    'flex items-center justify-center rounded-lg font-semibold transition-all active:scale-95';

  const variantStyles = {
    solid:
      'bg-primary-600 dark:bg-primary-500 active:bg-primary-700 dark:active:bg-primary-600',
    ghost: 'bg-transparent active:bg-primary-100 dark:active:bg-primary-950',
    link: 'bg-transparent active:opacity-70',
    outline: 'bg-transparent border border-gray-300 dark:border-gray-700',
    'outline-primary':
      'bg-transparent border-2 border-primary-600 dark:border-primary-400 active:border-primary-700 dark:active:border-primary-300',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const textColorStyles = {
    solid: 'text-white dark:text-white',
    ghost: 'text-primary-700 dark:text-primary-100',
    link: 'text-primary-600 dark:text-primary-400',
    outline: 'text-primary-700 dark:text-primary-100',
    'outline-primary': 'text-primary-700 dark:text-primary-100',
  };

  const disabledStyles = disabled || loading ? 'opacity-50' : '';

  const combinedStyles = twMerge(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    disabledStyles,
    className,
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={combinedStyles}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <View className={twMerge('font-semibold', textColorStyles[variant])}>
          {children}
        </View>
      )}
    </TouchableOpacity>
  );
};
