import apiClient, { ApiError } from './apiClient';

export interface CreateSessionRequest {
  photoboothId: string;
  maxPhotos?: number;
  notes?: string;
}

export interface SessionResponse {
  id: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled' | 'expired';
  userId?: string;
  photoboothId: string;
  photoCount: number;
  maxPhotos: number;
  startedAt?: string;
  completedAt?: string;
  expiresAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StartSessionRequest {
  startedAt?: string;
}

export interface CurrentSessionResponse extends SessionResponse {
  photobooth?: {
    id: string;
    name: string;
    status: string;
  };
  photos?: Array<{
    id: string;
    imageUrl: string;
    order: number;
    caption?: string;
  }>;
  filterIds?: string[];
}

export interface StartCaptureResponse {
  message: string;
  sessionId: string;
}

export interface ChangeFilterRequest {
  filterId: string;
}

export const photoboothService = {
  async createSession(payload: CreateSessionRequest): Promise<SessionResponse> {
    try {
      const response = await apiClient.post<SessionResponse>('/photobooth/sessions', payload);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to create session. Please try again.');
    }
  },

  async startSession(sessionId: string, payload?: StartSessionRequest): Promise<SessionResponse> {
    try {
      const response = await apiClient.put<SessionResponse>(
        `/photobooth/sessions/${sessionId}/start`,
        payload || {},
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to start session. Please try again.');
    }
  },

  async getCurrentSession(): Promise<CurrentSessionResponse | null> {
    try {
      const response = await apiClient.get<
        CurrentSessionResponse | { message: string; session: null }
      >('/photobooth/sessions/current');

      // Handle different response formats
      if (response.data === null) {
        return null;
      }

      // If response has message and session is null
      if ('message' in response.data && response.data.session === null) {
        return null;
      }

      // If response is a session object
      if ('id' in response.data) {
        return response.data as CurrentSessionResponse;
      }

      return null;
    } catch (error) {
      if (error instanceof ApiError) {
        // If 404 or null response, return null (no active session)
        if (error.statusCode === 404) {
          return null;
        }
        throw error;
      }
      throw new ApiError('Failed to get current session. Please try again.');
    }
  },

  async startCapture(sessionId: string): Promise<StartCaptureResponse> {
    try {
      const response = await apiClient.post<StartCaptureResponse>(
        `/photobooth/sessions/${sessionId}/start-capture`,
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to start capture. Please try again.');
    }
  },

  async addFilter(sessionId: string, filterId: string): Promise<SessionResponse> {
    try {
      const response = await apiClient.post<SessionResponse>(
        `/photobooth/sessions/${sessionId}/change-filter`,
        { filterId },
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to add filter. Please try again.');
    }
  },

  async removeFilter(sessionId: string, filterId: string): Promise<SessionResponse> {
    try {
      const response = await apiClient.delete<SessionResponse>(
        `/photobooth/sessions/${sessionId}/change-filter/${filterId}`,
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to remove filter. Please try again.');
    }
  },

  async cancelSession(sessionId: string): Promise<SessionResponse> {
    try {
      const response = await apiClient.put<SessionResponse>(
        `/photobooth/sessions/${sessionId}/cancel`,
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to cancel session. Please try again.');
    }
  },
};
