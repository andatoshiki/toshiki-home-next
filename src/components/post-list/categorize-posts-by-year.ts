import type { Post } from '#content'

export function categorizePostsByYear(posts: readonly Post[]) {
  const postsByYear = new Map<number, Post[]>()

  for (const post of posts) {
    const year = new Date(post.date).getFullYear()
    const postsForYear = postsByYear.get(year)

    if (postsForYear) postsForYear.push(post)
    else postsByYear.set(year, [post])
  }

  return [...postsByYear]
    .map(([year, postsForYear]) => ({ year, posts: postsForYear }))
    .sort((a, b) => b.year - a.year)
}
