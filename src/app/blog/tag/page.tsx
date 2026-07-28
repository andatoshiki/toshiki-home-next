import type { Metadata } from 'next'
import Link from 'next/link'
import { Tag } from '@phosphor-icons/react/dist/ssr'
import { slug } from '~/lib/slug'
import { getTagsAndNumberOfPosts } from '~/lib/tags'

export const metadata: Metadata = {
  title: 'Blog Tags',
  description: 'Post tags about all kind of things'
}

export default function Page() {
  const tags = [...getTagsAndNumberOfPosts()].sort(
    (a, b) => b.numberOfPosts - a.numberOfPosts
  )

  return (
    <div className="content-container z-0 m-auto">
      <h1 className="mb-5 text-center text-2xl font-bold md:text-left">Tags</h1>
      <ul className="flex flex-col gap-2 md:flex-row md:flex-wrap">
        {tags.map(tagData => (
          <li key={tagData.tag}>
            <Link
              href={`/blog/tag/${slug(tagData.tag)}`}
              className="flex items-center gap-4 rounded-md bg-neutral-300/10 p-4 font-bold leading-none text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 active:bg-blue-700/10 active:text-blue-700 dark:bg-neutral-800/10 dark:text-neutral-500 dark:focus-visible:ring-neutral-400 active:dark:bg-blue-500/10 active:dark:text-blue-500 md:inline-flex md:gap-0 md:rounded-lg md:border-2 md:border-solid md:border-neutral-700 md:bg-transparent md:px-4 md:py-1 md:hover:border-blue-700 md:hover:bg-blue-700/10 md:hover:text-blue-700 md:dark:border-neutral-500 md:dark:bg-transparent md:dark:hover:border-blue-500 md:dark:hover:bg-blue-500/10 md:dark:hover:text-blue-500"
            >
              <span className="inline-flex items-end gap-px">
                <Tag
                  aria-hidden="true"
                  className="-scale-x-100 text-xs md:hidden"
                  weight="duotone"
                  size={12}
                />
                <span>{tagData.tag}</span>
                {tagData.numberOfPosts > 1 ? (
                  <sup className="hidden md:inline">
                    {' '}
                    {tagData.numberOfPosts}{' '}
                  </sup>
                ) : null}
              </span>
              <span
                aria-hidden="true"
                className="h-px flex-1 border-b border-dotted border-neutral-700 dark:border-neutral-500 md:hidden"
              />
              <span className="md:hidden">{tagData.numberOfPosts}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
