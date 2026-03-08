import { ApiError } from '~/errors/api-error'

export interface Wakatime {
  data: {
    total_seconds: number
    text: string
    is_up_to_date: boolean
    range: {
      end: string
      end_date: string
      start: string
      start_date: string
      timezone: string
    }
  }
}

const GIST_API_URL = process.env.GITHUB_API_ENDPOINT || 'api.github.com'
const WAKATIME_GIST_ID =
  process.env.NEXT_PUBLIC_WAKATIME_GIST_ID || 'e7accc8f1fd74ac8655049be4c5ffad1'

// Main function to fetch and process WakaTime Gist data
/**
 * Fetch and process WakaTime Gist data, with optional date range filtering.
 * @param startDate (optional) ISO string or Date for range start (inclusive)
 * @param endDate (optional) ISO string or Date for range end (inclusive)
 */
export async function getWakatimeData(
  startDate?: string | Date,
  endDate?: string | Date
) {
  if (!WAKATIME_GIST_ID) {
    throw new ApiError({
      message: 'WAKATIME_GIST_ID is not set in environment variables',
      status: 400,
      url: ''
    })
  }

  // Fetch the gist metadata from GitHub API
  const gistRes = await fetch(
    `https://${GIST_API_URL}/gists/e7accc8f1fd74ac8655049be4c5ffad1`
  )
  if (!gistRes.ok) {
    throw new ApiError({
      message: gistRes.statusText,
      status: gistRes.status,
      url: gistRes.url
    })
  }
  const gistData = await gistRes.json()
  const files = gistData.files || {}

  // Collect all summary JSON file URLs
  const summaryUrls = Object.values(files)
    .filter(
      (file: any) =>
        file.type === 'application/json' && /summaries/.test(file.filename)
    )
    .map((file: any) => file.raw_url)

  // Fetch all summary files in parallel
  const summaryResponses = await Promise.all(
    summaryUrls.map(url =>
      fetch(url)
        .then(res => res.json())
        .catch(() => null)
    )
  )
  // Filter out failed fetches
  let summaries = summaryResponses.filter(Boolean)

  // If date range is specified, filter summaries by summary.range.date
  if (startDate || endDate) {
    const start = startDate ? new Date(startDate) : undefined
    const end = endDate ? new Date(endDate) : undefined
    summaries = summaries.filter((summary: any) => {
      const date = summary.range?.date ? new Date(summary.range.date) : null
      if (!date) return false
      if (start && date < start) return false
      if (end && date > end) return false
      return true
    })
  }

  // --- Use original dashboard logic: flatten summaries, aggregate projects and languages ---
  // Flatten all summary arrays (in case each summary is an array)
  const flatSummaries = summaries.flat()

  // Aggregate projects
  const allProjects: any[] = []
  flatSummaries.forEach((summary: any) => {
    if (Array.isArray(summary.projects)) {
      summary.projects.forEach((project: any) => {
        allProjects.push({
          date: summary.range?.date,
          ...project
        })
      })
    }
  })

  // Aggregate languages (sum total_seconds per language)
  const languageTotals: Record<string, any> = {}
  flatSummaries.forEach((summary: any) => {
    if (Array.isArray(summary.languages)) {
      summary.languages.forEach((lang: any) => {
        if (!lang.name) return
        if (!languageTotals[lang.name]) {
          languageTotals[lang.name] = { ...lang }
        } else {
          languageTotals[lang.name].total_seconds += lang.total_seconds || 0
          if (lang.text) languageTotals[lang.name].text = lang.text
        }
      })
    }
  })
  const languages = Object.values(languageTotals)

  // Return all summaries, flattened projects, and aggregated languages for charting
  return {
    summaries: flatSummaries,
    projects: allProjects,
    languages
  }
}

const wakatime_endpoint =
  process.env.WAKATIME_API_ENDPOINT || 'wakatime.toshiki.dev'
const wakatime_api_key = process.env.WAKATIME_API_KEY || ''
const wakatime_username = process.env.WAKATIME_USERNAME || 'andatoshiki'
const headers = new Headers({
  Authorization: `Basic ${Buffer.from(wakatime_api_key).toString('base64')}`,
  Accept: 'application/json'
})

export async function getCodingHrs() {
  const url = `https://${wakatime_endpoint}/api/compat/wakatime/v1/users/${wakatime_username}/all_time_since_today`
  const response = await fetch(url, { headers })
  if (!response.ok) {
    throw new Error(`Fetch error: ${response.status} ${response.statusText}`)
  }
  return response.json()
}
