import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { Input } from '@/components/ui';
import { useAuthStore } from '@/store/auth.store';
import { extractApiError } from '@/utils/errorExtractor';
import { toast } from '@/utils/toast';

export default function LoginScreen() {
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      toast.success('Welcome back!');
      // AuthProvider redirects to the app once authenticated
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error(extractApiError(error, 'Invalid credentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll>
      <View className="flex-1 justify-center px-6">
        {/* Header */}
        <View className="items-center mb-10">
          <View className="w-20 h-20 bg-primary-600 rounded-2xl items-center justify-center mb-4">
            <Ionicons name="shield-checkmark" size={40} color="#FFFFFF" />
          </View>
          <Text className="text-3xl font-bold text-gray-900 dark:text-white">
            Ybala Admin
          </Text>
          <Text className="text-base text-gray-500 dark:text-gray-400 mt-2">
            Sign in to your staff account
          </Text>
        </View>

        {/* Form */}
        <View>
          <Input
            label="Email"
            placeholder="your.email@example.com"
            value={email}
            onChangeText={setEmail}
            leftIcon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />

          <View className="mt-4">
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              leftIcon="lock-closed-outline"
              rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
              onRightIconPress={() => setShowPassword(!showPassword)}
              secureTextEntry={!showPassword}
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            className="w-full bg-primary-600 dark:bg-primary-500 py-4 rounded-lg mt-8"
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-center font-semibold text-base">
                Sign In
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}
