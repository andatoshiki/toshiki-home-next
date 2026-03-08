import React from 'react'
import { type Metadata } from 'next'
import Link, { LinkProps } from 'next/link'
import { Icon as PhosphorIcon } from '@phosphor-icons/react'
import { FolderOpen, Tag, Notebook } from '@phosphor-icons/react/dist/ssr'

import { getSortedPosts } from '~/lib/get-sorted-posts'

import { PostList } from '~/components/leetcode-list'
import { Title } from '~/components/title'
import { leetcode } from '#content'

export const metadata: Metadata = {
  title: 'Leetcode',
  description: 'My leetcode solutions and problem-solving approaches.',
  keywords: [
    'leetcode',
    'algorithms',
    'data structures',
    'programming',
    'solutions',
    'coding'
  ]
}

type TopLinkProps = {
  Icon: PhosphorIcon
  title: string
} & LinkProps
const TopLink = ({ Icon, title, ...rest }: TopLinkProps) => (
  <Link
    {...rest}
    className="inline-flex items-center gap-1 rounded-lg p-2 leading-none text-neutral-700 transition-colors hover:bg-neutral-200/50 hover:text-neutral-900 dark:text-neutral-300 hover:dark:bg-neutral-900 dark:hover:text-neutral-100"
  >
    <Icon size="1em" />
    <span>{title}</span>
  </Link>
)

export default function Page() {
  const sortedPosts = getSortedPosts(leetcode)

  return (
    <div className="content-container m-auto">
      <Title text="Leetcode" />
      <div className="flex flex-wrap justify-center gap-4 py-4 md:justify-start">
        <TopLink
          Icon={FolderOpen}
          href="/leetcode/categories"
          title="Categories"
        />
        <TopLink Icon={Tag} href="/leetcode/tag" title="Tags" />
      </div>
      <PostList posts={sortedPosts} separateByYear />
    </div>
  )
}
