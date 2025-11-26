import auth from '@/config/firebaseAuth';
import { authService } from '@/services';
import { setAuthToken } from '@/services/apiClient';
import { zustandMMKVStorage } from '@/store/mmkv';
import { AuthStore } from '@/types/auth.type';
import { signInWithCredential, signOut } from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
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

      // Github login
      loginWithGithub: async () => {
        set({ isLoading: true });
        try {
          const githubProvider = {
            providerId: 'github',
            token: 'your-github-token',
            secret: 'your-github-secret',
          };

          const userCredential = await signInWithCredential(auth, githubProvider);
          const token = await userCredential.user.getIdToken();

          await database().ref(`users/${userCredential.user.uid}`).update({
            name: userCredential.user.displayName,
            email: userCredential.user.email,
            photoURL: userCredential.user.photoURL,
            lastLogin: new Date().toISOString(),
            provider: 'github',
          });

          set({
            token: token,
            user: {
              id: userCredential.user.uid,
              email: userCredential.user.email,
              name: userCredential.user.displayName || 'User',
              photoURL: userCredential.user.photoURL,
              provider: 'github',
            },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Github login error:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      // Facebook login
      loginWithFacebook: async () => {
        set({ isLoading: true });
        try {
          const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

          if (result.isCancelled) {
            throw new Error('User cancelled the login process');
          }

          const data = await AccessToken.getCurrentAccessToken();

          if (!data) {
            throw new Error('Something went wrong obtaining access token');
          }

          const facebookProvider = {
            providerId: 'facebook',
            token: 'your-facebook-token',
            secret: 'your-facebook-secret',
          };

          const userCredential = await signInWithCredential(auth, facebookProvider);
          const token = await userCredential.user.getIdToken();

          await database().ref(`users/${userCredential.user.uid}`).update({
            name: userCredential.user.displayName,
            email: userCredential.user.email,
            photoURL: userCredential.user.photoURL,
            lastLogin: new Date().toISOString(),
            provider: 'facebook',
          });

          set({
            token: token,
            user: {
              id: userCredential.user.uid,
              email: userCredential.user.email,
              name: userCredential.user.displayName || 'User',
              photoURL: userCredential.user.photoURL,
              provider: 'facebook',
            },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Facebook login error:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      // X (Twitter) login
      loginWithX: async () => {
        set({ isLoading: true });
        try {
          const twitterProvider = {
            providerId: 'twitter',
            token: 'your-twitter-token',
            secret: 'your-twitter-secret',
          };

          const userCredential = await signInWithCredential(auth, twitterProvider);
          const token = await userCredential.user.getIdToken();

          await database().ref(`users/${userCredential.user.uid}`).update({
            name: userCredential.user.displayName,
            email: userCredential.user.email,
            photoURL: userCredential.user.photoURL,
            lastLogin: new Date().toISOString(),
            provider: 'twitter',
          });

          set({
            token: token,
            user: {
              id: userCredential.user.uid,
              email: userCredential.user.email,
              name: userCredential.user.displayName || 'User',
              photoURL: userCredential.user.photoURL,
              provider: 'twitter',
            },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('X/Twitter login error:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      // Check current auth state (useful for app initialization)
      checkAuthState: async () => {
        set({ isLoading: true });
        try {
          const currentToken = get().token;
          const currentUser = get().user;

          if (currentToken && currentUser) {
            setAuthToken(currentToken);
            set({
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
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

      logout: async () => {
        set({ isLoading: true });
        try {
          await signOut(auth);
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          setAuthToken(null);
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
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
