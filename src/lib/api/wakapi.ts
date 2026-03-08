import { ApiError } from '~/errors/api-error'

const wakapi_endpoint =
  process.env.WAKATIME_API_ENDPOINT || 'wakatime.tosh1ki.de'
const wakapi_proxy_endpoint =
  process.env.WAKATIME_API_PROXY_ENDPOINT || 'wakatime.api.tosh1ki.de'
const wakapi_api_key = process.env.WAKATIME_API_KEY || ''
const wakapi_username = process.env.WAKATIME_USERNAME || 'andatoshiki'
const encodedApiKey = Buffer.from(wakapi_api_key).toString('base64')
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

/**
 * Fetch Wakapi daily summaries for a date range
 * @param days - Number of days to fetch (default 30)
 * @returns Array of WakapiDaySummary
 */
export async function getWakapiSummaries(
  days: number = 30
): Promise<WakapiDaySummary[]> {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - days)

  const startStr = start.toISOString().slice(0, 10)
  const endStr = end.toISOString().slice(0, 10)

  const url = `https://${wakapi_proxy_endpoint}/api/compat/wakatime/v1/users/${wakapi_username}/summaries?start=${startStr}&end=${endStr}`

  let response
  try {
    response = await fetch(url, { headers, next: { revalidate: 3600 } })
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

/**
 * Fetch Wakapi daily summaries for a specific year
 * @param year - The year to fetch data for
 * @returns Array of WakapiDaySummary
 */
export async function getWakapiSummariesByYear(
  year: number
): Promise<WakapiDaySummary[]> {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()

  const startStr = `${year}-01-01`
  // If it's the current year, only fetch up to today
  const endStr =
    year === currentYear
      ? currentDate.toISOString().slice(0, 10)
      : `${year}-12-31`

  const url = `https://${wakapi_proxy_endpoint}/api/compat/wakatime/v1/users/${wakapi_username}/summaries?start=${startStr}&end=${endStr}`

  let response
  try {
    response = await fetch(url, { headers, next: { revalidate: 3600 } })
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
 * Aggregate operating systems from summaries
 */
export function aggregateOperatingSystems(summaries: WakapiDaySummary[]) {
  const osTotals: Record<string, number> = {}

  summaries.forEach(summary => {
    if (Array.isArray(summary.operating_systems)) {
      summary.operating_systems.forEach(os => {
        if (!osTotals[os.name]) osTotals[os.name] = 0
        osTotals[os.name] += os.total_seconds
      })
    }
  })

  return Object.entries(osTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

/**
 * Aggregate projects from summaries
 */
export function aggregateProjects(summaries: WakapiDaySummary[]) {
  const projectTotals: Record<string, number> = {}

  summaries.forEach(summary => {
    if (Array.isArray(summary.projects)) {
      summary.projects.forEach(project => {
        if (!projectTotals[project.name]) projectTotals[project.name] = 0
        projectTotals[project.name] += project.total_seconds
      })
    }
  })

  return Object.entries(projectTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

/**
 * Get daily coding time data for charts
 */
export function getDailyCodingData(summaries: WakapiDaySummary[]) {
  return summaries.map(summary => {
    // Ensure total_seconds is positive (API might return negative values)
    const totalSeconds = Math.max(0, summary.grand_total.total_seconds || 0)
    const hours = Math.round((totalSeconds / 3600) * 10) / 10

    return {
      date: summary.range.start.slice(0, 10),
      shortDate: new Date(summary.range.start).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      totalSeconds,
      hours,
      // Generate text from calculated values, not from API
      text: formatDuration(totalSeconds)
    }
  })
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
