import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
};

export type AppStackParamList = {
  HomeScreen: undefined;
};

export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
