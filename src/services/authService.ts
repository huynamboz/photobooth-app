import apiClient, { ApiError } from './apiClient';
import { User } from '@/types/auth.type';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface AuthResult {
  message: string;
  token: string;
  user: User;
}

const transformUser = (user: LoginResponse['user']): User => ({
  id: user.id,
  email: user.email,
  name: user.name,
});

export const authService = {
  async login(payload: LoginRequest): Promise<AuthResult> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', payload);
      const { access_token, message, user } = response.data;

      return {
        message,
        token: access_token,
        user: transformUser(user),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Login failed. Please try again.');
    }
  },

  async register(payload: RegisterRequest): Promise<AuthResult> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/register', payload);
      const { access_token, message, user } = response.data;

      return {
        message,
        token: access_token,
        user: transformUser(user),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Registration failed. Please try again.');
    }
  },
};
