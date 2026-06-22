import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryProvider } from '@/api/queryClient'
import { DashboardPage } from '@/pages/DashboardPage'
import { DataIngestionPage } from '@/pages/DataIngestionPage'
import { MainLayout } from './layouts'

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
          <Route path='/' element={<MainLayout />}>
            <Route path='/dashboard' element={<DashboardPage />} />

            <Route path='/data-ingestion' element={<DataIngestionPage />} />
          </Route>

          {/* Data Management */}

          {/* Catch-all - redirect to dashboard */}
          <Route path='*' element={<Navigate to='/dashboard' replace />} />
        </Routes>
      </BrowserRouter>
    </QueryProvider>
  )
}

export default App
