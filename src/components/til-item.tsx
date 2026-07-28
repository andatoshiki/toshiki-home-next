import Link from 'next/link'
import type { TIL } from '#content'

import { slug } from '~/lib/slug'

import { Date as DateUI } from './date'
import {
  tilTitleHeadingTags,
  type TilTitleHeadingLevel
} from './til-heading-levels'
import { TilMdxContent } from './til-mdx-content'

interface TilItemProps {
  til: TIL
  titleHeadingLevel: TilTitleHeadingLevel
}

export function TilItem({ til, titleHeadingLevel }: TilItemProps) {
  const TitleHeading = tilTitleHeadingTags[titleHeadingLevel]

  return (
    <article className="relative flex min-w-0 flex-col gap-6 border-b border-b-neutral-200 py-12 first:pt-0 last:border-none dark:border-b-neutral-800 md:flex-row md:gap-3">
      <header className="top-24 h-fit flex-1 space-y-2 md:sticky md:space-y-5">
        <div className="space-y-3">
          <TitleHeading
            id={slug(til.title)}
            className="scroll-mt-24 text-balance text-2xl font-bold md:text-xl"
          >
            {til.title}
          </TitleHeading>
          <p>{til.description}</p>
          <span className="text-sm">
            <DateUI dateString={til.date} />
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {til.tags.map(tag => (
            <Link
              href={`/blog/tag/${slug(tag)}`}
              className="rounded-lg bg-neutral-400/10 p-1 text-sm leading-none transition-colors hover:bg-neutral-400/20"
              key={tag}
            >
              {tag}
            </Link>
          ))}
        </div>
      </header>
      <div className="post-content til-content relative min-w-0 md:w-2/3">
        <TilMdxContent
          code={til.content}
          titleHeadingLevel={titleHeadingLevel}
        />
      </div>
    </article>
  )
}
