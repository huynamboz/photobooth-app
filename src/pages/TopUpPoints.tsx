import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { bankService, type BankInfoResponse } from '@/services';
import { useAuthStore } from '@/store';
import { AppStackParamList } from '@/types/navigation.type';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Copy, QrCode, Wallet } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Clipboard,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type TopUpPointsNavigationProp = NativeStackNavigationProp<AppStackParamList, 'TopUpPoints'>;

const TopUpPointsScreen = () => {
  const navigation = useNavigation<TopUpPointsNavigationProp>();
  const user = useAuthStore((state) => state.user);
  const getCurrentUser = useAuthStore((state) => state.getCurrentUser);

  const [amount, setAmount] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [bankInfo, setBankInfo] = useState<BankInfoResponse | null>(null);
  const [isLoadingBankInfo, setIsLoadingBankInfo] = useState(true);

  useEffect(() => {
    fetchBankInfo();
  }, []);

  useEffect(() => {
    if (bankInfo) {
      generateQRCode();
    }
  }, [amount, user, bankInfo]);

  const fetchBankInfo = async () => {
    setIsLoadingBankInfo(true);
    try {
      const info = await bankService.getBankInfo();
      setBankInfo(info);
      if (!info) {
        setError('Thông tin ngân hàng chưa được cấu hình. Vui lòng liên hệ admin.');
      }
    } catch (error) {
      console.error('Error fetching bank info:', error);
      setError('Không thể tải thông tin ngân hàng. Vui lòng thử lại sau.');
    } finally {
      setIsLoadingBankInfo(false);
    }
  };

  const generateQRCode = () => {
    if (!bankInfo || !amount || parseFloat(amount) <= 0) {
      setQrCodeUrl('');
      return;
    }

    const params = new URLSearchParams();
    params.append('acc', bankInfo.accountNumber);
    params.append('bank', bankInfo.bankCode);

    if (amount) {
      params.append('amount', amount);
    }

    // Use paymentCode as description (similar to admin panel)
    const paymentCode = user?.paymentCode;
    const transferDescription = paymentCode ? `PTB${paymentCode}` : `PTB${user?.id?.slice(0, 8)}`;
    if (transferDescription) {
      params.append('des', transferDescription);
    }

    const qrUrl = `https://qr.sepay.vn/img?${params.toString()}`;
    setQrCodeUrl(qrUrl);
  };

  const copyQrUrl = () => {
    if (qrCodeUrl) {
      Clipboard.setString(qrCodeUrl);
      setCopied(true);
      Alert.alert('Thành công', 'Đã sao chép URL QR code');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    setError('');
  };

  const handleConfirm = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    // After user transfers money, refresh user info to get updated points
    try {
      await getCurrentUser();
      Alert.alert(
        'Thông báo',
        'Vui lòng chuyển khoản theo QR code. Điểm sẽ được cập nhật sau khi xác nhận thanh toán.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const formatAmount = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');
    return numericValue;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 border-b border-border">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ArrowLeft color="#111" size={24} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-foreground">Nạp điểm</Text>
          <Text className="text-xs text-muted-foreground mt-0.5">
            Quét QR code để chuyển khoản nạp điểm
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Points */}
        <View className="bg-primary/5 rounded-2xl p-4 mb-6 border border-primary/20">
          <Text className="text-sm text-muted-foreground mb-1">Điểm hiện tại</Text>
          <Text className="text-2xl font-bold text-primary">
            {user?.points?.toLocaleString('vi-VN') ?? '0'} điểm
          </Text>
        </View>

        {/* Amount Input */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground mb-2">
            Số tiền muốn nạp (VND)
          </Text>
          <Input
            placeholder="Nhập số tiền"
            value={amount}
            onChangeText={(value) => handleAmountChange(formatAmount(value))}
            keyboardType="numeric"
          />
          <Text className="text-xs text-muted-foreground mt-2">
            1 VND = 1 điểm. Số tiền tối thiểu: 1.000 VND
          </Text>
          {error && <Text className="text-sm text-red-600 mt-2">{error}</Text>}
        </View>

        {/* Loading Bank Info */}
        {isLoadingBankInfo && (
          <View className="items-center justify-center py-8">
            <ActivityIndicator size="large" color="#16a34a" />
            <Text className="text-sm text-muted-foreground mt-3">
              Đang tải thông tin ngân hàng...
            </Text>
          </View>
        )}

        {/* Bank Information */}
        {!isLoadingBankInfo && bankInfo && amount && parseFloat(amount) >= 1000 && (
          <>
            <View className="bg-blue-50 rounded-2xl p-4 mb-6 border border-blue-200">
              <View className="flex-row items-center mb-3">
                <Wallet color="#1e40af" size={20} />
                <Text className="text-base font-semibold text-blue-900 ml-2">
                  Thông tin ngân hàng
                </Text>
              </View>
              <View style={{ gap: 8 }}>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-blue-800">Ngân hàng:</Text>
                  <Text className="text-sm font-medium text-blue-900">
                    {bankInfo.bankName} ({bankInfo.bankCode})
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-blue-800">Số tài khoản:</Text>
                  <Text className="text-sm font-medium text-blue-900">
                    {bankInfo.accountNumber}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-blue-800">Chủ tài khoản:</Text>
                  <Text className="text-sm font-medium text-blue-900">
                    {bankInfo.accountHolderName}
                  </Text>
                </View>
                {bankInfo.branch && (
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-blue-800">Chi nhánh:</Text>
                    <Text className="text-sm font-medium text-blue-900">{bankInfo.branch}</Text>
                  </View>
                )}
                <View className="flex-row justify-between mt-2 pt-2 border-t border-blue-200">
                  <Text className="text-sm text-blue-800">Nội dung chuyển khoản:</Text>
                  <Text className="text-sm font-medium text-blue-900">
                    PTB{user?.paymentCode || user?.id?.slice(0, 8)}
                  </Text>
                </View>
              </View>
            </View>

            {/* QR Code */}
            {qrCodeUrl && (
              <View className="mb-6">
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center">
                    <QrCode color="#16a34a" size={20} />
                    <Text className="text-base font-semibold text-foreground ml-2">
                      Mã QR chuyển khoản
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={copyQrUrl}
                    className="flex-row items-center px-3 py-1.5 border border-border rounded-lg"
                  >
                    {copied ? (
                      <Text className="text-sm text-primary">Đã copy</Text>
                    ) : (
                      <>
                        <Copy color="#6b7280" size={16} />
                        <Text className="text-sm text-muted-foreground ml-1">Copy URL</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
                <View className="bg-gray-50 rounded-2xl p-6 items-center border border-gray-200">
                  <Image
                    source={{ uri: qrCodeUrl }}
                    style={{ width: 250, height: 250 }}
                    resizeMode="contain"
                  />
                </View>
                <Text className="text-xs text-muted-foreground text-center mt-3">
                  Mở ứng dụng ngân hàng và quét mã QR để chuyển khoản
                </Text>
              </View>
            )}

            {/* Instructions */}
            <View className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-200">
              <Text className="text-sm font-semibold text-foreground mb-2">
                Hướng dẫn nạp điểm:
              </Text>
              <View style={{ gap: 8 }}>
                <Text className="text-sm text-muted-foreground">
                  1. Nhập số tiền muốn nạp (tối thiểu 1.000 VND)
                </Text>
                <Text className="text-sm text-muted-foreground">
                  2. Mở ứng dụng ngân hàng và quét mã QR
                </Text>
                <Text className="text-sm text-muted-foreground">
                  3. Kiểm tra thông tin và xác nhận chuyển khoản
                </Text>
                <Text className="text-sm text-muted-foreground">
                  4. Điểm sẽ được cập nhật sau khi xác nhận thanh toán
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Bottom Action Button */}
      {!isLoadingBankInfo && bankInfo && amount && parseFloat(amount) >= 1000 && qrCodeUrl && (
        <View className="px-6 pt-4 pb-6 border-t border-border bg-white">
          <Button
            text="Đã chuyển khoản"
            onPress={handleConfirm}
            className="w-full"
            icon={<Wallet color="#fff" size={20} />}
          />
          <Text className="text-xs text-muted-foreground text-center mt-3">
            Nhấn sau khi đã hoàn tất chuyển khoản. Điểm sẽ được cập nhật sau khi xác nhận.
          </Text>
        </View>
      )}

      {/* Error Message */}
      {!isLoadingBankInfo && !bankInfo && (
        <View className="px-6 pt-4 pb-6 border-t border-border bg-white">
          <View className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
            <Text className="text-sm text-yellow-800 text-center">
              {error || 'Thông tin ngân hàng chưa được cấu hình. Vui lòng liên hệ admin.'}
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default TopUpPointsScreen;
