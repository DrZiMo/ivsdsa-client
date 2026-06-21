import { useMemo } from 'react'
import { MainLayout } from '@/layouts/MainLayout'
import {
  useDashboardMetrics,
  useServiceTrends,
  useActivityData,
  useSurveyResponses,
} from '@/hooks/useQueries'

/**
 * KPI Card Component
 */
const KPICard: React.FC<{
  label: string
  value: string | number
  trend?: number
  trendType?: 'up' | 'down'
  icon?: string
  progressPercentage?: number
}> = ({ label, value, trend, trendType = 'up', icon, progressPercentage }) => {
  const trendColor = trendType === 'up' ? 'text-green-600' : 'text-red-600'

  return (
    <div className='bg-white border border-gray-200 p-6 rounded-lg flex flex-col gap-2 hover:border-blue-500 transition-colors'>
      <span className='text-xs font-semibold text-gray-600 uppercase tracking-wide'>
        {label}
      </span>
      <div className='flex items-end gap-2'>
        <span className='text-3xl font-bold text-gray-900'>{value}</span>
        {trend !== undefined && (
          <span
            className={`${trendColor} text-sm font-medium flex items-center mb-1`}
          >
            <span className='material-symbols-outlined text-xs'>
              {trendType === 'up' ? 'trending_up' : 'trending_down'}
            </span>
            {trend}%
          </span>
        )}
      </div>
      {progressPercentage !== undefined && (
        <div className='w-full bg-gray-200 h-1 rounded-full overflow-hidden mt-2'>
          <div
            className='bg-blue-600 h-full'
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      )}
      {icon && !progressPercentage && (
        <div className='flex items-center gap-2 mt-2'>
          <span className='material-symbols-outlined text-blue-600 text-lg'>
            {icon}
          </span>
          <span className='text-gray-900 font-semibold'>{value}</span>
        </div>
      )}
    </div>
  )
}

/**
 * Dashboard Page - Main View
 */
