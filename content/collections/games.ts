import { defineCollection, s } from 'velite'

// Helper to handle null values from YAML
const nullableString = s
  .union([s.string(), s.null()])
  .transform(v => v ?? undefined)
const nullableNumber = s
  .union([s.number(), s.null()])
  .transform(v => v ?? undefined)

export const steamProfile = defineCollection({
  name: 'SteamProfile',
  pattern: 'games/profile.yml',
  single: true,
  schema: s.object({
    steamId: s.string(),
    personaName: s.string(),
    profileUrl: s.string(),
    avatar: s.string(),
    avatarMedium: s.string(),
    avatarFull: s.string(),
    level: s.number(),
    createdAt: nullableNumber.optional(),
    country: nullableString.optional(),
    realName: nullableString.optional(),
    totalGames: s.number(),
    totalPlaytimeHours: s.number(),
    gamesPlayed: s.number(),
    // Extended stats
    freeGames: s.number().default(0),
    paidGames: s.number().default(0),
    totalValueCents: s.number().default(0),
    playedValueCents: s.number().default(0),
    unplayedValueCents: s.number().default(0),
    pricePerHour: s.number().default(0),
    hoursInFreeGames: s.number().default(0),
    hoursInPaidGames: s.number().default(0),
    lastUpdated: s.number()
  })
})

export const gamesList = defineCollection({
  name: 'GameEntry',
  pattern: 'games/[0-9]*.yml',
  schema: s
    .object({
      // Game identification
      appid: s.number(),
      name: s.string(),

      // Playtime stats
      playtimeMinutes: s.number().default(0),
      playtimeHours: s.number().default(0),
      playtime2Weeks: nullableNumber.optional(),
      lastPlayed: nullableNumber.optional(),

      // Images
      iconUrl: s.string().default(''),
      headerImage: s.string(),
      capsuleImage: s.string(),

      // Game details (from Store API)
      developers: s.array(s.string()).default([]),
      publishers: s.array(s.string()).default([]),
      genres: s.array(s.string()).default([]),
      releaseDate: nullableString.optional(),
      shortDescription: nullableString.optional(),
      metacriticScore: nullableNumber.optional(),

      // Price info
      isFree: s.boolean().default(false),
      priceCents: nullableNumber.optional(),

      // Links
      storeUrl: s.string(),

      // Custom fields for manual additions
      customNote: nullableString.optional(),
      customTags: s.array(s.string()).optional().default([]),
      featured: s.boolean().optional().default(false),
      hidden: s.boolean().optional().default(false)
    })
    .transform(data => ({
      ...data,
      // Calculate additional fields
      hasPlaytime: data.playtimeMinutes > 0,
      playtimeFormatted: formatPlaytime(data.playtimeMinutes)
    }))
})

// Helper function to format playtime
function formatPlaytime(minutes: number): string {
  if (minutes === 0) return 'Never played'
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) return `${hours}h`
  return `${hours}h ${remainingMinutes}m`
}
