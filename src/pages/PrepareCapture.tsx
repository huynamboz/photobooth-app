import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import {
  bankService,
  photoboothService,
  type BankInfoResponse,
  type PhotoboothResponse,
} from '@/services';
import { useAuthStore } from '@/store';
import { AppStackParamList } from '@/types/navigation.type';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Copy, QrCode, Wallet } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Clipboard,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type PrepareCaptureRouteProp = RouteProp<AppStackParamList, 'PrepareCapture'>;
type PrepareCaptureNavigationProp = NativeStackNavigationProp<AppStackParamList, 'PrepareCapture'>;

const CAPTURE_COST = 10000;

// TopUpModal Component (reused from TopUpPoints logic)
const TopUpModal = ({
  visible,
  onClose,
  onSuccess,
}: {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const user = useAuthStore((state) => state.user);
  const getCurrentUser = useAuthStore((state) => state.getCurrentUser);

  const [amount, setAmount] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [bankInfo, setBankInfo] = useState<BankInfoResponse | null>(null);
  const [isLoadingBankInfo, setIsLoadingBankInfo] = useState(true);

  useEffect(() => {
    if (visible) {
      fetchBankInfo();
      setAmount('');
      setQrCodeUrl('');
      setError('');
      setCopied(false);
    }
  }, [visible]);

  useEffect(() => {
    if (bankInfo && visible) {
      generateQRCode();
    }
  }, [amount, user, bankInfo, visible]);

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
    const numericValue = value.replace(/[^0-9]/g, '');
    setAmount(numericValue);
    setError('');
  };

  const handleConfirm = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    try {
      await getCurrentUser();
      Alert.alert(
        'Thông báo',
        'Vui lòng chuyển khoản theo QR code. Điểm sẽ được cập nhật sau khi xác nhận thanh toán.',
        [
          {
            text: 'OK',
            onPress: () => {
              onSuccess();
              onClose();
            },
          },
        ],
      );
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center px-6 py-4 border-b border-border">
          <TouchableOpacity onPress={onClose} className="mr-4">
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
              onChangeText={handleAmountChange}
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
            </>
          )}

          {/* Error Message */}
          {!isLoadingBankInfo && !bankInfo && (
            <View className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
              <Text className="text-sm text-yellow-800 text-center">
                {error || 'Thông tin ngân hàng chưa được cấu hình. Vui lòng liên hệ admin.'}
              </Text>
            </View>
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
      </SafeAreaView>
    </Modal>
  );
};

