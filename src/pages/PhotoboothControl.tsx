import { Button } from '@/components/common/Button';
import { ROUTE_NAME } from '@/constants';
import { AppStackParamList } from '@/types/navigation.type';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Sparkles, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FILTER_CARD_WIDTH = (SCREEN_WIDTH - 48 - 12) / 2; // 48 = padding (24*2), 12 = gap

type PhotoboothControlNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'PhotoboothControl'
>;

type FilterOption = {
  id: string;
  name: string;
  preview: string;
  description: string;
};

const filters: FilterOption[] = [
  {
    id: 'normal',
    name: 'Bình thường',
    preview: '📷',
    description: 'Không áp dụng filter',
  },
  {
    id: 'vintage',
    name: 'Vintage',
    preview: '🎞️',
    description: 'Phong cách cổ điển',
  },
  {
    id: 'bw',
    name: 'Đen trắng',
    preview: '⚫',
    description: 'Tone màu cổ điển',
  },
  {
    id: 'vivid',
    name: 'Sống động',
    preview: '🌈',
    description: 'Màu sắc rực rỡ',
  },
  {
    id: 'warm',
    name: 'Ấm áp',
    preview: '☀️',
    description: 'Tone màu ấm',
  },
  {
    id: 'cool',
    name: 'Mát mẻ',
    preview: '❄️',
    description: 'Tone màu lạnh',
  },
  {
    id: 'dramatic',
    name: 'Kịch tính',
    preview: '🎭',
    description: 'Độ tương phản cao',
  },
  {
    id: 'soft',
    name: 'Nhẹ nhàng',
    preview: '💫',
    description: 'Tone màu mềm mại',
  },
];

const PhotoboothControlScreen = () => {
  const navigation = useNavigation<PhotoboothControlNavigationProp>();
  const [selectedFilter, setSelectedFilter] = useState<string>('normal');
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleStartCapture = () => {
    // TODO: Implement capture logic
    console.log('Starting capture with filter:', selectedFilter);
    // Navigate to capture screen or trigger capture
  };

  const handleCancelPress = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
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
  };

  const handleCancelModal = () => {
    setShowCancelModal(false);
  };

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
          <View className="flex-row items-center mb-4">
            <Sparkles color="#16a34a" size={20} />
            <Text className="text-base font-semibold text-foreground ml-2">Chọn Filter</Text>
          </View>
          <Text className="text-sm text-muted-foreground mb-6">
            Áp dụng filter để tạo phong cách riêng cho bức ảnh của bạn
          </Text>

          {/* Filter Grid */}
          <View className="flex-row flex-wrap" style={{ gap: 12 }}>
            {filters.map((filter) => {
              const isSelected = selectedFilter === filter.id;
              return (
                <TouchableOpacity
                  key={filter.id}
                  onPress={() => setSelectedFilter(filter.id)}
                  style={{ width: FILTER_CARD_WIDTH }}
                  className={`rounded-2xl border-2 p-4 ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-border bg-gray-50'
                  }`}
                >
                  <View className="items-center mb-2">
                    <Text className="text-4xl mb-2">{filter.preview}</Text>
                    <Text
                      className={`text-sm font-semibold ${
                        isSelected ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {filter.name}
                    </Text>
                    <Text className="text-xs text-muted-foreground mt-1 text-center">
                      {filter.description}
                    </Text>
                  </View>
                  {isSelected && (
                    <View className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full items-center justify-center">
                      <Text className="text-white text-xs font-bold">✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Preview Section */}
        <View className="px-6 mt-6">
          <View className="bg-gray-100 rounded-3xl p-8 items-center justify-center min-h-[220px] border border-gray-200">
            <View className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
              <Text className="text-6xl text-center">
                {filters.find((f) => f.id === selectedFilter)?.preview || '📷'}
              </Text>
            </View>
            <Text className="text-lg font-semibold text-foreground mb-1">
              {filters.find((f) => f.id === selectedFilter)?.name || 'Bình thường'}
            </Text>
            <Text className="text-sm text-muted-foreground text-center">
              {filters.find((f) => f.id === selectedFilter)?.description || ''}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View className="px-6 pt-4 pb-6 border-t border-border bg-white">
        <Button
          text="Bắt đầu chụp"
          onPress={handleStartCapture}
          className="w-full mb-3"
          icon={<Sparkles color="#fff" size={20} />}
        />
        <Button
          text="Hủy chụp"
          onPress={handleCancelPress}
          variant="destructive"
          className="w-full"
        />
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
            <Text className="text-base text-muted-foreground mb-6">
              Bạn có chắc chắn muốn hủy chụp hình? Thao tác này không thể hoàn tác.
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={handleCancelModal}
                className="flex-1 border border-border rounded-xl py-3 items-center"
              >
                <Text className="text-base font-medium text-foreground">Không</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmCancel}
                className="flex-1 bg-destructive rounded-xl py-3 items-center"
              >
                <Text className="text-base font-medium text-white">Có, hủy chụp</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PhotoboothControlScreen;
