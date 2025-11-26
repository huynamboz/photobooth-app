import apiClient, { ApiError } from './apiClient';
import { User } from '@/types/auth.type';

export interface GetCurrentUserResponse {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  points: number;
  paymentCode?: string;
  createdAt: string;
  updatedAt: string;
  role?: {
    id: string;
    name: string;
    description?: string;
  };
}

const transformUser = (user: GetCurrentUserResponse): User => ({
  id: user.id,
  email: user.email,
  name: user.name,
  phone: user.phone,
  address: user.address,
  points: user.points,
  paymentCode: user.paymentCode,
  role: user.role,
});

export const userService = {
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<GetCurrentUserResponse>('/users/me');
      return transformUser(response.data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to get user information. Please try again.');
    }
  },
};
