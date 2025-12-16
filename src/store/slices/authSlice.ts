import { authService, userService } from '@/services';
import { setAuthToken } from '@/services/apiClient';
import { zustandMMKVStorage } from '@/store/mmkv';
import { AuthStore } from '@/types/auth.type';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      token: null,
      user: null,
      isLoading: false,
      isAuthenticated: false,

      // REST login with email/password
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const { token, user } = await authService.login({ email, password });
          setAuthToken(token);

          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Login error:', error);
          setAuthToken(null);
          set({
            isLoading: false,
            isAuthenticated: false,
            token: null,
          });
          throw error;
        }
      },

      register: async ({ name, email, password }) => {
        set({ isLoading: true });
        try {
          const { token, user } = await authService.register({
            name: name.trim(),
            email: email.trim(),
            password,
          });
          setAuthToken(token);
          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Register error:', error);
          setAuthToken(null);
          set({
            isLoading: false,
            isAuthenticated: false,
            token: null,
          });
          throw error;
        }
      },

      // Check current auth state (useful for app initialization)
      checkAuthState: async () => {
        set({ isLoading: true });
        try {
          const currentToken = get().token;

          if (currentToken) {
            setAuthToken(currentToken);
            // Fetch current user info from API
            try {
              const user = await userService.getCurrentUser();
              set({
                user,
                isAuthenticated: true,
                isLoading: false,
              });
              return true;
            } catch (error) {
              console.error('Failed to get user info:', error);
              // If token is invalid, clear auth state
              setAuthToken(null);
              set({
                token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false,
              });
              return false;
            }
          }

          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return false;
        } catch (error) {
          console.error('Check auth state error:', error);
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return false;
        }
      },

      // Get current user info (call /users/me)
      getCurrentUser: async () => {
        set({ isLoading: true });
        try {
          const user = await userService.getCurrentUser();
          set({ user, isLoading: false });
          return user;
        } catch (error) {
          console.error('Get current user error:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        // Clear auth token from API client
        setAuthToken(null);
        // Clear all auth state
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setUser: (user) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export default useAuthStore;
