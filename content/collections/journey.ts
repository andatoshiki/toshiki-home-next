import { defineCollection, s } from 'velite'

// Helper to handle null values from YAML
const nullableString = s
  .union([s.string(), s.null()])
  .transform(v => v ?? undefined)

export type JourneyStatus = 'visited' | 'residence' | 'airport' | 'wishlist'

export const journeyLocations = defineCollection({
  name: 'JourneyLocation',
  pattern: 'journey/*.yml',
  schema: s
    .object({
      // Location identification
      id: s.string(), // Unique identifier (e.g., "tokyo-japan", "paris-france")
      name: s.string(), // Display name (e.g., "Tokyo", "Paris")

      // Geographic coordinates
      coordinates: s.object({
        longitude: s.number(),
        latitude: s.number()
      }),

      // Location details
      country: s.string(),
      region: nullableString.optional(), // State/Province/Prefecture
      city: nullableString.optional(),

      // Status of the location
      status: s.enum(['visited', 'residence', 'airport', 'wishlist']),

      // Visit details (optional)
      visitDate: nullableString.optional(), // Format: "YYYY.MM" or "YYYY.MM.DD"
      description: nullableString.optional(),

      // Custom fields
      tags: s.array(s.string()).optional().default([]),
      featured: s.boolean().optional().default(false)
    })
    .transform(data => ({
      ...data,
      // Generate a slug from the id
      slug: data.id.toLowerCase().replace(/\s+/g, '-')
    }))
})
