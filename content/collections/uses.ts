import { defineCollection, s } from 'velite'

// Helper to handle null values from YAML
const nullableString = s
  .union([s.string(), s.null()])
  .transform(v => v ?? undefined)

export type UsesType = 'software' | 'hardware' | 'peripherals' | 'browser'

export const usesList = defineCollection({
  name: 'UsesEntry',
  pattern: 'uses/*.yml',
  schema: s
    .object({
      // Entry identification
      id: s.string(),
      name: s.string(),
      type: s.enum(['software', 'hardware', 'peripherals', 'browser']),

      // Content
      description: s.string(),

      // Media
      image: s.string(), // External image URL

      // Metadata
      url: nullableString.optional(), // Link to product/website
      featured: s.boolean().optional().default(false),
      tags: s.array(s.string()).optional().default([])
    })
    .transform(data => ({
      ...data,
      slug: data.id.toLowerCase().replace(/\s+/g, '-')
    }))
})
