import { useFilterStore } from '@/store/useFilterStore'
import {
  Banknote,
  Database,
  Earth,
  House,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useLocation } from 'react-router-dom'

const navLinks = [
  { href: '/dashboard', label: 'Analytics', icon: TrendingUp },
  { href: '/data-ingestion', label: 'Data Management', icon: Database },
  { href: '/user-management', label: 'User Management', icon: Users },
]

export const Sidebar: React.FC = () => {
  const location = useLocation()
  const {
    region,
    incomeLevel,
    residenceType,
    setRegion,
    setIncome,
    setResidence,
  } = useFilterStore()

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
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = location.pathname === href
          return (
            <a
              key={href}
              href={href}
              className={`flex items-center gap-4 px-6 py-3 transition-all text-sm font-medium border-l-4 ${
                isActive
                  ? 'border-blue-500 bg-slate-800 text-white'
                  : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </a>
          )
        })}
      </nav>

      {/* Global Filters Section */}
      <div className='p-6 border-t border-slate-700'>
        <h3 className='text-xs font-medium text-slate-400 uppercase tracking-widest mb-4'>
          Global Filters
        </h3>
        <div className='space-y-3'>
          <div>
            <label className='flex items-center gap-2 text-slate-400 mb-2 text-xs font-medium'>
              <Earth size={18} />
              Region
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className='w-full bg-slate-800 border border-slate-700 text-white text-sm rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-transparent'
            >
              <option value=''>All Regions</option>
              <option value='Maroodi Jeex'>Maroodi Jeex</option>
              <option value='Saxil'>Saxil</option>
              <option value='Togdheer'>Togdheer</option>
              <option value='Sool'>Sool</option>
              <option value='Awdal'>Awdal</option>
              <option value='Sanaag'>Sanaag</option>
            </select>
          </div>
          <div>
            <label className='flex items-center gap-2 text-slate-400 mb-2 text-xs font-medium'>
              <Banknote size={18} />
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
              <House size={18} />
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
        <button className='w-full mt-4 bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 transition-colors text-sm'>
          Apply Filters
        </button>
      </div>
    </aside>
  )
}
