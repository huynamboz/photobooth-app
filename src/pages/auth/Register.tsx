import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/types/navigation.type';
import { useNavigation } from '@react-navigation/native';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const RegisterScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View className="flex flex-1 flex-row gap-x-2 justify-center items-center bg-blue-400">
      <TouchableOpacity
        className="px-[50px] py-[10px] bg-white rounded-xl"
        onPress={() => navigation.navigate('LoginScreen')}
      >
        <Text className="text-black text-[20px] font-bold">Back to login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="px-[50px] py-[10px] bg-white rounded-xl"
        onPress={() => navigation.navigate('RegisterScreen')}
      >
        <Text className="text-black text-[20px] font-bold">Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;
