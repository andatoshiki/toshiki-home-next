import { ApiError } from '~/errors/api-error'

const wakapiProxyEndpoint =
  process.env.NEXT_PUBLIC_WAKAPI_PROXY_ENDPOINT ||
  process.env.NEXT_PUBLIC_WAKATIME_API_PROXY_ENDPOINT ||
  'wakatime.api.tosh1ki.de'
const wakapiUsername =
  process.env.NEXT_PUBLIC_WAKAPI_USERNAME ||
  process.env.NEXT_PUBLIC_WAKATIME_USERNAME ||
  'andatoshiki'
const headers = new Headers({
  Accept: 'application/json'
})

// Types for Wakapi API response
export interface WakapiGrandTotal {
  digital: string
  hours: number
  minutes: number
  text: string
  total_seconds: number
}

export interface WakapiRange {
  date: string
  end: string
  start: string
  text: string
  timezone: string
}

export interface WakapiItem {
  name: string
  total_seconds: number
  percent: number
  digital: string
  text: string
  hours: number
  minutes: number
  seconds?: number
}

export interface WakapiDaySummary {
  categories: WakapiItem[]
  dependencies: WakapiItem[]
  editors: WakapiItem[]
  languages: WakapiItem[]
  machines: WakapiItem[]
  operating_systems: WakapiItem[]
  projects: WakapiItem[]
  grand_total: WakapiGrandTotal
  range: WakapiRange
}

export interface WakapiSummariesResponse {
  data: WakapiDaySummary[]
}

export interface WakapiHeatmapDatum {
  date: string
  value: number
}

export interface WakapiDailyDatum {
  date: string
  shortDate: string
  totalSeconds: number
  hours: number
  text: string
}

function toDateString(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function parseDisplayDate(dateString: string) {
  return new Date(`${dateString}T12:00:00`)
}

async function fetchWakapiSummariesRange(
  start: string,
  end: string
): Promise<WakapiDaySummary[]> {
  const url = `https://${wakapiProxyEndpoint}/api/compat/wakatime/v1/users/${wakapiUsername}/summaries?start=${start}&end=${end}`

  let response
  try {
    response = await fetch(url, { headers })
  } catch (err) {
    console.error('Wakapi fetch error:', err)
    throw new ApiError({
      message: 'Network error',
      status: 0,
      url
    })
  }

  if (!response.ok) {
    console.error(
      'Wakapi API error:',
      response.status,
      response.statusText,
      url
    )
    throw new ApiError({
      message: response.statusText,
      status: response.status,
      url: response.url
    })
  }

  const result: WakapiSummariesResponse = await response.json()
  return result.data || []
}

export function getCurrentWakapiYear() {
  return new Date().getFullYear()
}

export function getAvailableWakapiYears(startYear = 2022) {
  const currentYear = getCurrentWakapiYear()

  return Array.from(
    { length: currentYear - startYear + 1 },
    (_, index) => currentYear - index
  )
}

/**
 * Fetch Wakapi daily summaries for a date range
 */
export async function fetchWakapiSummariesForDays(days = 30) {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - days)

  return fetchWakapiSummariesRange(toDateString(start), toDateString(end))
}

/**
 * Fetch Wakapi daily summaries for a specific year
 */
export async function fetchWakapiSummariesForYear(
  year: number
): Promise<WakapiDaySummary[]> {
  const currentDate = new Date()
  const currentYear = getCurrentWakapiYear()

  const startStr = `${year}-01-01`
  const endStr =
    year === currentYear ? toDateString(currentDate) : `${year}-12-31`

  return fetchWakapiSummariesRange(startStr, endStr)
}

/**
 * Aggregate languages from summaries
 */
export function aggregateLanguages(summaries: WakapiDaySummary[]) {
  const languageTotals: Record<string, number> = {}

  summaries.forEach(summary => {
    if (Array.isArray(summary.languages)) {
      summary.languages.forEach(lang => {
        if (!languageTotals[lang.name]) languageTotals[lang.name] = 0
        languageTotals[lang.name] += lang.total_seconds
      })
    }
  })

  return Object.entries(languageTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

/**
 * Aggregate editors from summaries
 */
export function aggregateEditors(summaries: WakapiDaySummary[]) {
  const editorTotals: Record<string, number> = {}

  summaries.forEach(summary => {
    if (Array.isArray(summary.editors)) {
      summary.editors.forEach(editor => {
        if (!editorTotals[editor.name]) editorTotals[editor.name] = 0
        editorTotals[editor.name] += editor.total_seconds
      })
    }
  })

  return Object.entries(editorTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

/**
 * Aggregate heatmap data from summaries
 */
export function getWakapiHeatmapData(
  summaries: WakapiDaySummary[]
): WakapiHeatmapDatum[] {
  return summaries.map(summary => {
    const totalSeconds = Math.max(0, summary.grand_total.total_seconds || 0)

    return {
      date: summary.range.start.slice(0, 10),
      value: Math.round((totalSeconds / 3600) * 10) / 10
    }
  })
}

/**
 * Get daily coding time data for charts
 */
export function getDailyCodingData(
  summaries: WakapiDaySummary[]
): WakapiDailyDatum[] {
  return summaries
    .map(summary => {
      const totalSeconds = Math.max(0, summary.grand_total.total_seconds || 0)
      const hours = Math.round((totalSeconds / 3600) * 10) / 10
      const date = summary.range.start.slice(0, 10)

      return {
        date,
        shortDate: parseDisplayDate(date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        }),
        totalSeconds,
        hours,
        // Generate text from calculated values, not from API
        text: formatDuration(totalSeconds)
      }
    })
    .sort((left, right) => left.date.localeCompare(right.date))
}

/**
 * Format seconds into human readable duration
 */
function formatDuration(seconds: number): string {
  if (seconds <= 0) return '0 mins'
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return mins > 0 ? `${hours} hrs ${mins} mins` : `${hours} hrs`
  }
  return `${mins} mins`
}
