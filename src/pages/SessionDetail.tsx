import { Button } from '@/components/common/Button';
import { assetService, photoboothService } from '@/services';
import { AppStackParamList } from '@/types/navigation.type';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Camera, Frame, Printer } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ViewShot from 'react-native-view-shot';

type SessionDetailRouteProp = RouteProp<AppStackParamList, 'SessionDetail'>;
type SessionDetailNavigationProp = NativeStackNavigationProp<AppStackParamList, 'SessionDetail'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PREVIEW_WIDTH = SCREEN_WIDTH - 48; // 48 = padding (24*2)
// Frame dimensions: 3623 × 10562, aspect ratio ≈ 0.343
// PREVIEW_HEIGHT = PREVIEW_WIDTH / aspect_ratio
const PREVIEW_HEIGHT = PREVIEW_WIDTH / (3623 / 10562); // ≈ PREVIEW_WIDTH * 2.915

const SessionDetailScreen = () => {
  const navigation = useNavigation<SessionDetailNavigationProp>();
  const route = useRoute<SessionDetailRouteProp>();
  const { sessionId } = route.params;

  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [frames, setFrames] = useState<any[]>([]);
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);
  const [isLoadingFrames, setIsLoadingFrames] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const viewShotRef = useRef<ViewShot>(null);

  const fetchSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await photoboothService.getSession(sessionId);
      setSession(data);
    } catch (error) {
      console.error('Error fetching session:', error);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    const fetchFrames = async () => {
      setIsLoadingFrames(true);
      try {
        const response = await assetService.getFrames({ page: 1, limit: 20 });
        setFrames(response.data);
        if (response.data.length > 0) {
          setSelectedFrame(response.data[0].id);
        }
      } catch (error) {
        console.error('Error fetching frames:', error);
        setFrames([]);
      } finally {
        setIsLoadingFrames(false);
      }
    };

    fetchFrames();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchSession();
    }, [fetchSession]),
  );

  const handleSaveImage = async () => {
    if (!viewShotRef.current || !viewShotRef.current.capture || sortedPhotos.length === 0) {
      Alert.alert('Lỗi', 'Không có ảnh để lưu');
      return;
    }

    setIsSaving(true);
    try {
      // Capture the view
      const uri = await viewShotRef.current.capture();
      console.log('Image captured at:', uri);

      // Share/Save image using native Share API
      // On iOS, this will show share sheet with "Save Image" option
      // On Android, this will show share sheet with various apps including gallery
      const shareOptions = Platform.OS === 'ios' ? { url: uri } : { url: `file://${uri}` };

      const result = await Share.share(shareOptions);

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // User selected an activity type (e.g., Save to Photos on iOS)
          console.log('Image shared via:', result.activityType);
        } else {
          // Shared successfully
          console.log('Image shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        // User dismissed the share sheet
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert('Lỗi', 'Không thể lưu ảnh. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#16a34a" />
          <Text className="text-sm text-muted-foreground mt-4">Đang tải chi tiết...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!session) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center px-6 py-4 border-b border-border">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
            <ArrowLeft color="#111" size={24} />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-foreground">Chi tiết phiên chụp</Text>
        </View>
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-base text-muted-foreground text-center">
            Không tìm thấy thông tin phiên chụp
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const photos = session.photos || [];
  const sortedPhotos = [...photos].sort((a, b) => a.order - b.order);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-6 py-4 border-b border-border">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ArrowLeft color="#111" size={24} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-foreground">Chọn khung ảnh</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        {/* Frame Selection Section - Moved to top */}
        <View className="mb-6">
          <View className="flex-row items-center mb-4">
            <Frame color="#16a34a" size={18} />
            <Text className="text-base font-semibold text-foreground ml-2">Chọn khung</Text>
          </View>

          {isLoadingFrames ? (
            <View className="py-8 items-center justify-center">
              <ActivityIndicator size="large" color="#16a34a" />
              <Text className="text-sm text-muted-foreground mt-4">Đang tải khung ảnh...</Text>
            </View>
          ) : frames.length === 0 ? (
            <View className="bg-gray-50 rounded-2xl p-6 items-center border border-gray-200">
              <Frame color="#9ca3af" size={32} />
              <Text className="text-sm text-muted-foreground mt-3 text-center">
                Chưa có khung ảnh nào
              </Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row" style={{ gap: 12 }}>
                {/* No frame option */}
                <TouchableOpacity
                  onPress={() => setSelectedFrame(null)}
                  className={`rounded-xl border-2 p-3 ${
                    selectedFrame === null
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-gray-50'
                  }`}
                >
                  <View className="w-16 h-20 rounded-lg bg-gray-200 items-center justify-center">
                    <Text className="text-xs text-gray-600">Không khung</Text>
                  </View>
                </TouchableOpacity>

                {/* Frame options */}
                {frames.map((frame) => {
                  const isSelected = selectedFrame === frame.id;
                  return (
                    <TouchableOpacity
                      key={frame.id}
                      onPress={() => setSelectedFrame(frame.id)}
                      className={`rounded-xl border-2 p-3 ${
                        isSelected ? 'border-primary bg-primary/5' : 'border-border bg-gray-50'
                      }`}
                    >
                      <View className="w-16 h-20 rounded-lg overflow-hidden bg-gray-100">
                        {frame.imageUrl ? (
                          <Image
                            source={{ uri: frame.imageUrl }}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="cover"
                          />
                        ) : (
                          <View className="w-full h-full items-center justify-center">
                            <Frame color="#9ca3af" size={24} />
                          </View>
                        )}
                      </View>
                      {isSelected && (
                        <View className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full items-center justify-center">
                          <Text className="text-white text-[8px] font-bold">✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </View>

        {/* Preview Section - 4 photos vertical */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground mb-4">Xem trước</Text>
          {sortedPhotos.length === 0 ? (
            <View className="bg-gray-50 rounded-2xl p-8 items-center justify-center border border-gray-200 min-h-[400]">
              <Camera color="#9ca3af" size={48} />
              <Text className="text-base text-muted-foreground mt-4 text-center">
                Chưa có ảnh nào trong phiên chụp này
              </Text>
            </View>
          ) : (
            <ViewShot
              ref={viewShotRef}
              options={{ format: 'jpg', quality: 0.9 }}
              style={{ width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT }}
            >
              <View
                className="bg-gray-100 rounded-2xl overflow-hidden border border-gray-200"
                style={{ width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT, position: 'relative' }}
              >
                {/* Photos - nằm dưới */}
                <View className="flex-1 flex-col gap-5 px-8 mt-5" style={{ zIndex: 0 }}>
                  {sortedPhotos.slice(0, 4).map((photo, index) => {
                    const photoHeight = 210;
                    return (
                      <View
                        key={photo.id}
                        style={{ height: photoHeight, position: 'relative' }}
                        className={index < 3 ? 'border-b border-gray-300' : ''}
                      >
                        {/* Photo overlay lên frame */}
                        <Image
                          source={{ uri: photo.imageUrl }}
                          style={{ width: '100%', height: '100%' }}
                          resizeMode="cover"
                        />
                      </View>
                    );
                  })}
                </View>

                {/* Frame overlay - nằm trên */}
                {selectedFrame &&
                  (() => {
                    const selectedFrameData = frames.find((f) => f.id === selectedFrame);
                    return selectedFrameData?.imageUrl ? (
                      <Image
                        source={{ uri: selectedFrameData.imageUrl }}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          zIndex: 1,
                        }}
                        resizeMode="contain"
                      />
                    ) : null;
                  })()}
              </View>
            </ViewShot>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Button - Save Image */}
      {sortedPhotos.length > 0 && (
        <View className="px-6 pt-4 pb-6 border-t border-border bg-white">
          <Button
            text={isSaving ? 'Đang lưu...' : 'In ảnh ngay'}
            onPress={handleSaveImage}
            className="w-full"
            icon={<Printer color="#fff" size={20} />}
            disabled={isSaving}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default SessionDetailScreen;
