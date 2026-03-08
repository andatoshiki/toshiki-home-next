import { defineCollection, s } from 'velite'

export const donation = defineCollection({
  name: 'Donation',
  pattern: 'donation.mdx',
  schema: s.object({
    content: s.mdx()
  }),
  single: true
})
