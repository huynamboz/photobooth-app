export interface User {
  id: string;
  email: string | null;
  name: string | null;
  phone?: string | null;
  address?: string | null;
  points?: number;
  paymentCode?: string;
  photoURL?: string | null;
  provider?: 'github' | 'facebook' | 'twitter' | 'email' | string;
  role?: {
    id: string;
    name: string;
    description?: string;
  };
  [key: string]: any;
}

export interface AuthStore {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; password: string }) => Promise<void>;
  checkAuthState: () => Promise<boolean>;
  getCurrentUser: () => Promise<User>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}
