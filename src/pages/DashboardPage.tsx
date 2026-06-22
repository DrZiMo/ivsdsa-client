import { useMemo, useRef, useState } from 'react'
import {
  useDashboardMetrics,
  useRegionalData,
  useServiceTrends,
  useActivityData,
  useSurveyResponses,
} from '@/hooks/useQueries'
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type L from 'leaflet'
import {
  EllipsisVertical,
  Layers,
  LoaderCircle,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'

// ─── GeoJSON Data ───────────────────────────────────────────────────────────

const somalilandGeoJSON: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Maroodi Jeex', access: 82 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [43.8, 9.2],
            [44.8, 9.2],
            [44.8, 10.0],
            [43.8, 10.0],
            [43.8, 9.2],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Saxil', access: 61 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [44.8, 9.2],
            [45.5, 9.2],
            [45.5, 10.0],
            [44.8, 10.0],
            [44.8, 9.2],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Togdheer', access: 47 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [44.5, 9.8],
            [46.2, 9.8],
            [46.2, 10.8],
            [44.5, 10.8],
            [44.5, 9.8],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Awdal', access: 55 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [42.5, 9.5],
            [43.8, 9.5],
            [43.8, 10.5],
            [42.5, 10.5],
            [42.5, 9.5],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Sanaag', access: 38 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [46.2, 9.8],
            [48.5, 9.8],
            [48.5, 11.2],
            [46.2, 11.2],
            [46.2, 9.8],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Sool', access: 30 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [45.5, 8.5],
            [47.5, 8.5],
            [47.5, 9.8],
            [45.5, 9.8],
            [45.5, 8.5],
          ],
        ],
      },
    },
  ],
}

// ─── Map Helpers ─────────────────────────────────────────────────────────────

const TILE_LAYERS = {
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com">Esri</a>',
  },
  terrain: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
  },
}

const getColor = (access: number) => {
  if (access >= 75) return '#1d4ed8'
  if (access >= 60) return '#3b82f6'
  if (access >= 45) return '#93c5fd'
  if (access >= 30) return '#bfdbfe'
  return '#e5e7eb'
}

const regionStyle = (feature: GeoJSON.Feature | undefined) => ({
  fillColor: getColor(feature?.properties?.access ?? 0),
  weight: 1.5,
  opacity: 1,
  color: '#ffffff',
  fillOpacity: 0.75,
})

// ─── MapController ────────────────────────────────────────────────────────────

const MapController: React.FC<{
  onZoomIn: (fn: () => void) => void
  onZoomOut: (fn: () => void) => void
}> = ({ onZoomIn, onZoomOut }) => {
  const map = useMap()
  onZoomIn(() => map.zoomIn())
  onZoomOut(() => map.zoomOut())
  return null
}

// ─── RegionalMap ──────────────────────────────────────────────────────────────

