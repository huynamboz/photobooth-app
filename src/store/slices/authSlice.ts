import auth from '@/config/firebaseAuth';
import db from '@/config/firebaseDb';
import { zustandMMKVStorage } from '@/store/mmkv';
import { AuthStore } from '@/types/auth.type';
import {
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
} from '@react-native-firebase/auth';
import database, { get, ref } from '@react-native-firebase/database';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      token: null,
      user: null,
      isLoading: false,
      isAuthenticated: false,

      // Firebase login with email/password
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const token = await userCredential.user.getIdToken();

          // Get additional user data from Realtime Database if needed
          const userSnapshot = await ref(db, `users/${userCredential.user.uid}`).once('value');

          const userData = userSnapshot.val() || {};
          set({
            token: token,
            user: {
              id: userCredential.user.uid,
              email: userCredential.user.email,
              name: userCredential.user.displayName || userData.name || 'User',
              ...userData,
            },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
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
        return new Promise((resolve) => {
          const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: any) => {
            unsubscribe();
            if (firebaseUser) {
              try {
                const token = await firebaseUser.getIdToken();
                const userRef = ref(db, `users/${firebaseUser.uid}`);
                const userSnapshot = await get(userRef);
                const userData = userSnapshot.val() || {};

                set({
                  token: token,
                  user: {
                    id: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName || userData.name || userData.fullName || 'User',
                    photoURL: firebaseUser.photoURL || userData.photoURL,
                    ...userData,
                  },
                  isAuthenticated: true,
                  isLoading: false,
                });
                resolve(true);
              } catch (error) {
                console.error('Check auth state error:', error);
                set({ isLoading: false });
                resolve(false);
              }
            } else {
              set({
                token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false,
              });
              resolve(false);
            }
          });
        });
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await signOut(auth);
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error) {
          console.error('Logout error:', error);
          set({ isLoading: false });
          throw error;
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
