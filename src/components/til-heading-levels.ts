export const tilTitleHeadingTags = {
  2: 'h2',
  3: 'h3'
} as const

export type TilTitleHeadingLevel = keyof typeof tilTitleHeadingTags
export type CompiledTilHeadingLevel = 2 | 3 | 4 | 5 | 6
export type TilContentHeadingLevel = 3 | 4 | 5 | 6

export function getTilContentHeadingLevel(
  compiledLevel: CompiledTilHeadingLevel,
  titleLevel: TilTitleHeadingLevel
): TilContentHeadingLevel {
  return Math.min(6, compiledLevel + titleLevel - 1) as TilContentHeadingLevel
}
