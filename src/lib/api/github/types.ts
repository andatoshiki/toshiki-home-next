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
  description?: string | null
  homepage?: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  license?: {
    spdx_id?: string | null
  } | null
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
