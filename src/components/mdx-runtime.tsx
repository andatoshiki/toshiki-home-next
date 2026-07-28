import * as runtime from 'react/jsx-runtime'
import type { ComponentProps } from 'react'
import type { MDXComponents } from 'mdx/types'

export interface MdxRuntimeProps {
  code: string
  components?: MDXComponents
}

function ResponsiveTable({ children, ...props }: ComponentProps<'table'>) {
  return (
    <div className="my-3 max-w-full overflow-x-auto overscroll-contain">
      <table {...props}>{children}</table>
    </div>
  )
}

function getMDXComponent(code: string) {
  const factory = new Function(code)
  return factory({ ...runtime }).default
}

export function MdxRuntime({ code, components }: MdxRuntimeProps) {
  const Component = getMDXComponent(code)

  return <Component components={{ table: ResponsiveTable, ...components }} />
}
