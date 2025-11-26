import { Button } from '@/components/common/Button';
import { useAuthStore } from '@/store';
import { AppStackParamList } from '@/types/navigation.type';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Aperture, ArrowRight, Camera, CreditCard, MapPin, QrCode } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type HomeNavigationProp = NativeStackNavigationProp<AppStackParamList>;

// insights sẽ được tính toán động dựa trên user data

const highlightFeatures = [
  {
    id: 'live',
    title: 'Điều khiển live',
    description: 'Xem khung hình trực tiếp, căn chỉnh ánh sáng và áp dụng filter ngay lập tức.',
    accent: '#0ea5e9',
    icon: Camera,
  },
  {
    id: 'instant',
    title: 'Chụp tức thì',
    description: 'Gửi lệnh chụp tự động cho booth đang hoạt động chỉ trong một thao tác.',
    accent: '#22c55e',
    icon: Aperture,
  },
  {
    id: 'share',
    title: 'Chia sẻ nhanh',
    description: 'Tự động đẩy ảnh đã chụp về điện thoại của khách để đăng tải ngay.',
    accent: '#f97316',
    icon: ArrowRight,
  },
] as const;

const inspirationShots = [1, 2, 3, 4];

const bookings = [
  {
    id: 'b1',
    title: 'Date Night Moodboard',
    studio: 'Studio D1 • Nguyễn Huệ',
    time: 'Hôm nay • 18:30',
  },
  {
    id: 'b2',
    title: 'Retro Flash Concept',
    studio: 'Studio Q10 • Japan Town',
    time: 'Ngày mai • 14:00',
  },
] as const;

const HomeScreen = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const user = useAuthStore((state) => state.user);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Buổi chiều vui vẻ';
    return 'Chào buổi tối';
  }, []);

  const insights = useMemo(
    () => [
      { id: 'sessions', label: 'Lượt chụp', value: '24', sub: 'Trong tháng', icon: Camera },
      {
        id: 'points',
        label: 'Photopoint',
        value: user?.points?.toLocaleString('vi-VN') ?? '0',
        sub: 'Điểm thưởng',
        icon: CreditCard,
      },
      { id: 'studios', label: 'Studio yêu thích', value: '03', sub: 'Đã ghim', icon: MapPin },
    ],
    [user?.points],
  );

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
        <View className="mt-6 rounded-3xl overflow-hidden bg-white shadow-xs">
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=60',
            }}
            style={{ width: '100%', height: 220 }}
          />
          <View className="absolute z-20 top-0 left-0 w-full h-full bg-black/50 opacity-95" />
          <View className="z-30 absolute inset-0 px-6 py-6 justify-between">
            <View>
              <Text className="text-xs uppercase tracking-[0.3em] text-white/80">{greeting}</Text>
              <Text className="text-3xl font-semibold text-white mt-2">
                {user?.name ?? 'Khách hàng'}
              </Text>
              <Text className="text-white/90 mt-3 text-base">
                Làm chủ mọi buổi chụp với bảng điều khiển Photobooth Studio.
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-white/70 text-xs uppercase tracking-wide">Photopoint</Text>
                <Text className="text-white text-2xl font-semibold mt-1">
                  {user?.points?.toLocaleString('vi-VN') ?? '0'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('TopUpPoints')}
                className="bg-white rounded-2xl px-4 py-2 flex-row items-center shadow-sm"
              >
                <Text className="text-emerald-600 font-medium mr-2">Nạp thêm</Text>
                <ArrowRight color="#059669" size={16} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 20 }}
        >
          {insights.map((item) => (
            <View key={item.id} className="mr-4 w-40">
              <View className="bg-white rounded-2xl border border-[#e5e7eb] px-4 py-4 shadow-sm">
                <View className="w-10 h-10 rounded-xl bg-[#ecfdf3] justify-center items-center mb-3">
                  <item.icon color="#22c55e" size={20} strokeWidth={2} />
                </View>
                <Text className="text-foreground font-semibold text-2xl">{item.value}</Text>
                <Text className="text-muted-foreground text-sm mt-1">{item.label}</Text>
                <Text className="text-gray-400 text-xs mt-1">{item.sub}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View className="bg-white rounded-3xl py-5 w-full">
          <Text className="text-lg font-semibold text-foreground">
            Cùng chụp những bức hình đẹp
          </Text>
          <Text className="text-muted-foreground mt-1">
            Kết nối Photobooth để điều chỉnh ánh sáng, filter và tạo nên bộ ảnh đậm chất riêng chỉ
            với vài thao tác.
          </Text>
          <View className="mt-5 flex flex-col gap-3">
            {highlightFeatures.map((feature) => (
              <View
                key={feature.id}
                className="flex-row items-start border border-border rounded-2xl px-4 py-4 bg-white"
              >
                <View
                  className="w-10 h-10 rounded-2xl mr-4 justify-center items-center"
                  style={{ backgroundColor: `${feature.accent}20` }}
                >
                  <feature.icon color={feature.accent} size={20} strokeWidth={2} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-foreground">{feature.title}</Text>
                  <Text className="text-sm text-muted-foreground mt-1">{feature.description}</Text>
                </View>
              </View>
            ))}
          </View>
          <Button
            text="Chụp hình ngay"
            icon={<QrCode color="#fff" size={20} strokeWidth={2} />}
            className="mt-5"
            contentClassName="justify-center"
            onPress={() => navigation.navigate('QRScanner')}
          />
        </View>

        <View className="mt-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-semibold text-foreground">Lịch hẹn sắp tới</Text>
            <TouchableOpacity>
              <Text className="text-primary text-sm font-medium">Xem lịch</Text>
            </TouchableOpacity>
          </View>
          {bookings.map((booking) => (
            <View
              key={booking.id}
              className="mb-3 bg-white rounded-2xl border border-[#e5e7eb] px-4 py-4 flex-row items-center shadow-sm"
            >
              <View className="w-12 h-12 rounded-2xl bg-[#ecfdf3] justify-center items-center mr-4">
                <Aperture color="#16a34a" size={22} />
              </View>
              <View className="flex-1">
                <Text className="text-foreground font-semibold text-base">{booking.title}</Text>
                <Text className="text-muted-foreground text-sm mt-1">{booking.studio}</Text>
                <Text className="text-gray-400 text-xs mt-1">{booking.time}</Text>
              </View>
            </View>
          ))}
        </View>

        <View className="mt-6 mb-0">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-semibold text-foreground">Nguồn cảm hứng</Text>
            <TouchableOpacity>
              <Text className="text-primary text-sm">Xem thêm</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {inspirationShots.map((item) => (
              <View key={item} className="mr-4 w-44">
                <View className="aspect-[3/4] rounded-3xl overflow-hidden mb-2 border border-[#e5e7eb] shadow-xs">
                  <Image
                    source={{
                      uri: `https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=60&sig=${item}`,
                    }}
                    style={{ width: '100%', height: '100%' }}
                  />
                </View>
                <Text className="text-foreground font-semibold text-sm">Concept #{item}</Text>
                <Text className="text-muted-foreground text-xs mt-1">Photobooth Moodboard</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
