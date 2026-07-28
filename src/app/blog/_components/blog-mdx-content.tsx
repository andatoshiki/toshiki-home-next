import type { MdxRuntimeProps } from '~/components/mdx-runtime'
import { MdxRuntime } from '~/components/mdx-runtime'
import BlogImageLightbox, {
  BlogLightboxGallery
} from '../post/[slug]/_components/lightbox'

export function BlogMdxContent({ code, components }: MdxRuntimeProps) {
  return (
    <BlogLightboxGallery>
      <MdxRuntime
        code={code}
        components={{
          Image: BlogImageLightbox,
          img: BlogImageLightbox,
          ...components
        }}
      />
    </BlogLightboxGallery>
  )
}
