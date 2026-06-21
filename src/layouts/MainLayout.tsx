import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface MainLayoutProps {
  children: React.ReactNode
  pageTitle?: string
}

/**
 * Main Layout Wrapper
 * Combines Sidebar and Header with main content area
 */
export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  pageTitle = 'Dashboard',
}) => {
  return (
    <div className='flex min-h-screen bg-gray-50'>
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className='flex-1 ml-64 min-h-screen flex flex-col'>
        {/* Header */}
        <Header pageTitle={pageTitle} />

        {/* Page Content */}
        <div className='flex-1 mt-16 p-6 max-w-7xl mx-auto w-full'>
          {children}
        </div>
      </main>
    </div>
  )
}
