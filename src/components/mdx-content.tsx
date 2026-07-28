import { ImageCard } from '~/app/about/_components/image-card'
import { MenuTooltip } from './ui/tooltip'
import { MdxRuntime, type MdxRuntimeProps } from './mdx-runtime'

export function MDXContent({ code, components }: MdxRuntimeProps) {
  return (
    <MdxRuntime
      code={code}
      components={{ MenuTooltip, ImageCard, ...components }}
    />
  )
}
