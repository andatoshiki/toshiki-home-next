const DEFAULT_LEETCODE_API_ENDPOINT = 'https://leetcode.toshiki.dev'

function normalizeEndpoint(endpoint: string) {
  const value = endpoint.trim().replace(/\/+$/, '')
  return /^https?:\/\//.test(value) ? value : `https://${value}`
}

export const leetcodeApiEndpoint = normalizeEndpoint(
  process.env.NEXT_PUBLIC_LEETCODE_API_ENDPOINT || DEFAULT_LEETCODE_API_ENDPOINT
)

export const LEETCODE_USERNAME =
  process.env.NEXT_PUBLIC_LEETCODE_USERNAME ?? 'andatoshiki'

export function currentLeetcodeYear() {
  return new Date().getFullYear()
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type LeetcodeCalendarDay = {
  date: string // YYYY-MM-DD
  count: number
  level: number
}

export type LeetcodeStats = {
  totalSubmissions: number
  activeDays: number
  maxStreak: number
}

type CalendarApiResponse = {
  submissionCalendar: string // JSON-encoded string from LeetCode's GraphQL
  totalActiveDays: number
  streak: number
  activeYears: number[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSubmissionLevel(count: number): number {
  if (count === 0) return 0
  if (count === 1) return 1
  if (count <= 3) return 2
  if (count <= 5) return 3
  return 4
}

function unixToDateKey(unix: number): string {
  const d = new Date(unix * 1000)
  const yyyy = d.getUTCFullYear()
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(d.getUTCDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function toDateKey(d: Date): string {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

/**
 * Ensures the data spans from Jan 1 to Dec 31 of the given year (or today for
 * the current year) so that the heatmap always renders a full-year grid.
 */
export function padToFullYear(
  days: LeetcodeCalendarDay[],
  year: number
): LeetcodeCalendarDay[] {
  const jan1 = `${year}-01-01`
  const lastDay = `${year}-12-31`

  const existing = new Set(days.map(d => d.date))
  const padded = [...days]

  if (!existing.has(jan1)) {
    padded.push({ date: jan1, count: 0, level: 0 })
  }
  if (!existing.has(lastDay)) {
    padded.push({ date: lastDay, count: 0, level: 0 })
  }

  return padded
}

// ─── API ──────────────────────────────────────────────────────────────────────

export async function fetchLeetcodeCalendar(
  username: string,
  year: number
): Promise<{ days: LeetcodeCalendarDay[] } & LeetcodeStats> {
  const url = new URL(`${leetcodeApiEndpoint}/${username}/calendar`)
  url.searchParams.set('year', String(year))

  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error(`LeetCode API ${res.status}: ${res.statusText}`)
  }

  const json: CalendarApiResponse = await res.json()

  // submissionCalendar arrives as a JSON-encoded string from LeetCode's GraphQL
  const calendar: Record<string, number> = JSON.parse(json.submissionCalendar ?? '{}')

  const yearPrefix = String(year)
  const days = Object.entries(calendar)
    .map(([ts, count]) => ({
      date: unixToDateKey(Number(ts)),
      count,
      level: getSubmissionLevel(count)
    }))
    .filter(d => d.date.startsWith(yearPrefix))

  const totalSubmissions = days.reduce((sum, d) => sum + d.count, 0)

  return {
    days,
    totalSubmissions,
    activeDays: json.totalActiveDays ?? days.filter(d => d.count > 0).length,
    maxStreak: json.streak ?? computeLeetcodeStats(days).maxStreak
  }
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export function computeLeetcodeStats(days: LeetcodeCalendarDay[]): LeetcodeStats {
  const totalSubmissions = days.reduce((sum, d) => sum + d.count, 0)
  const activeDays = days.filter(d => d.count > 0).length

  const active = [...days]
    .filter(d => d.count > 0)
    .sort((a, b) => a.date.localeCompare(b.date))

  let maxStreak = 0
  let streak = 0
  let prev: Date | null = null

  for (const day of active) {
    const cur = new Date(`${day.date}T12:00:00`)
    if (prev) {
      const diffDays = Math.round(
        (cur.getTime() - prev.getTime()) / 86_400_000
      )
      streak = diffDays === 1 ? streak + 1 : 1
    } else {
      streak = 1
    }
    if (streak > maxStreak) maxStreak = streak
    prev = cur
  }

  return { totalSubmissions, activeDays, maxStreak }
}
