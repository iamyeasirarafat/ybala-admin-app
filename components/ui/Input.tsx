import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { useState } from 'react';
import { KeyboardTypeOptions, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface TextFieldProps {
  placeholder?: string;
  value: string;
  numberOfLines?: number;
  onChangeText: (text: string) => void;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onLeftIconPress?: () => void;
  onRightIconPress?: () => void;
  multiline?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  className?: string;
  editable?: boolean;
  keyboardType?: KeyboardTypeOptions | undefined;
  secureTextEntry?: boolean;
  error?: string;
  label?: string;
  maxLength?: number;
}

export const Input: React.FC<TextFieldProps> = ({
  placeholder,
  multiline,
  value,
  numberOfLines,
  keyboardType,
  onChangeText,
  leftIcon,
  autoCapitalize,
  rightIcon,
  onLeftIconPress,
  onRightIconPress,
  className = '',
  editable = true,
  secureTextEntry = false,
  error,
  maxLength,
  label,
}) => {
  const [focused, setFocused] = useState(false);
  const [showSecure, setShowSecure] = useState(false);

  // Built-in eye toggle: only when secureTextEntry is true and no custom rightIcon provided
  const builtInEye = secureTextEntry && !rightIcon;
  const resolvedSecure = builtInEye ? !showSecure : secureTextEntry;

  const containerStyles = twMerge(
    'flex flex-row items-center px-4 py-3 rounded-xl border transition-colors',
    focused
      ? 'border-primary-500 dark:border-primary-400 bg-white dark:bg-gray-900'
      : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50',
    error ? 'border-red-500 dark:border-red-400' : '',
    !editable && 'opacity-60 bg-gray-100 dark:bg-gray-800',
    className
  );

  const getIconColor = () => {
    if (error) return '#ef4444';
    if (focused) return '#6FA25F';
    return '#6B7280';
  };

  return (
    <View className="w-full">
      {label && (
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </Text>
      )}
      <View className={containerStyles}>
        {leftIcon && (
          <TouchableOpacity
            onPress={onLeftIconPress}
            disabled={!onLeftIconPress}
            className="mr-3"
            activeOpacity={0.7}
          >
            <Ionicons name={leftIcon} size={20} color={getIconColor()} />
          </TouchableOpacity>
        )}
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          keyboardType={keyboardType}
          multiline={multiline}
          onChangeText={onChangeText}
          numberOfLines={numberOfLines}
          autoCapitalize={autoCapitalize}
          editable={editable}
          maxLength={maxLength}
          secureTextEntry={resolvedSecure}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 text-gray-900 dark:text-white"
          style={{
            padding: 0,
            fontSize: 16,
            lineHeight: 20,
            textAlignVertical: 'center',
            fontFamily: 'System',
          }}
        />
        {builtInEye ? (
          <TouchableOpacity
            onPress={() => setShowSecure((v) => !v)}
            className="ml-3"
            activeOpacity={0.7}
          >
            <Ionicons
              name={showSecure ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={getIconColor()}
            />
          </TouchableOpacity>
        ) : rightIcon ? (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            className="ml-3"
            activeOpacity={0.7}
          >
            <Ionicons name={rightIcon} size={20} color={getIconColor()} />
          </TouchableOpacity>
        ) : null}
      </View>
      {error && (
        <View className="flex flex-row items-center mt-2">
          <Ionicons name="alert-circle" size={14} color="#ef4444" />
          <Text className="text-red-500 dark:text-red-400 text-xs ml-1 font-medium">
            {error}
          </Text>
        </View>
      )}
    </View>
  );
};
