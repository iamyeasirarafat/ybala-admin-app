import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Animated, Dimensions, Text } from 'react-native';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastConfig {
  type: ToastType;
  message: string;
  duration?: number;
}

class ToastManager {
  private static instance: ToastManager;
  private callback: ((config: ToastConfig | null) => void) | null = null;

  private constructor() {}

  static getInstance(): ToastManager {
    if (!ToastManager.instance) {
      ToastManager.instance = new ToastManager();
    }
    return ToastManager.instance;
  }

  setCallback(callback: (config: ToastConfig | null) => void) {
    this.callback = callback;
  }

  show(config: ToastConfig) {
    if (this.callback) {
      this.callback(config);
    }
  }

  success(message: string, duration = 3000) {
    this.show({ type: 'success', message, duration });
  }

  error(message: string, duration = 3000) {
    this.show({ type: 'error', message, duration });
  }

  info(message: string, duration = 3000) {
    this.show({ type: 'info', message, duration });
  }

  warning(message: string, duration = 3000) {
    this.show({ type: 'warning', message, duration });
  }
}

export const toast = ToastManager.getInstance();

export const ToastContainer: React.FC = () => {
  const [config, setConfig] = React.useState<ToastConfig | null>(null);
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    toast.setCallback((newConfig) => {
      if (newConfig) {
        setConfig(newConfig);
        showToast(newConfig.duration || 3000);
      }
    });
  }, []);

  const showToast = (duration: number) => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        hideToast();
      }, duration);
    });
  };

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setConfig(null);
    });
  };

  if (!config) return null;

  const colors = {
    success: {
      bg: '#6FA25F', // Primary color
      icon: 'checkmark-circle' as const,
    },
    error: {
      bg: '#E05252',
      icon: 'close-circle' as const,
    },
    info: {
      bg: '#3B82F6',
      icon: 'information-circle' as const,
    },
    warning: {
      bg: '#F59E0B',
      icon: 'warning' as const,
    },
  };

  const { bg, icon } = colors[config.type];
  const screenWidth = Dimensions.get('window').width;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 60,
        left: 16,
        right: 16,
        maxWidth: screenWidth - 32,
        backgroundColor: bg,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        opacity,
        transform: [{ translateY }],
        zIndex: 9999,
      }}
    >
      <Ionicons name={icon} size={24} color="#FFFFFF" style={{ marginRight: 12 }} />
      <Text
        style={{
          flex: 1,
          color: '#FFFFFF',
          fontSize: 14,
          fontWeight: '600',
        }}
        numberOfLines={2}
      >
        {config.message}
      </Text>
    </Animated.View>
  );
};
