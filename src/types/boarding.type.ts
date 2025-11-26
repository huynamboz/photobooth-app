import Swiper from 'react-native-swiper';

export type BoardingStore = {
  isFirstLaunch: boolean;

  completeOnboarding: () => void;
  resetOnboarding: () => void;
};

export type SwiperRefType = Swiper & {
  scrollBy: (index: number) => void;
  scrollTo: (index: number) => void;
};
