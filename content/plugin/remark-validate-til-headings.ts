import type { Heading, Root } from 'mdast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

interface HeadingIssue {
  index: number
  message: string
}

export function findTilHeadingIssue(
  depths: readonly number[]
): HeadingIssue | null {
  if (depths.length === 0) return null

  if (depths[0] !== 1) {
    return {
      index: 0,
      message: 'TIL content headings must begin at level 1'
    }
  }

  for (let index = 1; index < depths.length; index += 1) {
    const previousDepth = depths[index - 1]
    const currentDepth = depths[index]

    if (currentDepth > previousDepth + 1) {
      return {
        index,
        message: `TIL content headings cannot skip from level ${previousDepth} to level ${currentDepth}`
      }
    }
  }

  return null
}

const remarkValidateTilHeadings: Plugin<[], Root> = () => (tree, file) => {
  const headings: Heading[] = []

  visit(tree, 'heading', node => {
    headings.push(node)
  })

  const issue = findTilHeadingIssue(headings.map(heading => heading.depth))

  if (issue) {
    file.fail(issue.message, headings[issue.index].position?.start)
  }
}

export default remarkValidateTilHeadings
