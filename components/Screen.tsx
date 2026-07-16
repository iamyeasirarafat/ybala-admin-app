import React from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  safe?: boolean;
  className?: string;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  scroll = false,
  safe = true,
  className = '',
}) => {
  const { colorScheme } = useColorScheme();

  const baseClassName = `flex-1 ${
    colorScheme === 'dark' ? 'bg-gray-900' : 'bg-white'
  } ${className}`;

  const Container = safe ? SafeAreaView : View;
  const Content = scroll ? ScrollView : View;

  return (
    <>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colorScheme === 'dark' ? '#111827' : '#FFFFFF'}
      />
      <Container className={baseClassName}>
        <Content
          className="flex-1 px-4"
          contentContainerStyle={scroll ? { flexGrow: 1 } : undefined}
        >
          {children}
        </Content>
      </Container>
    </>
  );
};
