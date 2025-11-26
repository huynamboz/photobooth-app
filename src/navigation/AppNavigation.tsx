import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AuthNavigvation from './AuthNavigvation';
import TabNavigation from './TabNavigation';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth" component={AuthNavigvation} />
      <Stack.Screen name="app" component={TabNavigation} />
    </Stack.Navigator>
  );
};

export default AppNavigation;
