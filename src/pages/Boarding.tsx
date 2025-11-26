import Images from '@/assets/image';
import SwiperDot from '@/components/boarding/SwiperDot';
import useOnboardingStore from '@/store/slices/boardingSlice';
import { SwiperRefType } from '@/types/boarding.type';
import { AuthNavigationProp } from '@/types/navigation.type';
import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { Image, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import Swiper from 'react-native-swiper';
const OnboardingScreen = () => {
  const swiperRef = useRef<SwiperRefType>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = 3;
  const navigation = useNavigation<AuthNavigationProp>();
  const { completeOnboarding } = useOnboardingStore();

  const handleNext = () => {
    if (swiperRef.current && currentIndex < totalSlides - 1) {
      swiperRef.current.scrollBy(1);
    } else {
      navigation.replace('LoginScreen');
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    navigation.replace('LoginScreen');
    completeOnboarding();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View className="w-full flex-row justify-between px-6 py-4">
        <TouchableOpacity className="px-4 py-2" onPress={handleSkip}>
          <Text className="text-gray-800 font-semibold">SKIP</Text>
        </TouchableOpacity>
        <TouchableOpacity className="px-4 py-2" onPress={handleNext}>
          <Text className="text-gray-800 font-semibold">NEXT</Text>
        </TouchableOpacity>
      </View>

      <Swiper
        ref={swiperRef}
        loop={false}
        dot={<SwiperDot />}
        activeDot={<SwiperDot isActive />}
        onIndexChanged={(index) => {
          setCurrentIndex(index);
          console.log('Current index:', index);
        }}
      >
        <View className="flex-1 items-center px-6">
          <Image source={Images.default} className="w-64 h-64 mt-[120px]" />
          <Text className="text-2xl font-bold mb-4 mt-10">Theo dõi vị trí mọi lúc, mọi nơi</Text>
          <Text className="text-base text-center text-gray-600">
            Ứng dụng giúp bạn theo dõi vị trí và chia sẻ vị trí mọi lúc một cách dễ dàng.
          </Text>
        </View>

        <View className="flex-1 items-center px-6">
          <Image source={Images.default} className="w-64 h-64 mt-[120px]" />
          <Text className="text-2xl font-bold mb-4 mt-10">Theo dõi thời gian thực</Text>
          <Text className="text-base text-center text-gray-600">
            Xem vị trí hiện tại của thành viên trong gia đình của bạn bất cứ lúc nào.
          </Text>
        </View>

        <View className="flex-1 items-center px-6">
          <Image source={Images.default} className="w-64 h-64 mt-[120px]" />
          <Text className="text-2xl font-bold mb-4 mt-10">An toàn và bảo mật</Text>
          <Text className="text-base text-center text-gray-600">
            Chúng tôi cam kết bảo vệ sự riêng tư của bạn.
          </Text>
        </View>
      </Swiper>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
