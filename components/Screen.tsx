import { useColorScheme } from 'nativewind';
import React, { forwardRef } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  safe?: boolean;
  header?: boolean;
  className?: string;
}

export const Screen = forwardRef<ScrollView, ScreenProps>(({
  children,
  scroll = false,
  safe = true,
  className = '',
}, ref) => {
  const { colorScheme } = useColorScheme();

  const baseClassName = `flex-1 ${colorScheme === 'dark' ? 'bg-gray-900' : 'bg-white'} ${className}`;

  const Container = safe ? SafeAreaView : View;

  return (
    <>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colorScheme === 'dark' ? '#111827' : '#FFFFFF'}
      />
      <Container className={baseClassName} edges={['left', 'right']}>
        {scroll ? (
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ScrollView
              ref={ref}
              className="flex-1"
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
            >
              {children}
            </ScrollView>
          </KeyboardAvoidingView>
        ) : (
          <View className="flex-1">
            {children}
          </View>
        )}
      </Container>
    </>
  );
});

Screen.displayName = 'Screen';
