import Icons from '@/assets/icon';
import { Button } from '@/components/common/Button';
import useOnboardingStore from '@/store/slices/boardingSlice';
import { AuthStackParamList } from '@/types/navigation.type';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Text, View } from 'react-native';

type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList & { app: undefined }>;

const LoginScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const { resetOnboarding } = useOnboardingStore();
  return (
    <View className="flex-1">
      <View className="h-[40%] justify-center items-center">
        <Text className="text-xl font-bold">LOGO</Text>
      </View>

      <View className="flex-1 justify-start items-center px-[30px]">
        <Text className="text-center w-full text-2xl font-bold self-start mb-6">Đăng nhập</Text>

        <View className="flex flex-col gap-6 w-full">
          <Button
            text="Đăng nhập bằng Google"
            onPress={() => {
              navigation.navigate('app');
              resetOnboarding();
            }}
            variant="text"
            className="border rounded-xl w-full"
            contentClassName="justify-start"
            icon={Icons.google}
          />
          <Button
            text="Đăng nhập bằng X"
            onPress={() => navigation.navigate('app')}
            variant="text"
            className="border rounded-xl w-full"
            contentClassName="justify-start"
            icon={Icons.twitter}
          />
          <Button
            text="Đăng nhập bằng Facebook"
            onPress={() => navigation.navigate('app')}
            variant="text"
            className="border rounded-xl w-full"
            contentClassName="justify-start"
            icon={Icons.facebook}
          />
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
