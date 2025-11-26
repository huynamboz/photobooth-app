import apiClient, { ApiError } from './apiClient';

export interface FilterAsset {
  id: string;
  imageUrl: string;
  publicId: string;
  type: string;
  filterType: string;
  scale: string;
  offset_y: string;
  anchor_idx: number;
  left_idx: number;
  right_idx: number;
  createdAt: string;
  updatedAt: string;
}

export interface FiltersResponse {
  data: FilterAsset[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface GetFiltersParams {
  page?: number;
  limit?: number;
}

export const assetService = {
  async getFilters(params?: GetFiltersParams): Promise<FiltersResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) {
        queryParams.append('page', params.page.toString());
      }
      if (params?.limit) {
        queryParams.append('limit', params.limit.toString());
      }

      const url = `/assets/filters${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<FiltersResponse>(url);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to get filters. Please try again.');
    }
  },
};