export const DashboardPage: React.FC = () => {
  const metricsQuery = useDashboardMetrics()
  const trendsQuery = useServiceTrends()
  const activityQuery = useActivityData()
  const surveysQuery = useSurveyResponses(5)

  // Generate heatmap grid once at mount
  const heatmapGrid = useMemo(() => {
    const colors = ['bg-gray-200', 'bg-blue-100', 'bg-blue-300', 'bg-blue-600']
    const seed = 12345 // Fixed seed for deterministic randomness
    const result = []
    for (let i = 0; i < 84; i++) {
      // Pseudo-random based on seed (deterministic)
      const pseudo = Math.sin(seed * i) * 10000
      const colorIdx = Math.floor((pseudo - Math.floor(pseudo)) * colors.length)
      result.push(colors[Math.max(0, colorIdx)])
    }
    return result
  }, [])

  const isLoading =
    metricsQuery.isLoading ||
    trendsQuery.isLoading ||
    activityQuery.isLoading ||
    surveysQuery.isLoading

  const metrics = metricsQuery.data
  const trends = trendsQuery.data || []
  const surveys = surveysQuery.data || []

  return (
    <MainLayout pageTitle='Dashboard'>
      {isLoading ? (
        <div className='flex items-center justify-center h-96'>
          <div className='text-center'>
            <div className='animate-spin mb-4'>
              <span className='material-symbols-outlined text-4xl text-blue-600'>
                autorenew
              </span>
            </div>
            <p className='text-gray-600'>Loading dashboard...</p>
          </div>
        </div>
      ) : (
        <div className='space-y-6'>
          {/* ROW 1: KPI CARDS */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {metrics && (
              <>
                <KPICard
                  label='Total Households'
                  value={metrics.totalHouseholds.toLocaleString()}
                  trend={metrics.householdsTrend}
                  trendType='up'
                  progressPercentage={75}
                />
                <KPICard
                  label='Internet Access'
                  value={`${metrics.internetAccess.toFixed(1)}%`}
                  trend={metrics.accessTrend}
                  trendType='down'
                  progressPercentage={metrics.internetAccess}
                />
                <KPICard
                  label='Service Preference'
                  value={metrics.servicePreference}
                  icon='account_balance_wallet'
                />
                <KPICard
                  label='Avg. Data Usage'
                  value={metrics.avgDataUsage}
                  trend={metrics.dataTrend}
                  trendType='up'
                />
              </>
            )}
          </div>

          {/* ROW 2: MAP & TRENDS CHART */}
          <div className='grid grid-cols-1 lg:grid-cols-10 gap-6'>
            {/* Map Container (60%) */}
            <div className='lg:col-span-6 bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col h-96'>
              <div className='p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50'>
                <h3 className='font-semibold text-gray-900'>
                  Regional Distribution Map
                </h3>
                <div className='flex gap-2'>
                  <button className='bg-white p-1 border border-gray-300 hover:bg-gray-50 transition-colors rounded'>
                    <span className='material-symbols-outlined text-sm'>
                      zoom_in
                    </span>
                  </button>
                  <button className='bg-white p-1 border border-gray-300 hover:bg-gray-50 transition-colors rounded'>
                    <span className='material-symbols-outlined text-sm'>
                      zoom_out
                    </span>
                  </button>
                  <button className='bg-white p-1 border border-gray-300 hover:bg-gray-50 transition-colors rounded'>
                    <span className='material-symbols-outlined text-sm'>
                      layers
                    </span>
                  </button>
                </div>
              </div>
              <div className='flex-1 bg-gray-100 flex items-center justify-center relative'>
                <div className='absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50 opacity-50' />
                <span className='material-symbols-outlined text-6xl text-gray-400 opacity-30 absolute'>
                  map
                </span>
                <div className='absolute bottom-4 left-4 bg-white p-3 border border-gray-200 rounded shadow-sm z-10'>
                  <span className='text-xs font-semibold text-gray-600 block mb-2'>
                    Access Density
                  </span>
                  <div className='flex gap-1'>
                    {[
                      'bg-gray-300',
                      'bg-blue-200',
                      'bg-blue-400',
                      'bg-blue-600',
                      'bg-blue-900',
                    ].map((color, i) => (
                      <div key={i} className={`w-3 h-3 ${color} rounded`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Trends Chart (40%) */}
            <div className='lg:col-span-4 bg-white border border-gray-200 rounded-lg p-6 flex flex-col h-96'>
              <div className='flex justify-between items-start mb-4'>
                <div>
                  <h3 className='font-semibold text-gray-900'>
                    Service Usage Trends
                  </h3>
                  <p className='text-xs text-gray-600'>
                    Aggregation of last 12 months
                  </p>
                </div>
                <span className='material-symbols-outlined text-gray-600'>
                  more_vert
                </span>
              </div>
              <div className='flex-1 flex flex-col justify-between'>
                <div className='flex-1 flex items-end justify-between mb-4 gap-2'>
                  {trends.map((trend, idx) => (
                    <div
                      key={idx}
                      className='flex-1 flex flex-col items-center'
                    >
                      <div className='flex gap-1 h-32 items-end justify-center w-full'>
                        <div
                          className='bg-blue-600 rounded-t'
                          style={{
                            height: `${(trend.digitalChannels / 100) * 100}%`,
                            width: '40%',
                          }}
                        />
                        <div
                          className='bg-gray-400 rounded-t'
                          style={{
                            height: `${(trend.physicalOutlets / 100) * 100}%`,
                            width: '40%',
                          }}
                        />
                      </div>
                      <span className='text-xs text-gray-600 mt-2'>
                        {trend.month}
                      </span>
                    </div>
                  ))}
                </div>
                <div className='flex gap-4 border-t border-gray-200 pt-4'>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 rounded-full bg-blue-600' />
                    <span className='text-xs text-gray-600'>
                      Digital Channels
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 rounded-full bg-gray-400' />
                    <span className='text-xs text-gray-600'>
                      Physical Outlets
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ROW 3: HEATMAP & TABLE */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Activity Heatmap */}
            <div className='bg-white border border-gray-200 rounded-lg p-6'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='font-semibold text-gray-900'>
                  Activity Heatmap
                </h3>
                <div className='flex items-center gap-2'>
                  <span className='text-xs text-gray-600'>Less</span>
                  {[
                    'bg-gray-200',
                    'bg-blue-100',
                    'bg-blue-300',
                    'bg-blue-600',
                  ].map((color, i) => (
                    <div key={i} className={`w-3 h-3 ${color} rounded`} />
                  ))}
                  <span className='text-xs text-gray-600'>More</span>
                </div>
              </div>
              <div className='grid grid-cols-12 gap-1 h-40'>
                {heatmapGrid.map((color, i) => (
                  <div
                    key={i}
                    className={`${color} rounded cursor-pointer hover:scale-110 transition-transform`}
                  />
                ))}
              </div>
              <div className='flex justify-between mt-3 text-xs text-gray-600 px-1'>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                  (day) => (
                    <span key={day}>{day}</span>
                  ),
                )}
              </div>
            </div>

            {/* Recent Survey Responses Table */}
            <div className='bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col'>
              <div className='p-6 border-b border-gray-200 flex justify-between items-center'>
                <h3 className='font-semibold text-gray-900'>
                  Recent Survey Responses
                </h3>
                <a
                  href='/surveys'
                  className='text-blue-600 text-sm font-medium hover:underline'
                >
                  View All
                </a>
              </div>
              <div className='overflow-x-auto flex-1'>
                <table className='w-full text-sm'>
                  <thead className='bg-gray-50 border-b border-gray-200'>
                    <tr>
                      <th className='px-6 py-3 text-left font-semibold text-gray-900'>
                        Date
                      </th>
                      <th className='px-6 py-3 text-left font-semibold text-gray-900'>
                        HH_ID
                      </th>
                      <th className='px-6 py-3 text-left font-semibold text-gray-900'>
                        Connectivity
                      </th>
                      <th className='px-6 py-3 text-right font-semibold text-gray-900'>
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>
                    {surveys.map((survey) => (
                      <tr
                        key={survey.id}
                        className='hover:bg-gray-50 transition-colors'
                      >
                        <td className='px-6 py-3 text-gray-900'>
                          {survey.date}
                        </td>
                        <td className='px-6 py-3 font-mono text-gray-600'>
                          {survey.hhId}
                        </td>
                        <td className='px-6 py-3 text-gray-900'>
                          {survey.connectivity}
                        </td>
                        <td className='px-6 py-3 text-right'>
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded ${
                              survey.status === 'verified'
                                ? 'bg-green-100 text-green-800'
                                : survey.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {survey.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  )
}
