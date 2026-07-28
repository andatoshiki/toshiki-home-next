import { createElement, type ComponentProps } from 'react'
import type { MDXComponents } from 'mdx/types'

import { BlogMdxContent } from '~/app/blog/_components/blog-mdx-content'
import {
  getTilContentHeadingLevel,
  type CompiledTilHeadingLevel,
  type TilContentHeadingLevel,
  type TilTitleHeadingLevel
} from './til-heading-levels'

interface TilMdxContentProps {
  code: string
  titleHeadingLevel: TilTitleHeadingLevel
}

const compiledHeadingLevels: readonly CompiledTilHeadingLevel[] = [
  2, 3, 4, 5, 6
]

function createHeadingComponent(level: TilContentHeadingLevel) {
  const tagName = `h${level}`

  function TilMdxHeading(props: ComponentProps<'h2'>) {
    return createElement(tagName, props)
  }

  TilMdxHeading.displayName = `TilMdxH${level}`
  return TilMdxHeading
}

function createHeadingComponents(
  titleHeadingLevel: TilTitleHeadingLevel
): MDXComponents {
  return Object.fromEntries(
    compiledHeadingLevels.map(compiledLevel => [
      `h${compiledLevel}`,
      createHeadingComponent(
        getTilContentHeadingLevel(compiledLevel, titleHeadingLevel)
      )
    ])
  ) as MDXComponents
}

const headingComponents: Record<TilTitleHeadingLevel, MDXComponents> = {
  2: createHeadingComponents(2),
  3: createHeadingComponents(3)
}

export function TilMdxContent({ code, titleHeadingLevel }: TilMdxContentProps) {
  return (
    <BlogMdxContent
      code={code}
      components={headingComponents[titleHeadingLevel]}
    />
  )
}
