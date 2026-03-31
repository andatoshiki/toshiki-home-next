export const githubActivityWindowDays = 30
const githubActivityMaxWindowDays = 365

export interface GithubActivitySourceDefinition {
  type: string
  label: string
  theme: {
    light: string
    dark: string
  }
  strokeWidth: number
  strokeDasharray?: string
  hideWhenEmpty?: boolean
}

export const githubActivitySourceDefinitions = [
  {
    type: 'pullRequests',
    label: 'PR',
    theme: {
      light: '#171717',
      dark: '#fafafa'
    },
    strokeWidth: 1.75,
    strokeDasharray: '4 4'
  },
  {
    type: 'issues',
    label: 'Issue',
    theme: {
      light: '#525252',
      dark: '#d4d4d4'
    },
    strokeWidth: 1.5
  },
  {
    type: 'reviews',
    label: 'Review',
    theme: {
      light: '#737373',
      dark: '#a3a3a3'
    },
    strokeWidth: 1.5,
    strokeDasharray: '6 4'
  },
  {
    type: 'repositories',
    label: 'Repo',
    theme: {
      light: '#a3a3a3',
      dark: '#737373'
    },
    strokeWidth: 1.5,
    strokeDasharray: '1 5',
    hideWhenEmpty: true
  }
] as const satisfies readonly GithubActivitySourceDefinition[]

export type GithubActivityType =
  (typeof githubActivitySourceDefinitions)[number]['type']
export type GithubActivitySource =
  (typeof githubActivitySourceDefinitions)[number]

export interface GithubActivityRecord {
  type: GithubActivityType
  occurredAt: string
  repositoryName?: string
}

export type GithubActivitySeriesDay = {
  date: string
  shortDate: string
} & Record<GithubActivityType, number>

export interface GithubActivitySnapshot {
  requestedTypes: GithubActivityType[]
  failedTypes: GithubActivityType[]
  series: GithubActivitySeriesDay[]
}

export const defaultGithubActivityTypes = Array.from(
  githubActivitySourceDefinitions,
  source => source.type
)

function toUtcDateKey(date: Date) {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function addUtcDays(date: Date, days: number) {
  const next = new Date(date)
  next.setUTCDate(next.getUTCDate() + days)
  return next
}

function getUtcStartOfToday() {
  const now = new Date()

  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  )
}

function createEmptyGithubActivityCounts() {
  return githubActivitySourceDefinitions.reduce(
    (counts, source) => {
      counts[source.type] = 0
      return counts
    },
    {} as Record<GithubActivityType, number>
  )
}

export function normalizeGithubActivityTypes(
  types: readonly GithubActivityType[]
) {
  const uniqueTypes = new Set(types)

  return githubActivitySourceDefinitions
    .map(source => source.type)
    .filter(type => uniqueTypes.has(type))
}

function normalizeGithubActivityWindowDays(days: number) {
  if (!Number.isFinite(days)) {
    return githubActivityWindowDays
  }

  return Math.min(githubActivityMaxWindowDays, Math.max(1, Math.trunc(days)))
}

export function getVisibleGithubActivitySources(
  series: GithubActivitySeriesDay[],
  requestedTypes: readonly GithubActivityType[]
) {
  const normalizedTypes = new Set(normalizeGithubActivityTypes(requestedTypes))

  return githubActivitySourceDefinitions.filter(source => {
    if (!normalizedTypes.has(source.type)) {
      return false
    }

    if (!('hideWhenEmpty' in source) || !source.hideWhenEmpty) {
      return true
    }

    return series.some(day => day[source.type] > 0)
  })
}

export function getGithubActivityLabel(type: GithubActivityType) {
  return (
    githubActivitySourceDefinitions.find(source => source.type === type)
      ?.label || type
  )
}

export function buildGithubActivitySeries(
  records: GithubActivityRecord[],
  days = githubActivityWindowDays
): GithubActivitySeriesDay[] {
  const normalizedDays = normalizeGithubActivityWindowDays(days)
  const end = getUtcStartOfToday()
  const start = addUtcDays(end, -(normalizedDays - 1))
  const dayMap = new Map<string, GithubActivitySeriesDay>()

  for (let offset = 0; offset < normalizedDays; offset++) {
    const date = addUtcDays(start, offset)
    const dateKey = toUtcDateKey(date)

    dayMap.set(dateKey, {
      date: dateKey,
      shortDate: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC'
      }),
      ...createEmptyGithubActivityCounts()
    })
  }

  records.forEach(record => {
    const activityDate = new Date(record.occurredAt)

    if (Number.isNaN(activityDate.getTime())) {
      return
    }

    const dateKey = toUtcDateKey(activityDate)
    const day = dayMap.get(dateKey)

    if (!day) {
      return
    }

    day[record.type] += 1
  })

  return Array.from(dayMap.values())
}