const PrepareCaptureScreen = () => {
  const navigation = useNavigation<PrepareCaptureNavigationProp>();
  const route = useRoute<PrepareCaptureRouteProp>();
  const { qrData } = route.params;
  const user = useAuthStore((state) => state.user);
  const getCurrentUser = useAuthStore((state) => state.getCurrentUser);

  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [hasEnoughPoints, setHasEnoughPoints] = useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [photoboothId, setPhotoboothId] = useState<string | null>(null);
  const [photobooth, setPhotobooth] = useState<PhotoboothResponse | null>(null);
  const [isLoadingPhotobooth, setIsLoadingPhotobooth] = useState(false);

  useEffect(() => {
    // Parse QR data to get photoboothId
    // Assuming qrData is the photoboothId (UUID format)
    // If QR has different format, adjust parsing logic here
    const id = qrData.trim();
    setPhotoboothId(id);
    checkPoints();

    // Fetch photobooth details when we have the ID
    if (id) {
      fetchPhotoboothDetails(id);
    }
  }, [qrData, user?.points]);

  // Update points when screen is focused
  useFocusEffect(
    useCallback(() => {
      const updatePoints = async () => {
        try {
          await getCurrentUser();
          checkPoints();
        } catch (error) {
          console.error('Error updating points:', error);
        }
      };
      updatePoints();
    }, [getCurrentUser]),
  );

  const fetchPhotoboothDetails = async (id: string) => {
    setIsLoadingPhotobooth(true);
    try {
      const response = await photoboothService.getAvailablePhotobooths();
      console.log('response', response);
      // Filter photobooth by id from QR code
      const foundPhotobooth = response.find((pb) => pb.id === id);
      if (foundPhotobooth) {
        setPhotobooth(foundPhotobooth);
      } else {
        // If not found in available list, still show basic info with photoboothId
        console.warn('Photobooth not found in available list:', id);
        setPhotobooth({
          id,
          name: `Photobooth ${id.slice(0, 8)}...`,
          status: 'unavailable',
          location: '',
          description: '',
        });
      }
    } catch (error) {
      console.error('Error fetching photobooth details:', error);
      // Even on error, show basic info with photoboothId
      setPhotobooth({
        id,
        name: `Photobooth ${id.slice(0, 8)}...`,
        status: 'unknown',
        location: '',
        description: '',
      });
    } finally {
      setIsLoadingPhotobooth(false);
    }
  };

  const checkPoints = () => {
    const currentPoints = user?.points ?? 0;
    setHasEnoughPoints(currentPoints >= CAPTURE_COST);
  };

  const handleStartCapture = async () => {
    if (!photoboothId) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin photobooth. Vui lòng quét lại QR code.');
      return;
    }

    setIsCreatingSession(true);
    try {
      // Step 1: Create session
      const session = await photoboothService.createSession({
        photoboothId,
        maxPhotos: 4, // Default max photos
      });

      // Step 2: Start session
      await photoboothService.startSession(session.id);

      // Navigate to PhotoboothControl with session info
      navigation.navigate('PhotoboothControl', {
        sessionId: session.id,
        photoboothId: session.photoboothId,
      });
    } catch (error: any) {
      console.error('Error creating/starting session:', error);
      Alert.alert('Lỗi', error?.message || 'Không thể tạo phiên chụp hình. Vui lòng thử lại.', [
        { text: 'OK' },
      ]);
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleTopUpSuccess = async () => {
    // Refresh user info to get updated points
    await getCurrentUser();
    // Points will be checked in useEffect
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-6 py-4 border-b border-border">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ArrowLeft color="#111" size={24} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-foreground">Chuẩn bị chụp hình</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {/* Photobooth Info */}
        {isLoadingPhotobooth ? (
          <View className="bg-white rounded-3xl border border-border p-6 mb-6 items-center">
            <ActivityIndicator size="small" color="#16a34a" />
            <Text className="text-sm text-muted-foreground mt-2">
              Đang tải thông tin photobooth...
            </Text>
          </View>
        ) : photobooth ? (
          <View
            className={`rounded-3xl border p-6 mb-6 ${
              photobooth.status === 'available'
                ? 'bg-blue-50 border-blue-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <View className="flex-row items-center mb-3">
              <QrCode color={photobooth.status === 'available' ? '#1e40af' : '#6b7280'} size={20} />
              <Text
                className={`text-base font-semibold ml-2 ${
                  photobooth.status === 'available' ? 'text-blue-900' : 'text-gray-900'
                }`}
              >
                Thông tin Photobooth
              </Text>
            </View>
            <View style={{ gap: 8 }}>
              <View className="flex-row justify-between">
                <Text
                  className={`text-sm ${
                    photobooth.status === 'available' ? 'text-blue-800' : 'text-gray-700'
                  }`}
                >
                  Tên:
                </Text>
                <Text
                  className={`text-sm font-medium ${
                    photobooth.status === 'available' ? 'text-blue-900' : 'text-gray-900'
                  }`}
                >
                  {photobooth.name}
                </Text>
              </View>
              {photobooth.location && (
                <View className="flex-row justify-between">
                  <Text
                    className={`text-sm ${
                      photobooth.status === 'available' ? 'text-blue-800' : 'text-gray-700'
                    }`}
                  >
                    Vị trí:
                  </Text>
                  <Text
                    className={`text-sm font-medium ${
                      photobooth.status === 'available' ? 'text-blue-900' : 'text-gray-900'
                    }`}
                  >
                    {photobooth.location}
                  </Text>
                </View>
              )}
              <View className="flex-row justify-between">
                <Text
                  className={`text-sm ${
                    photobooth.status === 'available' ? 'text-blue-800' : 'text-gray-700'
                  }`}
                >
                  Trạng thái:
                </Text>
                <Text
                  className={`text-sm font-medium ${
                    photobooth.status === 'available'
                      ? 'text-green-600'
                      : photobooth.status === 'unavailable'
                        ? 'text-red-600'
                        : 'text-gray-600'
                  }`}
                >
                  {photobooth.status === 'available'
                    ? 'Sẵn sàng'
                    : photobooth.status === 'unavailable'
                      ? 'Không khả dụng'
                      : photobooth.status === 'unknown'
                        ? 'Không xác định'
                        : photobooth.status}
                </Text>
              </View>
              {photobooth.description && (
                <View className="mt-2 pt-2 border-t border-gray-200">
                  <Text
                    className={`text-sm mb-1 ${
                      photobooth.status === 'available' ? 'text-blue-800' : 'text-gray-700'
                    }`}
                  >
                    Mô tả:
                  </Text>
                  <Text
                    className={`text-sm font-medium ${
                      photobooth.status === 'available' ? 'text-blue-900' : 'text-gray-900'
                    }`}
                  >
                    {photobooth.description}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ) : null}

        {/* Points Status */}
        {hasEnoughPoints ? (
          <View className="bg-green-50 rounded-3xl border border-green-200 p-6 mb-6">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 rounded-full bg-green-100 items-center justify-center mr-4">
                <Text className="text-2xl">✓</Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-green-900">Đủ điểm để chụp hình</Text>
                <Text className="text-sm text-green-700 mt-1">
                  Buổi chụp này sẽ tốn {CAPTURE_COST.toLocaleString('vi-VN')} điểm
                </Text>
              </View>
            </View>
            <View className="bg-white rounded-2xl p-4 border border-green-200">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-green-800">Điểm hiện tại:</Text>
                <Text className="text-base font-bold text-green-900">
                  {user?.points?.toLocaleString('vi-VN') ?? '0'} điểm
                </Text>
              </View>
              <View className="flex-row justify-between items-center mt-2 pt-2 border-t border-green-200">
                <Text className="text-sm text-green-800">Sau khi chụp:</Text>
                <Text className="text-base font-bold text-green-900">
                  {((user?.points ?? 0) - CAPTURE_COST).toLocaleString('vi-VN')} điểm
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View className="bg-red-50 rounded-3xl border border-red-200 p-6 mb-6">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 rounded-full bg-red-100 items-center justify-center mr-4">
                <Text className="text-2xl">⚠</Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-red-900">
                  Không đủ điểm để chụp hình
                </Text>
                <Text className="text-sm text-red-700 mt-1">
                  Buổi chụp này cần {CAPTURE_COST.toLocaleString('vi-VN')} điểm
                </Text>
              </View>
            </View>
            <View className="bg-white rounded-2xl p-4 border border-red-200">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-red-800">Điểm hiện tại:</Text>
                <Text className="text-base font-bold text-red-900">
                  {user?.points?.toLocaleString('vi-VN') ?? '0'} điểm
                </Text>
              </View>
              <View className="flex-row justify-between items-center mt-2 pt-2 border-t border-red-200">
                <Text className="text-sm text-red-800">Còn thiếu:</Text>
                <Text className="text-base font-bold text-red-900">
                  {(CAPTURE_COST - (user?.points ?? 0)).toLocaleString('vi-VN')} điểm
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Action Button */}
      <View className="px-6 pt-4 pb-6 border-t border-border bg-white">
        {hasEnoughPoints ? (
          <Button
            text={isCreatingSession ? 'Đang tạo phiên chụp...' : 'Bắt đầu ngay'}
            onPress={handleStartCapture}
            className="w-full"
            icon={
              isCreatingSession ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <QrCode color="#fff" size={20} />
              )
            }
            disabled={isCreatingSession || photobooth?.status !== 'available'}
          />
        ) : (
          <Button
            text="Nạp tiền ngay"
            onPress={() => setShowTopUpModal(true)}
            className="w-full"
            icon={<Wallet color="#fff" size={20} />}
          />
        )}
      </View>

      {/* TopUp Modal */}
      <TopUpModal
        visible={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        onSuccess={handleTopUpSuccess}
      />
    </SafeAreaView>
  );
};

export default PrepareCaptureScreen;
