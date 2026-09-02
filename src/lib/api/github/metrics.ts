import { eachDayOfInterval, startOfDay, subDays } from 'date-fns'
import type {
  GithubContributionActivityDay,
  GithubContributionCalendarDay,
  GithubPublicMetrics,
  GithubPublicSnapshot,
  GithubRepository
} from './types'

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
  days = githubContributionWindowDays,
  now = new Date()
): GithubContributionActivityDay[] {
  const end = startOfDay(now)
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
  snapshot: GithubPublicSnapshot,
  now = new Date()
): GithubPublicMetrics {
  const contributionSeries = getGithubContributionSeries(
    snapshot.contributions,
    githubContributionWindowDays,
    now
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
