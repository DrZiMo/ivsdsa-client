import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryProvider } from '@/api/queryClient'
import { DashboardPage } from '@/pages/DashboardPage'
import { DataIngestionPage } from '@/pages/DataIngestionPage'
import { UserManagementPage } from '@/pages/UserManagementPage'

/**
 * Main App Component
 * Sets up routing and global providers (React Query, Zustand)
 */
function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <Routes>
          {/* Dashboard - Main landing page */}
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='/' element={<Navigate to='/dashboard' replace />} />

          {/* Data Management */}
          <Route path='/data-ingestion' element={<DataIngestionPage />} />

          {/* User Management */}
          <Route path='/user-management' element={<UserManagementPage />} />

          {/* Catch-all - redirect to dashboard */}
          <Route path='*' element={<Navigate to='/dashboard' replace />} />
        </Routes>
      </BrowserRouter>
    </QueryProvider>
  )
}

export default App
