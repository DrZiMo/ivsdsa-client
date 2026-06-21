import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { dashboardAPI, dataIngestionAPI, userManagementAPI } from '@/api/client'
import { useFilterStore } from '@/store/useFilterStore'
import type {
  DashboardMetrics,
  RegionalData,
  ServiceUsageTrend,
  SurveyResponse,
  FileUploadResponse,
  UserData,
} from '@/types'

/**
 * Query keys factory for React Query
 */
export const queryKeys = {
  all: ['dashboard'] as const,
  metrics: () => [...queryKeys.all, 'metrics'] as const,
  regional: () => [...queryKeys.all, 'regional'] as const,
  trends: () => [...queryKeys.all, 'trends'] as const,
  activity: () => [...queryKeys.all, 'activity'] as const,
  surveys: () => [...queryKeys.all, 'surveys'] as const,
  ingestion: () => [...queryKeys.all, 'ingestion'] as const,
  uploads: () => [...queryKeys.ingestion(), 'uploads'] as const,
  users: () => [...queryKeys.all, 'users'] as const,
} as const

/**
 * React Query hook - Fetch dashboard metrics
 * Automatically refetches when filters change
 */
export const useDashboardMetrics = () => {
  const { region, incomeLevel, residenceType } = useFilterStore()

  return useQuery<DashboardMetrics, Error>({
    queryKey: [...queryKeys.metrics(), { region, incomeLevel, residenceType }],
    queryFn: () =>
      dashboardAPI.getMetrics({
        region,
        incomeLevel,
        residenceType,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: 1000,
  })
}

/**
 * React Query hook - Fetch regional distribution data
 */
export const useRegionalData = () => {
  const { region, incomeLevel, residenceType } = useFilterStore()

  return useQuery<RegionalData[]>({
    queryKey: [...queryKeys.regional(), { region, incomeLevel, residenceType }],
    queryFn: () =>
      dashboardAPI.getRegionalData({
        region,
        incomeLevel,
        residenceType,
      }),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

/**
 * React Query hook - Fetch service usage trends
 */
export const useServiceTrends = () => {
  const { region, incomeLevel, residenceType } = useFilterStore()

  return useQuery<ServiceUsageTrend[]>({
    queryKey: [...queryKeys.trends(), { region, incomeLevel, residenceType }],
    queryFn: () =>
      dashboardAPI.getServiceTrends({
        region,
        incomeLevel,
        residenceType,
      }),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

/**
 * React Query hook - Fetch activity heatmap data
 */
export const useActivityData = () => {
  return useQuery<number[][]>({
    queryKey: queryKeys.activity(),
    queryFn: () => dashboardAPI.getActivityData(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * React Query hook - Fetch survey responses
 */
export const useSurveyResponses = (limit?: number) => {
  return useQuery<SurveyResponse[]>({
    queryKey: [...queryKeys.surveys(), limit],
    queryFn: () => dashboardAPI.getSurveyResponses(limit),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

/**
 * React Query mutation - Upload file
 */
export const useFileUpload = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      file,
      fileType,
      description,
    }: {
      file: File
      fileType: string
      description?: string
    }) => dataIngestionAPI.uploadFile(file, fileType, description),
    onSuccess: (data) => {
      // Invalidate dashboard metrics cache to refresh with new data
      queryClient.invalidateQueries({ queryKey: queryKeys.metrics() })
      queryClient.invalidateQueries({ queryKey: queryKeys.uploads() })
      return data
    },
  })
}

/**
 * React Query hook - Get upload status
 */
export const useUploadStatus = (fileId: string) => {
  return useQuery<FileUploadResponse>({
    queryKey: [...queryKeys.uploads(), fileId],
    queryFn: () => dataIngestionAPI.getUploadStatus(fileId),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
    enabled: !!fileId,
  })
}

/**
 * React Query hook - Get processing history
 */
export const useProcessingHistory = (limit?: number) => {
  return useQuery<FileUploadResponse[]>({
    queryKey: [...queryKeys.uploads(), 'history', limit],
    queryFn: () => dataIngestionAPI.getProcessingHistory(limit),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

/**
 * React Query hook - Fetch all users
 */
export const useUsers = (params?: {
  limit?: number
  offset?: number
  role?: string
}) => {
  return useQuery<UserData[]>({
    queryKey: [...queryKeys.users(), params],
    queryFn: () => userManagementAPI.getAllUsers(params),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

/**
 * React Query hook - Fetch single user
 */
export const useUser = (userId: string) => {
  return useQuery<UserData>({
    queryKey: [...queryKeys.users(), userId],
    queryFn: () => userManagementAPI.getUser(userId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!userId,
  })
}

/**
 * React Query mutation - Create user
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userData: Omit<UserData, 'id'>) =>
      userManagementAPI.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users() })
    },
  })
}

/**
 * React Query mutation - Update user
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userId,
      updates,
    }: {
      userId: string
      updates: Partial<UserData>
    }) => userManagementAPI.updateUser(userId, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users() })
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.users(), data.id],
      })
    },
  })
}

/**
 * React Query mutation - Delete user
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => userManagementAPI.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users() })
    },
  })
}
