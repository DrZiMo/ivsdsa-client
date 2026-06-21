/**
 * Application constants
 */

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export const API_TIMEOUT = 30000

export const EMPTY_STATE_MESSAGES = {
  NO_DATA: 'No data available',
  NO_METRICS: 'Unable to load metrics',
  NO_REGIONS: 'No regional data available',
  NO_TRENDS: 'No trend data available',
  NO_SURVEYS: 'No survey responses available',
  NO_UPLOADS: 'No uploads yet',
  ERROR: 'Failed to load data',
}
