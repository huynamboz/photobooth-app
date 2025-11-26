import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
};

export type AppStackParamList = {
  HomeScreen: undefined;
  QRScanner: undefined;
  PrepareCapture: { qrData: string };
  PhotoboothControl: { sessionId: string; photoboothId: string };
  TopUpPoints: undefined;
};

export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
