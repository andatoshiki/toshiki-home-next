import type { TIL } from '#content'

import { TilItem } from './til-item'
import type { TilTitleHeadingLevel } from './til-heading-levels'

interface TilListProps {
  tils: readonly TIL[]
  titleHeadingLevel?: TilTitleHeadingLevel
}

export function TilList({ tils, titleHeadingLevel = 2 }: TilListProps) {
  return (
    <div className="flex flex-col gap-3">
      {[...tils]
        .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)))
        .map(til => (
          <TilItem
            til={til}
            titleHeadingLevel={titleHeadingLevel}
            key={til.slug}
          />
        ))}
    </div>
  )
}
