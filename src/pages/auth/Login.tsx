import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ApiError } from '@/services/apiClient';
import { useAuthStore } from '@/store';
import useOnboardingStore from '@/store/slices/boardingSlice';
import { AuthStackParamList } from '@/types/navigation.type';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const LoginScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const { resetOnboarding } = useOnboardingStore();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [email, setEmail] = useState('nam@gmail.com');
  const [password, setPassword] = useState('12345678');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = useCallback(async () => {
    const sanitizedEmail = email.trim();

    if (!sanitizedEmail || password.length < 8) {
      setErrorMessage('Vui lòng nhập email hợp lệ và mật khẩu tối thiểu 8 ký tự.');
      return;
    }

    try {
      setErrorMessage(null);
      await login(sanitizedEmail, password);
      resetOnboarding();
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Đăng nhập thất bại. Vui lòng thử lại.');
      }
    }
  }, [email, password, login, resetOnboarding]);

  const canSubmit = email.trim().length > 0 && password.length >= 8 && !isLoading;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1 bg-white"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 px-6 py-10">
            <View className="mb-10">
              <Text className="text-3xl font-bold mb-2">Chào mừng trở lại 👋</Text>
              <Text className="text-base text-gray-500">
                Đăng nhập để tiếp tục sử dụng ứng dụng.
              </Text>
            </View>

            <View className="flex-1">
              <Input
                label="Email"
                placeholder="nhapemail@example.com"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                disabled={isLoading}
              />
              <Input
                label="Mật khẩu"
                placeholder="••••••••"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                disabled={isLoading}
              />

              {errorMessage ? <Text className="text-red-500 mb-4">{errorMessage}</Text> : null}

              <Button
                text={isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                onPress={handleLogin}
                disabled={!canSubmit}
                className="w-full mt-2"
              />

              <View className="flex-row justify-center items-center mt-4">
                <Text className="text-gray-600">Chưa có tài khoản?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
                  <Text className="text-primary font-semibold ml-2">Đăng ký</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
