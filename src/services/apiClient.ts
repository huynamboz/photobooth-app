import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:3000/api/v1';
const REQUEST_TIMEOUT = 15000;

export interface ApiErrorPayload {
  statusCode?: number;
  message?: string | string[];
  error?: string;
}

export class ApiError extends Error {
  statusCode?: number;
  details?: string[];

  constructor(message: string, statusCode?: number, details?: string[]) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

let accessToken: string | null = null;

export const setAuthToken = (token?: string | null) => {
  accessToken = token ?? null;
};

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!config.headers) {
    config.headers = {};
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorPayload>) => {
    if (error.response) {
      const { status, data } = error.response;
      const details = Array.isArray(data?.message) ? data?.message : undefined;
      const message =
        (Array.isArray(data?.message) ? data?.message[0] : data?.message) ??
        data?.error ??
        error.message;
      return Promise.reject(new ApiError(message ?? 'Request failed', status, details));
    }

    if (error.request) {
      return Promise.reject(
        new ApiError('Unable to reach server. Please check your connection.', undefined),
      );
    }

    return Promise.reject(new ApiError(error.message));
  },
);

export default apiClient;
