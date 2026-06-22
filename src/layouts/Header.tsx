/**
 * Header/Top Navigation Bar Component
 * Displays page title, search, and user actions
 */
export const Header: React.FC<{ pageTitle?: string }> = ({
  pageTitle = 'Dashboard',
}) => {
  return (
    <header className='fixed top-0 right-0 w-[calc(100%-16rem)] h-16 flex justify-between items-center px-6 z-30 bg-white border-b border-gray-200'>
      {/* Left Section: Title and Search */}
      <div className='flex items-center gap-6'>
        <h2 className='text-2xl font-bold text-gray-900'>{pageTitle}</h2>
      </div>

      {/* Right Section: Navigation and User Menu */}
      <div className='flex items-center gap-4'>
        {/* Navigation Tabs */}
        {/* <nav className='flex items-center gap-6 mr-4 border-r border-gray-200 pr-6'>
          <a
            href='/dashboard'
            className='text-sm font-semibold text-blue-600 border-b-2 border-blue-600 py-4'
          >
            Dashboard
          </a>
          <a
            href='/reports'
            className='text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors py-4'
          >
            Reports
          </a>
        </nav> */}

        {/* Icons */}
        {/* <button className='p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors'>
          <span className='material-symbols-outlined'>notifications</span>
        </button>
        <button className='p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors'>
          <span className='material-symbols-outlined'>settings</span>
        </button> */}

        {/* User Avatar */}
        <div className='h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border border-gray-300'>
          <span className='text-sm font-semibold text-blue-600'>AD</span>
        </div>
      </div>
    </header>
  )
}
