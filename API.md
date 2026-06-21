# API Client Documentation

Complete reference for the type-safe Axios API client and React Query hooks.

## Table of Contents

- [API Client Setup](#api-client-setup)
- [Dashboard API](#dashboard-api)
- [Data Ingestion API](#data-ingestion-api)
- [User Management API](#user-management-api)
- [React Query Hooks](#react-query-hooks)
- [Error Handling](#error-handling)
- [Request Interceptors](#request-interceptors)

## API Client Setup

### Environment Configuration

```typescript
// import.meta.env.VITE_API_BASE_URL is read from .env
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Example .env.local
VITE_API_BASE_URL=http://localhost:3000/api
```

### Axios Instance

Located in `src/api/client.ts`:

```typescript
const apiClient = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})
```

## Dashboard API

### `dashboardAPI.getMetrics(filters?)`

Fetch overall dashboard metrics with optional filters.

**Parameters:**

```typescript
{
  region?: string;        // 'Metropolitan Area' | 'Rural North' | 'Coastal East'
  incomeLevel?: string;   // 'All Tiers' | 'Low Income' | 'Middle Income' | 'High Income'
  residenceType?: string; // 'Apartment/Condo' | 'Single Family' | 'Social Housing'
}
```

**Returns:**

```typescript
{
  totalHouseholds: number // e.g. 12450
  internetAccess: number // e.g. 64.2 (percentage)
  servicePreference: string // e.g. 'Mobile Banking'
  avgDataUsage: string // e.g. '4.2GB'
  householdsTrend: number // e.g. 2.4 (percentage change)
  accessTrend: number // e.g. -0.8
  dataTrend: number // e.g. 12
}
```

**Example:**

```typescript
const metrics = await dashboardAPI.getMetrics({
  region: 'Metropolitan Area',
  incomeLevel: 'All Tiers',
  residenceType: 'Apartment/Condo',
})

console.log(metrics.totalHouseholds) // 12450
```

**React Query Hook:**

```typescript
const { data, isLoading, error } = useDashboardMetrics()
// Automatically refetches when filters change
```

---

### `dashboardAPI.getRegionalData(filters?)`

Fetch geographic distribution data by region.

**Parameters:** Same as `getMetrics`

**Returns:**

```typescript
RegionalData[] = [
  {
    region: string;       // Region name
    households: number;   // Count
    accessDensity: number; // 0-100 percentage
    serviceType: string;  // Service type
  },
  // ...
]
```

**React Query Hook:**

```typescript
const { data: regions } = useRegionalData()
```

---

### `dashboardAPI.getServiceTrends(filters?)`

Fetch 12-month service usage trends.

**Parameters:** Same as `getMetrics`

**Returns:**

```typescript
ServiceUsageTrend[] = [
  {
    month: string;           // 'JAN', 'FEB', etc.
    digitalChannels: number; // Usage count
    physicalOutlets: number; // Usage count
  },
  // ... 12 items
]
```

**React Query Hook:**

```typescript
const { data: trends } = useServiceTrends()
```

---

### `dashboardAPI.getActivityData()`

Fetch activity heatmap data (72 cells for activity grid).

**Parameters:** None

**Returns:**

```typescript
number[][] // 2D array of activity intensity values
```

**React Query Hook:**

```typescript
const { data: activityGrid } = useActivityData()
```

---

### `dashboardAPI.getSurveyResponses(limit?)`

Fetch recent survey responses.

**Parameters:**

```typescript
limit?: number; // Default 10, max 100
```

**Returns:**

```typescript
SurveyResponse[] = [
  {
    id: string;           // Unique ID
    date: string;         // 'Oct 24, 2023'
    hhId: string;         // Household ID '#IV-8821'
    connectivity: string; // 'Fiber Optic', '4G/LTE', 'Dial-up', 'None'
    status: 'verified' | 'pending' | 'flagged'; // Status badge
  },
  // ...
]
```

**React Query Hook:**

```typescript
const { data: surveys } = useSurveyResponses(10)
```

---

## Data Ingestion API

### `dataIngestionAPI.uploadFile(file, fileType, description?)`

Upload a data file for processing.

**Parameters:**

```typescript
file: File;              // Browser File object
fileType: string;        // 'survey' | 'household' | 'connectivity' | 'regional'
description?: string;    // Optional metadata, e.g., 'Q4 2023 Survey'
```

**Returns:**

```typescript
{
  fileId: string // Unique file identifier
  fileName: string // Original file name
  uploadedAt: string // ISO timestamp
  status: 'processing' | 'completed' | 'failed'
}
```

**Example:**

```typescript
const fileInput = document.querySelector('input[type="file"]')
const file = fileInput.files[0]

const response = await dataIngestionAPI.uploadFile(
  file,
  'survey',
  'Q4 2023 Survey',
)

console.log(response.fileId) // 'file-123-abc'
```

**React Query Mutation Hook:**

```typescript
const uploadMutation = useFileUpload()

// In component
uploadMutation.mutate({
  file: selectedFile,
  fileType: 'survey',
  description: 'Q4 Survey',
})

// On success, dashboard metrics cache is automatically invalidated
```

**Side Effect:** Successfully uploaded files automatically invalidate the `dashboard/metrics` cache, triggering a refresh.

---

### `dataIngestionAPI.getUploadStatus(fileId)`

Poll the processing status of an uploaded file.

**Parameters:**

```typescript
fileId: string // File ID from upload response
```

**Returns:** Same as `uploadFile` response

**Example:**

```typescript
const status = await dataIngestionAPI.getUploadStatus('file-123-abc')
console.log(status.status) // 'processing', 'completed', or 'failed'
```

**React Query Hook:**

```typescript
const { data: uploadStatus } = useUploadStatus('file-123-abc')
// Enabled only if fileId is provided (enabled: !!fileId)
```

---

### `dataIngestionAPI.getProcessingHistory(limit?)`

Fetch upload processing history.

**Parameters:**

```typescript
limit?: number; // Default 20, max 100
```

**Returns:**

```typescript
FileUploadResponse[] // Same structure as individual upload
```

**Example:**

```typescript
const history = await dataIngestionAPI.getProcessingHistory(10)
history.forEach((upload) => {
  console.log(`${upload.fileName}: ${upload.status}`)
})
```

**React Query Hook:**

```typescript
const { data: uploads } = useProcessingHistory(10)
```

---

## User Management API

### `userManagementAPI.getAllUsers(params?)`

Fetch paginated list of all users.

**Parameters:**

```typescript
{
  limit?: number;   // Default 10, max 100
  offset?: number;  // Default 0 (pagination)
  role?: string;    // Filter by role: 'admin', 'editor', 'viewer'
}
```

**Returns:**

```typescript
UserData[] = [
  {
    id: string;                           // User UUID
    name: string;                         // Full name
    email: string;                        // Email address
    role: string;                         // 'admin' | 'editor' | 'viewer'
    department: string;                   // Department name
    status: 'active' | 'inactive';        // Account status
    lastLogin: string;                    // ISO timestamp
  },
  // ...
]
```

**React Query Hook:**

```typescript
const { data: users, isLoading } = useUsers({
  limit: 10,
  offset: 0,
  role: 'admin',
})
```

---

### `userManagementAPI.getUser(userId)`

Fetch single user by ID.

**Parameters:**

```typescript
userId: string // User UUID
```

**Returns:** Single `UserData` object

**React Query Hook:**

```typescript
const { data: user } = useUser('user-uuid-123')
// Enabled only if userId is provided
```

---

### `userManagementAPI.createUser(userData)`

Create a new user account.

**Parameters:**

```typescript
{
  name: string // Required
  email: string // Required, must be valid email
  role: string // 'admin' | 'editor' | 'viewer'
  department: string // Required
  status: 'active' | 'inactive' // Required, default 'active'
  lastLogin: string // ISO timestamp, auto-set to now
}
```

**Returns:** Created `UserData` with assigned `id`

**React Query Mutation Hook:**

```typescript
const createMutation = useCreateUser()

createMutation.mutate({
  name: 'John Doe',
  email: 'john@example.com',
  role: 'editor',
  department: 'Analytics',
  status: 'active',
  lastLogin: new Date().toISOString(),
})

// On success, all users queries are invalidated
```

---

### `userManagementAPI.updateUser(userId, updates)`

Update existing user.

**Parameters:**

```typescript
userId: string // User UUID
updates: Partial<UserData> // Any fields to update
```

**Example:**

```typescript
const updated = await userManagementAPI.updateUser('user-uuid-123', {
  name: 'Jane Doe',
  role: 'admin',
})
```

**React Query Mutation Hook:**

```typescript
const updateMutation = useUpdateUser()

updateMutation.mutate({
  userId: 'user-uuid-123',
  updates: { role: 'admin' },
})

// On success, all users queries and specific user query are invalidated
```

---

### `userManagementAPI.deleteUser(userId)`

Delete user account.

**Parameters:**

```typescript
userId: string // User UUID
```

**Returns:** `void`

**React Query Mutation Hook:**

```typescript
const deleteMutation = useDeleteUser()

deleteMutation.mutate('user-uuid-123')

// On success, all users queries are invalidated
```

---

## React Query Hooks

### Query Hooks (Read-Only)

All return `{ data, isLoading, isError, error }`:

```typescript
useDashboardMetrics()           // Refetches on filter change
useRegionalData()               // Refetches on filter change
useServiceTrends()              // Refetches on filter change
useActivityData()               // Fixed data, no filters
useSurveyResponses(limit?)      // Paginated surveys
useUploadStatus(fileId)         // Polls upload status (enabled: !!fileId)
useProcessingHistory(limit?)    // Upload history
useUsers(params?)               // All users with pagination
useUser(userId)                 // Single user (enabled: !!userId)
```

### Mutation Hooks

All return `{ mutate, mutateAsync, isPending, isError, error, isSuccess }`:

```typescript
useFileUpload() // Upload file, invalidates metrics cache on success
useCreateUser() // Create user, invalidates users cache
useUpdateUser() // Update user, invalidates users + specific user cache
useDeleteUser() // Delete user, invalidates users cache
```

### Example Usage

```typescript
import { useDashboardMetrics, useFileUpload } from '@/hooks/useQueries';

export const Dashboard = () => {
  const metricsQuery = useDashboardMetrics();
  const uploadMutation = useFileUpload();

  if (metricsQuery.isLoading) return <div>Loading...</div>;
  if (metricsQuery.isError) return <div>Error: {metricsQuery.error?.message}</div>;

  return (
    <div>
      <h1>{metricsQuery.data?.totalHouseholds}</h1>
      <button
        onClick={() =>
          uploadMutation.mutate({
            file: selectedFile,
            fileType: 'survey',
          })
        }
        disabled={uploadMutation.isPending}
      >
        {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};
```

---

## Error Handling

### Response Interceptor

The API client automatically handles:

```typescript
// 401 Unauthorized
if (error.response?.status === 401) {
  localStorage.removeItem('authToken')
  window.location.href = '/login' // Redirect to login
}
```

### In Components

```typescript
const { data, isError, error } = useDashboardMetrics();

if (isError) {
  console.error('API Error:', error);
  return <ErrorBoundary error={error} />;
}
```

### Manual Error Handling

```typescript
try {
  const metrics = await dashboardAPI.getMetrics()
} catch (error) {
  // AxiosError
  console.error(error.response?.data) // Server error response
  console.error(error.message) // Network error
}
```

---

## Request Interceptors

### Authentication

Any stored auth token is automatically added:

```typescript
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### File Uploads

For multipart form data (file uploads):

```typescript
const formData = new FormData()
formData.append('file', file)
formData.append('fileType', 'survey')

await apiClient.post('/ingestion/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})
```

---

## Query Key Factory

```typescript
export const queryKeys = {
  all: ['dashboard'],
  metrics: () => [...queryKeys.all, 'metrics'],
  regional: () => [...queryKeys.all, 'regional'],
  trends: () => [...queryKeys.all, 'trends'],
  // ...
}

// Usage: Cache invalidation
queryClient.invalidateQueries({ queryKey: queryKeys.metrics() })

// Refetch specific
queryClient.refetchQueries({ queryKey: queryKeys.metrics() })
```

---

**Last Updated:** June 2026  
**Version:** 1.0.0
