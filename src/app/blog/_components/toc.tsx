import type { ComponentProps } from 'react'
import type { Post } from '#content'
import Link from 'next/link'
import { ArrowUDownLeft } from '@phosphor-icons/react/dist/ssr'

export type TocEntry = Post['toc'][number]

interface TocItemProps extends ComponentProps<'li'> {
  toc: TocEntry
  activeUrl?: string
  depth?: number
}

function TocItem({ toc, activeUrl, depth = 0, ...rest }: TocItemProps) {
  const isActive = activeUrl === toc.url

  return (
    <li {...rest}>
      <a
        href={toc.url}
        aria-current={isActive ? 'location' : undefined}
        className={`block rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 dark:focus-visible:ring-neutral-400 ${
          isActive
            ? 'text-neutral-800 dark:text-neutral-200'
            : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300'
        }`}
      >
        {toc.title}
      </a>
      {toc.items.length > 0 ? (
        <ol
          className={`space-y-2 ${depth === 0 ? 'mt-2 border-l border-neutral-200 pl-3 dark:border-neutral-800' : 'mt-2 pl-3'}`}
        >
          {toc.items.map(childToc => (
            <TocItem
              toc={childToc}
              key={childToc.url}
              activeUrl={activeUrl}
              depth={depth + 1}
              className="space-y-2"
            />
          ))}
        </ol>
      ) : null}
    </li>
  )
}

interface TocProps {
  toc: TocEntry[]
  activeUrl?: string
}

export function Toc({ toc, activeUrl }: TocProps) {
  if (toc.length === 0) return null

  return (
    <nav
      aria-label="Table of contents"
      className="toc text-[0.85rem] leading-snug text-neutral-600 dark:text-neutral-400"
    >
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 rounded-sm px-2 py-1 font-semibold leading-none text-neutral-500 transition-colors hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 dark:text-neutral-500 dark:hover:text-neutral-300 dark:focus-visible:ring-neutral-400"
      >
        <ArrowUDownLeft aria-hidden="true" size={16} />
        <span>index</span>
      </Link>
      <ol className="space-y-2 px-2 py-3">
        {toc.map(tocItem => (
          <TocItem
            toc={tocItem}
            key={tocItem.url}
            activeUrl={activeUrl}
            className="space-y-2"
          />
        ))}
      </ol>
    </nav>
  )
}
