import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ApiError } from '@/services/apiClient';
import { useAuthStore } from '@/store';
import { AuthStackParamList } from '@/types/navigation.type';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const RegisterScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = useCallback(async () => {
    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp.');
      return;
    }

    try {
      setErrorMessage(null);
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        const detailsMessage = Array.isArray(error.details) ? error.details.join('\n') : null;
        setErrorMessage(detailsMessage ?? error.message);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Đăng ký thất bại. Vui lòng thử lại.');
      }
    }
  }, [confirmPassword, email, name, password, register]);

  const canSubmit = useMemo(() => {
    return (
      name.trim().length >= 2 &&
      /\S+@\S+\.\S+/.test(email.trim()) &&
      password.length >= 8 &&
      password === confirmPassword &&
      !isLoading
    );
  }, [confirmPassword, email, isLoading, name, password]);

  const handleTermsPress = useCallback(() => {
    Alert.alert('Điều khoản', 'Tính năng này sẽ được cập nhật sau.');
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1 bg-white"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 px-6 py-10">
            <View className="mb-10">
              <Text className="text-3xl font-bold mb-2">Tạo tài khoản mới ✨</Text>
              <Text className="text-base text-gray-500">Hãy nhập thông tin để bắt đầu.</Text>
            </View>

            <View className="flex-1">
              <Input
                label="Họ và tên"
                placeholder="Nguyễn Văn A"
                value={name}
                onChangeText={setName}
                disabled={isLoading}
              />
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
              <Input
                label="Xác nhận mật khẩu"
                placeholder="••••••••"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                disabled={isLoading}
              />

              {errorMessage ? <Text className="text-red-500 mb-4">{errorMessage}</Text> : null}

              <Button
                text={isLoading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
                onPress={handleRegister}
                disabled={!canSubmit}
                className="w-full mt-2"
              />

              <View className="flex-row items-center mt-4">
                <Text className="text-gray-500 text-sm">
                  Bằng việc đăng ký, bạn đồng ý với{' '}
                  <Text className="text-primary font-semibold" onPress={handleTermsPress}>
                    Điều khoản sử dụng
                  </Text>
                </Text>
              </View>

              <View className="flex-row justify-center items-center mt-8">
                <Text className="text-gray-600">Đã có tài khoản?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                  <Text className="text-primary font-semibold ml-2">Đăng nhập</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
