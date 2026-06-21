import { useFilterStore } from '@/store/useFilterStore'

/**
 * Sidebar Navigation Component
 * Displays app branding, navigation links, and global filters
 */
export const Sidebar: React.FC = () => {
  const {
    region,
    incomeLevel,
    residenceType,
    setRegion,
    setIncome,
    setResidence,
  } = useFilterStore()

  const handleApplyFilters = () => {
    // Filters are automatically reactive via Zustand
    // No action needed here; just indicate visual feedback
  }

  return (
    <aside className='fixed left-0 top-0 h-full w-64 flex flex-col z-40 bg-slate-900 border-r border-slate-700 text-white overflow-y-auto'>
      {/* Sidebar Header */}
      <div className='px-6 py-8 flex flex-col gap-1'>
        <div className='flex items-center gap-2'>
          <div className='w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white text-lg'>
            I
          </div>
          <h1 className='text-xl font-semibold text-white'>IVSDSA</h1>
        </div>
        <p className='text-xs text-slate-400 opacity-70'>Data Systems</p>
      </div>

      {/* Navigation Links */}
      <nav className='flex-1 mt-4'>
        <a
          href='/dashboard'
          className='flex items-center gap-4 px-6 py-3 text-white border-l-4 border-blue-500 bg-slate-800 transition-all'
        >
          <span className='material-symbols-outlined'>analytics</span>
          <span className='text-sm font-medium'>Analytics</span>
        </a>
        <a
          href='/data-ingestion'
          className='flex items-center gap-4 px-6 py-3 text-slate-400 hover:text-white transition-colors hover:bg-slate-800'
        >
          <span className='material-symbols-outlined'>database</span>
          <span className='text-sm font-medium'>Data Management</span>
        </a>
        <a
          href='/user-management'
          className='flex items-center gap-4 px-6 py-3 text-slate-400 hover:text-white transition-colors hover:bg-slate-800'
        >
          <span className='material-symbols-outlined'>group</span>
          <span className='text-sm font-medium'>User Management</span>
        </a>
      </nav>

      {/* Global Filters Section */}
      <div className='p-6 border-t border-slate-700'>
        <h3 className='text-xs font-medium text-slate-400 uppercase tracking-widest mb-4'>
          Global Filters
        </h3>
        <div className='space-y-3'>
          <div>
            <label className='flex items-center gap-2 text-slate-400 mb-2 text-xs font-medium'>
              <span className='material-symbols-outlined text-sm'>public</span>
              Region
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className='w-full bg-slate-800 border border-slate-700 text-white text-sm rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-transparent'
            >
              <option>Metropolitan Area</option>
              <option>Rural North</option>
              <option>Coastal East</option>
            </select>
          </div>
          <div>
            <label className='flex items-center gap-2 text-slate-400 mb-2 text-xs font-medium'>
              <span className='material-symbols-outlined text-sm'>
                payments
              </span>
              Income Level
            </label>
            <select
              value={incomeLevel}
              onChange={(e) => setIncome(e.target.value)}
              className='w-full bg-slate-800 border border-slate-700 text-white text-sm rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-transparent'
            >
              <option>All Tiers</option>
              <option>Low Income</option>
              <option>Middle Income</option>
              <option>High Income</option>
            </select>
          </div>
          <div>
            <label className='flex items-center gap-2 text-slate-400 mb-2 text-xs font-medium'>
              <span className='material-symbols-outlined text-sm'>home</span>
              Residence
            </label>
            <select
              value={residenceType}
              onChange={(e) => setResidence(e.target.value)}
              className='w-full bg-slate-800 border border-slate-700 text-white text-sm rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-transparent'
            >
              <option>Apartment/Condo</option>
              <option>Single Family</option>
              <option>Social Housing</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleApplyFilters}
          className='w-full mt-4 bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 transition-colors text-sm'
        >
          Apply Filters
        </button>
      </div>
    </aside>
  )
}
