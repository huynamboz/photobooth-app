import { Button } from '@/components/common/Button';
import { ROUTE_NAME } from '@/constants';
import { assetService, photoboothService, type FilterAsset } from '@/services';
import { AppStackParamList } from '@/types/navigation.type';
import { CommonActions, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Sparkles, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// 3 columns: 48 = padding (24*2), 24 = gap (12*2), 3 = number of columns
const FILTER_CARD_WIDTH = (SCREEN_WIDTH - 48 - 24) / 3;

type PhotoboothControlRouteProp = RouteProp<AppStackParamList, 'PhotoboothControl'>;
type PhotoboothControlNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'PhotoboothControl'
>;

// Default "no filter" option
const DEFAULT_FILTER: FilterAsset = {
  id: 'none',
  imageUrl: '',
  publicId: '',
  type: 'filter',
  filterType: 'none',
  scale: '1.00',
  offset_y: '0.00',
  anchor_idx: 0,
  left_idx: 0,
  right_idx: 0,
  createdAt: '',
  updatedAt: '',
};

const PhotoboothControlScreen = () => {
  const navigation = useNavigation<PhotoboothControlNavigationProp>();
  const route = useRoute<PhotoboothControlRouteProp>();
  const { sessionId, photoboothId } = route.params;
  // photoboothId may be used in future features
  const [filters, setFilters] = useState<FilterAsset[]>([DEFAULT_FILTER]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);
  const [filterError, setFilterError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentFilterIds, setCurrentFilterIds] = useState<string[]>([]);
  const [isChangingFilter, setIsChangingFilter] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [hasStartedCapture, setHasStartedCapture] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleStartCapture = async () => {
    if (isCapturing) return;

    setIsCapturing(true);
    try {
      console.log('Starting capture for session:', sessionId, 'photobooth:', photoboothId);

      // Start capture only (session should already be started from PrepareCapture)
      const response = await photoboothService.startCapture(sessionId);
      console.log('Start capture response:', response);

      // Mark that capture has been started
      setHasStartedCapture(true);

      // Show success message
      Alert.alert('Thành công', 'Đã gửi lệnh chụp hình. Photobooth sẽ bắt đầu chụp ảnh.', [
        { text: 'OK' },
      ]);
    } catch (error) {
      console.error('Error starting capture:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Không thể bắt đầu chụp hình. Vui lòng thử lại.';
      Alert.alert('Lỗi', errorMessage, [{ text: 'OK' }]);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleCancelPress = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (isCancelling) return;

    setIsCancelling(true);
    try {
      await photoboothService.cancelSession(sessionId);
      setShowCancelModal(false);
      // Reset navigation to Home
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'app',
              state: {
                routes: [{ name: ROUTE_NAME.HOMESCREEN }],
                index: 0,
              },
            },
          ],
        }),
      );
    } catch (error) {
      console.error('Error cancelling session:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Không thể hủy phiên chụp. Vui lòng thử lại.';
      Alert.alert('Lỗi', errorMessage, [{ text: 'OK' }]);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCancelModal = () => {
    setShowCancelModal(false);
  };

  const handleFilterSelect = async (filterId: string) => {
    if (isChangingFilter) return;

    setIsChangingFilter(true);
    try {
      // If selecting "none", remove all current filters
      if (filterId === 'none') {
        // Remove all current filters
        const removePromises = currentFilterIds.map((id) =>
          photoboothService.removeFilter(sessionId, id),
        );
        if (removePromises.length > 0) {
          await Promise.all(removePromises);
        }
        setCurrentFilterIds([]);
      } else {
        // Toggle filter: if already selected, remove it; if not, add it
        const isCurrentlySelected = currentFilterIds.includes(filterId);

        if (isCurrentlySelected) {
          // Remove the filter
          await photoboothService.removeFilter(sessionId, filterId);
          setCurrentFilterIds(currentFilterIds.filter((id) => id !== filterId));
        } else {
          // Add the filter
          await photoboothService.addFilter(sessionId, filterId);
          setCurrentFilterIds([...currentFilterIds, filterId]);
        }
      }
    } catch (error) {
      console.error('Error changing filter:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Không thể thay đổi filter. Vui lòng thử lại.';
      Alert.alert('Lỗi', errorMessage, [{ text: 'OK' }]);
    } finally {
      setIsChangingFilter(false);
    }
  };

  useEffect(() => {
    const fetchFilters = async () => {
      setIsLoadingFilters(true);
      setFilterError(null);
      try {
        const response = await assetService.getFilters({ page: 1, limit: 10 });
        // Add default "none" filter at the beginning
        setFilters([DEFAULT_FILTER, ...response.data]);
      } catch (error) {
        console.error('Error fetching filters:', error);
        setFilterError('Không thể tải danh sách filter. Vui lòng thử lại.');
        // Keep default filter even on error
        setFilters([DEFAULT_FILTER]);
      } finally {
        setIsLoadingFilters(false);
      }
    };

    const fetchCurrentSession = async () => {
      try {
        const session = await photoboothService.getCurrentSession();
        if (session && session.id === sessionId) {
          // Sync current filterIds with session
          const filterIds = session.filterIds || [];
          setCurrentFilterIds(filterIds);
        }
      } catch (error) {
        console.error('Error fetching current session:', error);
      }
    };

    fetchFilters();
    fetchCurrentSession();
  }, [sessionId]);

  // Poll session status to check if it's still active (only when session has started)
  useEffect(() => {
    // Only start polling when session has been started
    if (!hasStartedCapture) {
      // Clear any existing interval if capture hasn't started
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const checkSessionStatus = async () => {
      try {
        const session = await photoboothService.getSession(sessionId);
        // Check if session is not active (status !== 'active')
        // Also handle case where session might have an 'active' boolean field
        const isActive = session.status === 'active' || (session as any).active === true;

        if (!isActive) {
          // Clear interval
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }

          // Reset navigation to home and navigate to history tab
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'app',
                  state: {
                    routes: [{ name: ROUTE_NAME.HISTORY }],
                    index: 0,
                  },
                },
              ],
            }),
          );
        }
      } catch (error) {
        console.error('Error checking session status:', error);
        // If session not found or error, also navigate away
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'app',
                state: {
                  routes: [{ name: ROUTE_NAME.HISTORY }],
                  index: 0,
                },
              },
            ],
          }),
        );
      }
    };

    // Set up interval to check session status every 3 seconds
    intervalRef.current = setInterval(checkSessionStatus, 3000);

    // Cleanup interval on unmount or when hasStartedCapture changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [sessionId, navigation, hasStartedCapture]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 border-b border-border">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-foreground">Điều khiển Photobooth</Text>
          <Text className="text-xs text-muted-foreground mt-0.5">
            Chọn filter và bắt đầu chụp hình
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Filter Selection Section */}
        <View className="px-6 pt-6">
          <View className="flex-row items-center mb-3">
            <Sparkles color="#16a34a" size={18} />
            <Text className="text-base font-semibold text-foreground ml-2">Chọn Filter</Text>
          </View>

          {/* Filter Grid */}
          {isLoadingFilters ? (
            <View className="py-8 items-center justify-center">
              <ActivityIndicator size="large" color="#16a34a" />
              <Text className="text-sm text-muted-foreground mt-4">Đang tải filters...</Text>
            </View>
          ) : filterError ? (
            <View className="py-8 items-center justify-center">
              <Text className="text-sm text-red-600 text-center">{filterError}</Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap" style={{ gap: 12 }}>
              {filters.map((filter) => {
                const isSelected =
                  filter.id === 'none'
                    ? currentFilterIds.length === 0
                    : currentFilterIds.includes(filter.id);
                const isNoneFilter = filter.id === 'none';
                return (
                  <TouchableOpacity
                    key={filter.id}
                    onPress={() => handleFilterSelect(filter.id)}
                    style={{ width: FILTER_CARD_WIDTH }}
                    className={`rounded-xl border-2 p-2.5 ${
                      isSelected ? 'border-primary bg-primary/5' : 'border-border bg-gray-50'
                    } ${isChangingFilter ? 'opacity-50' : ''}`}
                    disabled={isChangingFilter}
                  >
                    <View className="items-center">
                      {isNoneFilter ? (
                        <View className="w-12 h-12 rounded-lg bg-gray-200 items-center justify-center mb-1.5">
                          <Text className="text-2xl">📷</Text>
                        </View>
                      ) : (
                        <View className="w-12 h-12 rounded-lg overflow-hidden mb-1.5 bg-gray-100">
                          <Image
                            source={{ uri: filter.imageUrl }}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="cover"
                          />
                        </View>
                      )}
                      <Text
                        className={`text-xs font-medium text-center ${
                          isSelected ? 'text-primary' : 'text-foreground'
                        }`}
                        numberOfLines={1}
                      >
                        {isNoneFilter ? 'Không filter' : filter.filterType || 'Filter'}
                      </Text>
                    </View>
                    {isSelected && (
                      <View className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary rounded-full items-center justify-center">
                        <Text className="text-white text-[10px] font-bold">✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View className="px-6 pt-4 pb-6 border-t border-border bg-white">
        {!hasStartedCapture && (
          <Button
            text={isCapturing ? 'Đang bắt đầu...' : 'Bắt đầu chụp'}
            onPress={handleStartCapture}
            className="w-full mb-3"
            icon={<Sparkles color="#fff" size={20} />}
            disabled={isCapturing}
          />
        )}
        {hasStartedCapture && (
          <Button
            text="Đang trong phiên chụp"
            onPress={() => {}}
            className="w-full mb-3"
            icon={<Sparkles color="#fff" size={20} />}
            disabled={true}
          />
        )}
        {!hasStartedCapture && (
          <Button
            text="Hủy chụp"
            onPress={handleCancelPress}
            variant="destructive"
            className="w-full"
          />
        )}
        <Text className="text-xs text-muted-foreground text-center mt-3">
          Ảnh sẽ được gửi về điện thoại của bạn sau khi chụp
        </Text>
      </View>

      {/* Cancel Confirmation Modal */}
      <Modal
        visible={showCancelModal}
        transparent
        animationType="fade"
        onRequestClose={handleCancelModal}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white rounded-3xl p-6 w-full max-w-sm">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold text-foreground">Xác nhận hủy</Text>
              <TouchableOpacity onPress={handleCancelModal}>
                <X color="#6b7280" size={20} />
              </TouchableOpacity>
            </View>
            <View className="mb-6">
              <Text className="text-base text-muted-foreground mb-3">
                Bạn có chắc chắn muốn hủy chụp hình? Thao tác này không thể hoàn tác.
              </Text>
              <View className="bg-red-50 rounded-xl p-3 border border-red-200">
                <Text className="text-sm font-semibold text-red-900 mb-1">⚠️ Lưu ý quan trọng</Text>
                <Text className="text-sm text-red-800">
                  Nếu hủy chụp hình, điểm đã sử dụng sẽ không được hoàn lại.
                </Text>
              </View>
            </View>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={handleCancelModal}
                className="flex-1 border border-border rounded-xl py-3 items-center"
                disabled={isCancelling}
              >
                <Text className="text-base font-medium text-foreground">Không</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmCancel}
                className="flex-1 bg-destructive rounded-xl py-3 items-center"
                disabled={isCancelling}
              >
                {isCancelling ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-base font-medium text-white">Có, hủy chụp</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PhotoboothControlScreen;
