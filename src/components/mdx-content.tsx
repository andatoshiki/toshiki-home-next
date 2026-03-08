import * as runtime from 'react/jsx-runtime'
import { MenuTooltip } from './ui/tooltip'
import { ImageCard } from '~/app/about/_components/image-card'
import BlogImageLightbox from '~/app/blog/post/[slug]/_components/lightbox'

interface MdxProps {
  code: string
  components?: Record<string, React.ComponentType>
}

const useMDXComponent = (code: string) => {
  const fn = new Function(code)
  return fn({ ...runtime }).default
}

export function MDXContent({ code, components }: MdxProps) {
  const Component = useMDXComponent(code)
  return (
    <Component
      components={{
        Image: BlogImageLightbox,
        img: BlogImageLightbox,
        MenuTooltip,
        ImageCard,
        ...components
      }}
    />
  )
}
