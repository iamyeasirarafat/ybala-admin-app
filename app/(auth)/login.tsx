import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { useAuthStore } from '@/store/auth.store';
import { isValidEmail } from '@/utils';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { login } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      // Router will automatically redirect via AuthProvider
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen safe={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6">
          {/* Logo/Icon */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-primary-600 rounded-2xl items-center justify-center mb-4">
              <Ionicons name="rocket" size={40} color="#FFF" />
            </View>
            <Text className="text-4xl font-bold text-gray-900 dark:text-white">
              Welcome Back
            </Text>
            <Text className="text-base text-gray-500 dark:text-gray-400 mt-2">
              Sign in to continue
            </Text>
          </View>

          {/* Email Input */}
          <View className="mb-4">
            <Text className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Email Address
            </Text>
            <View className="relative">
              <View className="absolute left-4 top-4 z-10">
                <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
              </View>
              <TextInput
                className="border border-gray-300 dark:border-gray-600 rounded-xl pl-12 pr-4 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="your.email@example.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>
          </View>

          {/* Password Input */}
          <View className="mb-6">
            <Text className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Password
            </Text>
            <View className="relative">
              <View className="absolute left-4 top-4 z-10">
                <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
              </View>
              <TextInput
                className="border border-gray-300 dark:border-gray-600 rounded-xl pl-12 pr-12 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <TouchableOpacity
                className="absolute right-4 top-4"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            className={`bg-primary-600 rounded-xl py-4 items-center mb-4 ${
              loading ? 'opacity-50' : 'active:bg-primary-700'
            }`}
            onPress={handleLogin}
            disabled={loading}
          >
            <View className="flex-row items-center">
              {loading ? (
                <Ionicons name="hourglass-outline" size={20} color="#FFF" />
              ) : (
                <Ionicons name="log-in-outline" size={20} color="#FFF" />
              )}
              <Text className="text-white font-bold text-base ml-2">
                {loading ? 'Signing in...' : 'Sign In'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Demo Info */}
          <View className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={20} color="#3B82F6" />
              <View className="flex-1 ml-2">
                <Text className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Demo Mode
                </Text>
                <Text className="text-xs text-blue-700 dark:text-blue-300">
                  Use any email and password to login
                </Text>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
