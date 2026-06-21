import axios, { type AxiosInstance } from 'axios';
import type {
  DashboardMetrics,
  RegionalData,
  ServiceUsageTrend,
  SurveyResponse,
  FileUploadResponse,
  UserData,
} from '@/types';

/**
 * Create Axios instance with environment-based configuration
 */
const createApiClient = (): AxiosInstance => {
  const baseURL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  const instance = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor for adding auth tokens if needed
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor for handling errors
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const apiClient = createApiClient();

/**
 * API Service - Dashboard endpoints
 */
export const dashboardAPI = {
  /**
   * Fetch dashboard metrics with optional filters
   */
  getMetrics: async (filters?: {
    region?: string;
    incomeLevel?: string;
    residenceType?: string;
  }): Promise<DashboardMetrics> => {
    const { data } = await apiClient.get('/dashboard/metrics', {
      params: filters,
    });
    return data;
  },

  /**
   * Fetch regional distribution data
   */
  getRegionalData: async (filters?: {
    region?: string;
    incomeLevel?: string;
    residenceType?: string;
  }): Promise<RegionalData[]> => {
    const { data } = await apiClient.get('/dashboard/regional', {
      params: filters,
    });
    return data;
  },

  /**
   * Fetch service usage trends
   */
  getServiceTrends: async (filters?: {
    region?: string;
    incomeLevel?: string;
    residenceType?: string;
  }): Promise<ServiceUsageTrend[]> => {
    const { data } = await apiClient.get('/dashboard/trends', {
      params: filters,
    });
    return data;
  },

  /**
   * Fetch activity heatmap data
   */
  getActivityData: async (): Promise<number[][]> => {
    const { data } = await apiClient.get('/dashboard/activity');
    return data;
  },

  /**
   * Fetch recent survey responses
   */
  getSurveyResponses: async (limit?: number): Promise<SurveyResponse[]> => {
    const { data } = await apiClient.get('/dashboard/surveys', {
      params: { limit: limit || 10 },
    });
    return data;
  },
};

/**
 * API Service - Data Ingestion endpoints
 */
export const dataIngestionAPI = {
  /**
   * Upload file for processing
   */
  uploadFile: async (
    file: File,
    fileType: string,
    description?: string
  ): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', fileType);
    if (description) {
      formData.append('description', description);
    }

    const { data } = await apiClient.post('/ingestion/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  /**
   * Get upload status
   */
  getUploadStatus: async (fileId: string): Promise<FileUploadResponse> => {
    const { data } = await apiClient.get(`/ingestion/status/${fileId}`);
    return data;
  },

  /**
   * Get processing history
   */
  getProcessingHistory: async (limit?: number): Promise<FileUploadResponse[]> => {
    const { data } = await apiClient.get('/ingestion/history', {
      params: { limit: limit || 20 },
    });
    return data;
  },
};

/**
 * API Service - User Management endpoints
 */
export const userManagementAPI = {
  /**
   * Fetch all users
   */
  getAllUsers: async (params?: {
    limit?: number;
    offset?: number;
    role?: string;
  }): Promise<UserData[]> => {
    const { data } = await apiClient.get('/users', { params });
    return data;
  },

  /**
   * Fetch single user
   */
  getUser: async (userId: string): Promise<UserData> => {
    const { data } = await apiClient.get(`/users/${userId}`);
    return data;
  },

  /**
   * Create new user
   */
  createUser: async (userData: Omit<UserData, 'id'>): Promise<UserData> => {
    const { data } = await apiClient.post('/users', userData);
    return data;
  },

  /**
   * Update user
   */
  updateUser: async (
    userId: string,
    updates: Partial<UserData>
  ): Promise<UserData> => {
    const { data } = await apiClient.put(`/users/${userId}`, updates);
    return data;
  },

  /**
   * Delete user
   */
  deleteUser: async (userId: string): Promise<void> => {
    await apiClient.delete(`/users/${userId}`);
  },
};

export default apiClient;
