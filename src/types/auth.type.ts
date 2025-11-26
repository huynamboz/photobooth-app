export interface User {
  id: string;
  email: string | null;
  name: string | null;
  photoURL?: string | null;
  provider?: 'github' | 'facebook' | 'twitter' | 'email' | string;
  [key: string]: any;
}

export interface AuthStore {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; password: string }) => Promise<void>;
  loginWithGithub: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  loginWithX: () => Promise<void>;
  checkAuthState: () => Promise<boolean>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}
