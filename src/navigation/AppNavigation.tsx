import PhotoboothControlScreen from '@/pages/PhotoboothControl';
import PrepareCaptureScreen from '@/pages/PrepareCapture';
import QRScannerScreen from '@/pages/QRScanner';
import SessionDetailScreen from '@/pages/SessionDetail';
import TopUpPointsScreen from '@/pages/TopUpPoints';
import { useAuthStore } from '@/store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import AuthNavigvation from './AuthNavigvation';
import TabNavigation from './TabNavigation';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const checkAuthState = useAuthStore((state) => state.checkAuthState);
  const [isBootstrapping, setIsBootstrapping] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    const bootstrap = async () => {
      try {
        await checkAuthState();
      } finally {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [checkAuthState]);

  if (isBootstrapping) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="app" component={TabNavigation} />
          <Stack.Screen name="QRScanner" component={QRScannerScreen} />
          <Stack.Screen name="PrepareCapture" component={PrepareCaptureScreen} />
          <Stack.Screen name="PhotoboothControl" component={PhotoboothControlScreen} />
          <Stack.Screen name="TopUpPoints" component={TopUpPointsScreen} />
          <Stack.Screen name="SessionDetail" component={SessionDetailScreen} />
        </>
      ) : (
        <Stack.Screen name="auth" component={AuthNavigvation} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigation;
