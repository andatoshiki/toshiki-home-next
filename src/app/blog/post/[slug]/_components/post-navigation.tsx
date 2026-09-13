import Link from 'next/link'
import { ArrowUDownLeft } from '@phosphor-icons/react/dist/ssr'
import type { TocEntry } from '../_lib/toc'
import { Toc } from './toc'
import { TopButton } from './top-button'

export function PostNavigation({ toc }: { toc: TocEntry[] }) {
  if (toc.length === 0) return null

  return (
    <>
      <aside className="absolute right-full top-0 z-10 mr-[calc((100vw-78rem)/4)] hidden h-full w-52 min-[1320px]:block">
        <Link
          href="/blog"
          data-toc-index
          className="fixed z-20 ml-2 flex w-fit items-center gap-1 rounded-sm py-1 font-semibold leading-none text-neutral-500 transition-colors hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 motion-reduce:transition-none dark:text-neutral-500 dark:hover:text-neutral-300 dark:focus-visible:ring-neutral-400"
        >
          <ArrowUDownLeft aria-hidden="true" size={16} />
          <span>Posts</span>
        </Link>
        <div className="fixed left-[calc((100%-78rem)/4)] top-1/2 w-52 -translate-y-1/2">
          <Toc toc={toc} />
        </div>
      </aside>
      <TopButton />
    </>
  )
}
