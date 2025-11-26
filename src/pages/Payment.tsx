import { Button } from '@/components/common/Button';
import { AppStackParamList } from '@/types/navigation.type';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type PaymentRouteProp = RouteProp<AppStackParamList, 'Payment'>;
type PaymentNavigationProp = NativeStackNavigationProp<AppStackParamList, 'Payment'>;

const PaymentScreen = () => {
  const navigation = useNavigation<PaymentNavigationProp>();
  const route = useRoute<PaymentRouteProp>();
  const { qrData } = route.params;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-6 py-4 border-b border-border">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ArrowLeft color="#111" size={24} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-foreground">Thanh toán</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <View className="bg-white rounded-3xl border border-border p-6 mb-6">
          <Text className="text-sm text-muted-foreground mb-2">Mã QR đã quét</Text>
          <View className="bg-gray-50 rounded-2xl p-4 mb-4">
            <Text className="text-base font-mono text-foreground break-all">{qrData}</Text>
          </View>

          <View className="border-t border-border pt-4 mt-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-muted-foreground">Thông tin từ QR</Text>
            </View>
            <Text className="text-sm text-muted-foreground">
              Dữ liệu quét được sẽ được xử lý để hiển thị thông tin thanh toán
            </Text>
          </View>
        </View>

        <Button
          text="Xác nhận thanh toán"
          onPress={() => {
            // TODO: Implement payment logic
            console.log('Payment confirmed for:', qrData);
          }}
          className="w-full"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentScreen;
