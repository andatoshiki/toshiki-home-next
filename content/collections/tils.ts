import { defineCollection, s } from 'velite'
import { slug } from '~/lib/slug'
import remarkValidateTilHeadings from '../plugin/remark-validate-til-headings'

export const tils = defineCollection({
  name: 'TIL',
  pattern: 'til/**/*.mdx',
  schema: s
    .object({
      title: s.string(),
      description: s.string(),
      tags: s.array(s.string()).transform(data => data.map(tag => tag.trim())),
      date: s.isodate(),
      content: s.mdx({ remarkPlugins: [remarkValidateTilHeadings] })
    })
    .transform(data => ({
      ...data,
      slug: slug(data.title)
    }))
})
