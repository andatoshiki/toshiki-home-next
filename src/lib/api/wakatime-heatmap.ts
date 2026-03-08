import { ApiError } from '~/errors/api-error'

const wakatime_endpoint =
  process.env.WAKATIME_API_ENDPOINT || 'wakatime.tosh1ki.de'
const wakatime_proxy_endpoint =
  process.env.WAKATIME_API_PROXY_ENDPOINT || 'wakatime.api.tosh1ki.de'
const wakatime_api_key = process.env.WAKATIME_API_KEY || ''
const wakatime_username = process.env.WAKATIME_USERNAME || 'andatoshiki'
const encodedApiKey = Buffer.from(wakatime_api_key).toString('base64')
const headers = new Headers({
  // Authorization: `Basic ${encodedApiKey}`,
  Accept: 'application/json'
})

/**
 * Fetch WakaTime daily summaries for a given year
 * @param year - The year to fetch (e.g. 2025)
 * @returns Array of { date: string, value: number }
 */
export async function getWakatimeHeatmapData(year: number) {
  const start = `${year}-01-01`
  const end = `${year}-12-31`
  // opt to use wakatime proxy endpoitn for my personal wakapi instance as the original does not cache api respones
  // [TODO] migrate the worker function to vercel/netlify for project consistency
  const url = `https://${wakatime_proxy_endpoint}/api/compat/wakatime/v1/users/${wakatime_username}/summaries?start=${start}&end=${end}`
  let response
  try {
    response = await fetch(url, { headers })
  } catch (err) {
    console.error('WakaTime fetch error:', err)
    throw new ApiError({
      message: 'Network error',
      status: 0,
      url
    })
  }
  if (!response.ok) {
    console.error(
      'WakaTime API error:',
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
  const result = await response.json()
  // Map API response to heatmap format: { date, value }
  // Each entry in result.data has range.start (date) and grand_total.total_seconds
  return (result.data || []).map((entry: any) => ({
    date: entry.range?.start?.slice(0, 10),
    value:
      Math.round(((entry.grand_total?.total_seconds || 0) / 3600) * 10) / 10 // hours, rounded to 1 decimal
  }))
}
