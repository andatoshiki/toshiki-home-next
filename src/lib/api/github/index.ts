import { eachDayOfInterval, startOfDay, subDays } from 'date-fns'

export interface GithubUserData {
  login: string
  followers: number
  public_repos: number
  name?: string
  avatar_url?: string
}

export interface GithubFollower {
  login: string
  avatar_url: string
  html_url: string
}

export interface GithubRepository {
  name: string
  full_name: string
  html_url: string
  language: string | null
  stargazers_count: number
  fork: boolean
  created_at: string
  updated_at: string
}

export interface GithubContributionCalendarDay {
  date: string
  count: number
  level: number
}

export interface GithubPublicSnapshot {
  user: GithubUserData
  followers: GithubFollower[]
  repositories: GithubRepository[]
  contributions: GithubContributionCalendarDay[]
  totalContributionsLastYear: number
}

export interface GithubContributionActivityDay {
  date: string
  shortDate: string
  contributionCount: number
}

export interface GithubPublicMetrics {
  username: string
  followersCount: number
  repositoryCount: number
  stars: number
  languages: number
  contributionCount: number
  contributionSeries: GithubContributionActivityDay[]
  totalContributionsLastYear: number
}

export const githubContributionWindowDays = 30

function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getGithubStarsTotal(repositories: GithubRepository[]) {
  return repositories.reduce(
    (total, repository) => total + repository.stargazers_count,
    0
  )
}

function getGithubLanguageCount(repositories: GithubRepository[]) {
  const languages = repositories
    .map(repository => repository.language)
    .filter((language): language is string => Boolean(language))

  return new Set(languages).size
}

export function getGithubContributionSeries(
  contributions: GithubContributionCalendarDay[],
  days = githubContributionWindowDays
): GithubContributionActivityDay[] {
  const end = startOfDay(new Date())
  const start = subDays(end, Math.max(days - 1, 0))
  const counts = new Map<string, number>()

  contributions.forEach(day => {
    const contributionDate = startOfDay(new Date(`${day.date}T12:00:00`))

    if (contributionDate < start || contributionDate > end) {
      return
    }

    const dateKey = toDateKey(contributionDate)
    counts.set(dateKey, Math.max(0, day.count ?? 0))
  })

  return eachDayOfInterval({ start, end }).map(date => {
    const dateKey = toDateKey(date)

    return {
      date: dateKey,
      shortDate: date.toLocaleDateString(
        'en-US',
        days <= 7
          ? {
              weekday: 'short'
            }
          : {
              month: 'short',
              day: 'numeric'
            }
      ),
      contributionCount: counts.get(dateKey) ?? 0
    }
  })
}

export function getGithubContributionSeriesTotal(
  series: GithubContributionActivityDay[]
) {
  return series.reduce((total, day) => total + day.contributionCount, 0)
}

export function getGithubPublicMetrics(
  snapshot: GithubPublicSnapshot
): GithubPublicMetrics {
  const contributionSeries = getGithubContributionSeries(
    snapshot.contributions,
    githubContributionWindowDays
  )

  return {
    username: snapshot.user.login,
    followersCount: snapshot.user.followers,
    repositoryCount: snapshot.repositories.length,
    stars: getGithubStarsTotal(snapshot.repositories),
    languages: getGithubLanguageCount(snapshot.repositories),
    contributionCount: getGithubContributionSeriesTotal(contributionSeries),
    contributionSeries,
    totalContributionsLastYear: snapshot.totalContributionsLastYear
  }
}
