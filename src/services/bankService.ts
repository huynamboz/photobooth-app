import apiClient, { ApiError } from './apiClient';

export interface BankInfoResponse {
  id: string;
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  branch?: string;
  qrCodeUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export const bankService = {
  async getBankInfo(): Promise<BankInfoResponse | null> {
    try {
      const response = await apiClient.get<BankInfoResponse | null>('/bank-info');
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        // If 404 or null response, return null
        if (error.statusCode === 404) {
          return null;
        }
        throw error;
      }
      throw new ApiError('Failed to get bank information. Please try again.');
    }
  },
};