const RegionalMap: React.FC<{
  regionalData: import('@/types').RegionalData[]
}> = ({ regionalData }) => {
  const [tileLayer, setTileLayer] = useState<
    'street' | 'satellite' | 'terrain'
  >('street')
  const [showLayerMenu, setShowLayerMenu] = useState(false)
  const zoomInRef = useRef<(() => void) | null>(null)
  const zoomOutRef = useRef<(() => void) | null>(null)

  const accessMap = useMemo(
    () => new Map(regionalData.map((row) => [row.region, row.accessDensity])),
    [regionalData],
  )

  const householdsMap = useMemo(
    () => new Map(regionalData.map((row) => [row.region, row.households])),
    [regionalData],
  )

  const serviceTypeMap = useMemo(
    () => new Map(regionalData.map((row) => [row.region, row.serviceType])),
    [regionalData],
  )

  const geoJsonData = useMemo(
    () => ({
      ...somalilandGeoJSON,
      features: somalilandGeoJSON.features.map((feature) => {
        const regionName = feature.properties?.name ?? 'Unknown'
        return {
          ...feature,
          properties: {
            ...feature.properties,
            access:
              accessMap.get(regionName) ?? feature.properties?.access ?? 0,
            households:
              householdsMap.get(regionName) ??
              feature.properties?.households ??
              0,
            serviceType:
              serviceTypeMap.get(regionName) ??
              feature.properties?.serviceType ??
              'N/A',
          },
        }
      }),
    }),
    [accessMap, householdsMap, serviceTypeMap],
  )

  return (
    <div className='lg:col-span-6 bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col h-96'>
      <div className='p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50'>
        <h3 className='font-semibold text-gray-900'>
          Regional Distribution Map
        </h3>
        <div className='flex gap-2'>
          <button
            onClick={() => zoomInRef.current?.()}
            className='bg-white px-1 border border-gray-300 hover:bg-gray-50 transition-colors rounded'
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={() => zoomOutRef.current?.()}
            className='bg-white px-1 border border-gray-300 hover:bg-gray-50 transition-colors rounded'
          >
            <ZoomOut size={18} />
          </button>
          <div className='relative'>
            <button
              onClick={() => setShowLayerMenu((v) => !v)}
              className='bg-white px-1 py-1 border border-gray-300 hover:bg-gray-50 transition-colors rounded'
            >
              <Layers size={18} />
            </button>
            {showLayerMenu && (
              <div className='absolute right-0 top-8 bg-white border border-gray-200 rounded shadow-lg z-1000 w-36'>
                {(['street', 'satellite', 'terrain'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setTileLayer(l)
                      setShowLayerMenu(false)
                    }}
                    className={`w-full text-left px-3 py-2 text-xs capitalize hover:bg-gray-50 transition-colors ${
                      tileLayer === l
                        ? 'text-blue-600 font-semibold bg-blue-50'
                        : 'text-gray-700'
                    }`}
                  >
                    {l === 'street'
                      ? '🗺 Street'
                      : l === 'satellite'
                        ? '🛰 Satellite'
                        : '🏔 Terrain'}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='flex-1'>
        <MapContainer
          center={[9.5, 45.5]}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
          zoomControl={false}
        >
          <MapController
            onZoomIn={(fn) => {
              zoomInRef.current = fn
            }}
            onZoomOut={(fn) => {
              zoomOutRef.current = fn
            }}
          />
          <TileLayer
            key={tileLayer}
            url={TILE_LAYERS[tileLayer].url}
            attribution={TILE_LAYERS[tileLayer].attribution}
          />
          <GeoJSON
            key={JSON.stringify(geoJsonData)}
            data={geoJsonData}
            style={regionStyle}
            onEachFeature={(feature, layer) => {
              const name = feature.properties?.name ?? 'Unknown'
              const access = feature.properties?.access ?? 0
              const serviceType = feature.properties?.serviceType ?? 'N/A'
              const households = feature.properties?.households ?? 0

              layer.bindTooltip(
                `<div style="font-weight:600">${name}</div>
                 <div>Internet Access: <strong>${access}%</strong></div>
                 <div>Service Type: <strong>${serviceType}</strong></div>
                 <div>Households: <strong>${households.toLocaleString()}</strong></div>`,
                { sticky: true },
              )
              layer.on({
                mouseover: (e: L.LeafletMouseEvent) => {
                  e.target.setStyle({
                    fillOpacity: 0.95,
                    weight: 2.5,
                    color: '#1e40af',
                  })
                },
                mouseout: (e: L.LeafletMouseEvent) => {
                  e.target.setStyle({
                    fillOpacity: 0.75,
                    weight: 1.5,
                    color: '#ffffff',
                  })
                },
              })
            }}
          />
        </MapContainer>
      </div>
    </div>
  )
}

// ─── KPICard ──────────────────────────────────────────────────────────────────

const KPICard: React.FC<{
  label: string
  value: string | number
  trend?: number
  trendType?: 'up' | 'down'
  icon?: string
  progressPercentage?: number
}> = ({ label, value, icon, progressPercentage }) => {
  return (
    <div className='bg-white border border-gray-200 p-6 rounded-lg flex flex-col gap-2 hover:border-blue-500 transition-colors'>
      <span className='text-xs font-semibold text-gray-600 uppercase tracking-wide'>
        {label}
      </span>
      <span className='text-3xl font-bold text-gray-900'>{value}</span>
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

// ─── DashboardPage ────────────────────────────────────────────────────────────

export const DashboardPage: React.FC = () => {
  const metricsQuery = useDashboardMetrics()
  const regionalQuery = useRegionalData()
  const trendsQuery = useServiceTrends()
  const activityQuery = useActivityData()
  const surveysQuery = useSurveyResponses(5)

  const heatmapGrid = useMemo(() => {
    const grid = activityQuery.data || []
    const flatValues = grid.flat()
    const max = Math.max(...flatValues, 1)
    const getColor = (value: number) => {
      if (value <= 0) return 'bg-gray-200'
      if (value <= max * 0.33) return 'bg-blue-100'
      if (value <= max * 0.66) return 'bg-blue-300'
      return 'bg-blue-600'
    }
    return grid.map((row) => row.map(getColor))
  }, [activityQuery.data])

  const trendMax = useMemo(() => {
    const values = trendsQuery.data?.flatMap((trend) => [
      trend.digitalChannels,
      trend.physicalOutlets,
    ]) ?? [100]
    return Math.max(...values, 100)
  }, [trendsQuery.data])

  const isLoading =
    metricsQuery.isLoading ||
    regionalQuery.isLoading ||
    trendsQuery.isLoading ||
    activityQuery.isLoading ||
    surveysQuery.isLoading

  const metrics = metricsQuery.data
  const regionalData = regionalQuery.data || []
  const trends = trendsQuery.data || []
  const surveys = surveysQuery.data || []

  return (
    <>
      {isLoading ? (
        <div className='flex items-center justify-center h-96'>
          <div className='text-center'>
            <div className='mb-4 flex items-center justify-center'>
              <LoaderCircle className='animate-spin' />
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
            <RegionalMap regionalData={regionalData} />

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
                <EllipsisVertical size={18} />
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
                            height: `${
                              (trend.digitalChannels / trendMax) * 100
                            }%`,
                            width: '40%',
                          }}
                        />
                        <div
                          className='bg-gray-400 rounded-t'
                          style={{
                            height: `${
                              (trend.physicalOutlets / trendMax) * 100
                            }%`,
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
              <div className='grid grid-cols-7 gap-1 h-40'>
                {heatmapGrid.length > 0 ? (
                  heatmapGrid.flatMap((row, rowIndex) =>
                    row.map((color, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`${color} rounded cursor-pointer hover:scale-110 transition-transform`}
                      />
                    )),
                  )
                ) : (
                  <div className='col-span-7 flex items-center justify-center text-gray-500'>
                    No activity data available
                  </div>
                )}
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
    </>
  )
}
