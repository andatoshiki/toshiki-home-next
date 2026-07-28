import type { Post } from '#content'
import { getSortedPosts } from '~/lib/get-sorted-posts'

import { categorizePostsByYear } from './categorize-posts-by-year'
import { PostLink } from './post-link'
import { PushPin } from '@phosphor-icons/react/dist/ssr'

interface Props {
  posts: readonly Post[]
  separateByYear?: boolean
}

interface YearSectionProps {
  label: number | 'Others'
  posts: readonly Post[]
  hideYear?: boolean
}

function YearSection({ label, posts, hideYear = false }: YearSectionProps) {
  if (posts.length === 0) return null

  const headingId = `posts-${String(label).toLowerCase()}`

  return (
    <section
      aria-labelledby={headingId}
      className="relative isolate overflow-hidden pb-2"
    >
      <h2
        id={headingId}
        className="pointer-events-none absolute left-0 top-6 z-0 select-none text-[8rem] font-black leading-none tracking-tight text-neutral-400/[0.22] dark:text-neutral-600/[0.22] md:top-4 md:text-[9rem]"
      >
        {label}
      </h2>
      <div className="relative z-10 flex flex-col gap-4 pt-24 md:gap-3">
        {getSortedPosts(posts).map(post => (
          <PostLink
            key={post.slug}
            post={post}
            hideYear={hideYear}
            headingLevel={3}
          />
        ))}
      </div>
    </section>
  )
}

export function PostList({ posts, separateByYear = false }: Props) {
  if (separateByYear) {
    const datedPosts = posts.filter(
      post =>
        !post.test && (post.status === 'published' || post.status === 'draft')
    )
    const pinnedPosts = datedPosts.filter(post => post.pinned)
    const postsByYear = categorizePostsByYear(
      datedPosts.filter(post => !post.pinned)
    )
    const otherPosts = posts.filter(
      post => post.status === 'planned' || post.test
    )

    return (
      <div className="flex flex-col gap-7">
        {pinnedPosts.length > 0 && (
          <section aria-labelledby="pinned-posts">
            <h2
              id="pinned-posts"
              className="mb-5 flex items-center justify-between rounded-xl bg-neutral-100 p-3 text-2xl dark:bg-neutral-950"
            >
              <span>Pinned</span>
              <PushPin aria-hidden="true" size="1em" />
            </h2>
            <div className="flex flex-col gap-3">
              {getSortedPosts(pinnedPosts).map(post => (
                <PostLink key={post.slug} post={post} headingLevel={3} />
              ))}
            </div>
          </section>
        )}

        {postsByYear.map(postsOfYear => (
          <YearSection
            key={postsOfYear.year}
            label={postsOfYear.year}
            posts={postsOfYear.posts}
            hideYear
          />
        ))}
        <YearSection label="Others" posts={otherPosts} />
      </div>
    )
  } else {
    return (
      <div className="flex flex-col gap-5">
        {getSortedPosts(posts).map(post => (
          <PostLink key={post.slug} post={post} />
        ))}
      </div>
    )
  }
}
