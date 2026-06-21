/**
 * Global TypeScript interfaces and types for the application
 */

/**
 * Filter state types for sidebar filters
 */
export interface FilterState {
  region: string
  incomeLevel: string
  residenceType: string
}

/**
 * API Response types
 */
export interface DashboardMetrics {
  totalHouseholds: number
  internetAccess: number
  servicePreference: string
  avgDataUsage: string
  householdsTrend: number
  accessTrend: number
  dataTrend: number
}

export interface RegionalData {
  region: string
  households: number
  accessDensity: number
  serviceType: string
}

export interface ServiceUsageTrend {
  month: string
  digitalChannels: number
  physicalOutlets: number
}

export interface SurveyResponse {
  id: string
  date: string
  hhId: string
  connectivity: string
  status: 'verified' | 'pending' | 'flagged'
}

export interface ActivityMetrics {
  timestamp: string
  activityLevel: number
}

export interface FileUploadPayload {
  file: File
  fileType: string
  description?: string
}

export interface FileUploadResult {
  success: boolean
  rows: number
  fileId: string
}

export interface FileUploadResponse {
  id: string
  filename: string
  created_at: string
  status: 'processing' | 'completed' | 'failed'
}

export interface UserData {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: 'active' | 'inactive'
  lastLogin: string
}

/**
 * API Error type
 */
export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}
