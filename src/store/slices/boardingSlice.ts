import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandMMKVStorage } from '../mmkv';
import { BoardingStore } from '@/types/boarding.type';

const useOnboardingStore = create<BoardingStore>()(
  persist(
    (set) => ({
      isFirstLaunch: true,

      completeOnboarding: () => set({ isFirstLaunch: false }),
      resetOnboarding: () => set({ isFirstLaunch: true }),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => zustandMMKVStorage),
    },
  ),
);

export default useOnboardingStore;
