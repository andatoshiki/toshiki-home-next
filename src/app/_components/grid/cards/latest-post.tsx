'use client'
import Link from 'next/link'
import { posts } from '#content'

import { Date } from '~/components/date'
import { getSortedPosts } from '~/lib/get-sorted-posts'

export function LatestPost() {
  const latestPost = getSortedPosts(posts)[0]

  const Divider = () => (
    <span className="h-px w-full rounded-full bg-neutral-1000 opacity-20 dark:bg-neutral-300/50" />
  )

  return (
    <Link
      href={`/blog/post/${latestPost.slug}`}
      className="relative flex h-36 w-full flex-1 transform-gpu flex-col overflow-hidden rounded-xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-neutral-100 px-5 py-5 transition-all duration-500 hover:scale-[.97] dark:border-neutral-900 dark:from-neutral-1000 dark:to-neutral-950"
    >
      <div className="absolute left-0 right-0 top-1/2 -z-10 flex -translate-y-1/2 justify-around opacity-30 blur-3xl dark:opacity-20">
        <div className="size-36 animate-background-fade rounded-xl" />
        <div className="size-36 animate-background-fade rounded-xl animate-delay-200" />
      </div>

      <div className="flex h-full min-h-0 flex-col justify-between">
        <div className="space-y-2.5">
          <span className="text-sm font-medium">Latest Post</span>
          <Divider />
          <span className="line-clamp-2 block text-[15px] font-semibold leading-snug">
            {latestPost.title}
          </span>
        </div>

        <div className="space-y-2.5">
          <Divider />
          <span className="block text-[13px] opacity-70">
            <Date dateString={latestPost.date} />
          </span>
        </div>
      </div>
    </Link>
  )
}
