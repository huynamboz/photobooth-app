import LoginScreen from '@/pages/auth/Login';
import RegisterScreen from '@/pages/auth/Register';
import Boarding from '@/pages/Boarding';
import useOnboardingStore from '@/store/slices/boardingSlice';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

const Stack = createNativeStackNavigator();

const AuthNavigvation = () => {
  const { isFirstLaunch } = useOnboardingStore();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isFirstLaunch ? <Stack.Screen name="boarding" component={Boarding} /> : null}
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigvation;
