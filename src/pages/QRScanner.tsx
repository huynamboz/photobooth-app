import { AppStackParamList } from '@/types/navigation.type';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';

type QRScannerNavigationProp = NativeStackNavigationProp<AppStackParamList, 'QRScanner'>;

const QRScannerScreen = () => {
  const navigation = useNavigation<QRScannerNavigationProp>();
  const [hasPermission, setHasPermission] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const device = useCameraDevice('back');

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      if (codes.length > 0 && codes[0].value) {
        console.log('onCodeScanned', codes);
        console.log('onCodeScanned value', codes[0].value);
        const qrData = codes[0].value;
        // Navigate to Payment screen with QR data
        navigation.navigate('Payment', { qrData });
      }
    },
  });

  useEffect(() => {
    // exception case
    setRefresh(!refresh);
  }, [device, hasPermission]);

  useEffect(() => {
    const requestCameraPermission = async () => {
      const permission = await Camera.requestCameraPermission();
      console.log('Camera.requestCameraPermission', permission);
      setHasPermission(permission === 'granted');

      // if it is idle for 15 secs, it will be closed
      setTimeout(() => {
        navigation.goBack();
      }, 15 * 1000);
    };

    requestCameraPermission();
  }, []);

  const handleClose = () => {
    navigation.goBack();
  };

  if (device == null || !hasPermission) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-white text-lg font-semibold mb-4 text-center">
            {device == null
              ? 'Camera không khả dụng'
              : 'Camera không được cấp quyền hoặc đang yêu cầu quyền truy cập...'}
          </Text>
          <TouchableOpacity
            onPress={handleClose}
            className="bg-white/20 rounded-2xl px-6 py-3 mt-4"
          >
            <Text className="text-white font-medium">Đóng</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1">
        <Camera
          codeScanner={codeScanner}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
        />

        <View className="absolute top-0 left-0 right-0 flex-row justify-between items-center px-6 py-4 bg-black/50">
          <TouchableOpacity onPress={handleClose} className="p-2">
            <ArrowLeft color="#fff" size={24} />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold">Quét mã QR</Text>
          <View className="w-10" />
        </View>

        <View className="absolute bottom-0 left-0 right-0 px-6 py-6 bg-black/50">
          <Text className="text-white/80 text-center text-sm mb-4">
            Đưa mã QR vào khung hình để quét
          </Text>
          <TouchableOpacity
            onPress={handleClose}
            className="py-2 px-4 border border-white rounded-lg items-center"
          >
            <Text className="text-white text-sm">Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default QRScannerScreen;
