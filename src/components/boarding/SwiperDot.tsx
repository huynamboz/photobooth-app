import React from 'react';
import { View } from 'react-native';

type props = {
  isActive?: boolean;
};

const SwiperDot = ({ isActive }: props) => {
  return (
    <View className={`w-14 h-2 rounded-md mx-1 my-3 ${isActive ? 'bg-black' : 'bg-gray-300'}`} />
  );
};

export default SwiperDot;
