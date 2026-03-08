import { ComponentProps } from 'react'

interface RubyProps extends ComponentProps<'ruby'> {
  base: string
  text: string
  parenthesis?: string
}

export function Ruby({ base, text, parenthesis = '()', ...rest }: RubyProps) {
  const leftParen = parenthesis[0] || '('
  const rightParen = parenthesis[parenthesis.length - 1] || ')'

  return (
    <ruby {...rest}>
      {base}
      <rp>{leftParen}</rp>
      <rt>{text}</rt>
      <rp>{rightParen}</rp>
    </ruby>
  )
}
