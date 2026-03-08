#!/usr/bin/env npx ts-node

/**
 * Script to download Steam games library and profile data and convert to YAML files
 * Usage: npx tsx tools/sync-steam.ts [--key <api_key>] [--steamid <steam_id>] [--username <vanity_url>] [--details]
 *
 * Flags:
 * - --key <api_key>: Your Steam Web API key (or set STEAM_API_KEY env var)
 * - --steamid <steam_id>: Your Steam 64-bit ID (or set STEAM_USER_ID env var)
 * - --username <vanity_url>: Your Steam vanity URL name (or set STEAM_VANITY_URL env var)
 * - --details: Fetch detailed game info from Steam Store API (slower, rate-limited)
 *
 * Examples:
 *   npx tsx tools/sync-steam.ts --key ABC123 --steamid 76561198012345678
 *   npx tsx tools/sync-steam.ts --key ABC123 --username andatoshiki
 *   npx tsx tools/sync-steam.ts --key ABC123 --steamid 76561198012345678 --details
 *
 * Get your API key from: https://steamcommunity.com/dev/apikey
 */

import * as fs from 'fs'
import * as path from 'path'

const STEAM_API_BASE = 'https://api.steampowered.com'
const STORE_API_BASE = 'https://store.steampowered.com/api'

interface SteamGame {
  appid: number
  name: string
  playtime_forever: number // minutes
  playtime_2weeks?: number // minutes
  img_icon_url: string
  has_community_visible_stats: boolean
  playtime_windows_forever?: number
  playtime_mac_forever?: number
  playtime_linux_forever?: number
  rtime_last_played?: number // unix timestamp
}

interface SteamPlayer {
  steamid: string
  personaname: string
  profileurl: string
  avatar: string
  avatarmedium: string
  avatarfull: string
  avatarhash: string
  personastate: number
  communityvisibilitystate: number
  profilestate: number
  lastlogoff: number
  commentpermission: number
  realname?: string
  primaryclanid?: string
  timecreated?: number
  gameid?: string
  gameserverip?: string
  gameextrainfo?: string
  loccountrycode?: string
  locstatecode?: string
  loccityid?: number
}

interface SteamLevel {
  player_level: number
}

interface GameDetails {
  name: string
  steam_appid: number
  type: string
  required_age: number
  is_free: boolean
  detailed_description: string
  about_the_game: string
  short_description: string
  header_image: string
  capsule_image: string
  capsule_imagev5: string
  website: string | null
  developers?: string[]
  publishers?: string[]
  genres?: Array<{ id: string; description: string }>
  categories?: Array<{ id: number; description: string }>
  release_date?: { coming_soon: boolean; date: string }
  metacritic?: { score: number; url: string }
  background?: string
  background_raw?: string
  price_overview?: {
    currency: string
    initial: number
    final: number
    discount_percent: number
    initial_formatted: string
    final_formatted: string
  }
}

interface ProcessedGame {
  appid: number
  name: string
  playtimeMinutes: number
  playtimeHours: number
  playtime2Weeks: number | null
  lastPlayed: number | null
  iconUrl: string
  headerImage: string
  capsuleImage: string
  developers: string[]
  publishers: string[]
  genres: string[]
  releaseDate: string | null
  shortDescription: string | null
  metacriticScore: number | null
  storeUrl: string
  isFree: boolean
  priceCents: number | null // price in cents
}

interface SteamProfile {
  steamId: string
  personaName: string
  profileUrl: string
  avatar: string
  avatarMedium: string
  avatarFull: string
  level: number
  createdAt: number | null
  country: string | null
  realName: string | null
  totalGames: number
  totalPlaytimeHours: number
  gamesPlayed: number
  // Extended stats
  freeGames: number
  paidGames: number
  totalValueCents: number // estimated total value in cents
  playedValueCents: number // value of played games
  unplayedValueCents: number // value of unplayed games
  pricePerHour: number // cents per hour
  hoursInFreeGames: number
  hoursInPaidGames: number
  lastUpdated: number
}

async function getSteamIdFromVanityUrl(
  apiKey: string,
  vanityUrl: string
): Promise<string | null> {
  const url = `${STEAM_API_BASE}/ISteamUser/ResolveVanityURL/v1/?key=${apiKey}&vanityurl=${vanityUrl}`
  const response = await fetch(url)
  const data = await response.json()

  if (data.response.success === 1) {
    return data.response.steamid
  }
  return null
}

async function getPlayerSummary(
  apiKey: string,
  steamId: string
): Promise<SteamPlayer | null> {
  const url = `${STEAM_API_BASE}/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamId}`
  const response = await fetch(url)
  const data = await response.json()

  if (data.response.players && data.response.players.length > 0) {
    return data.response.players[0]
  }
  return null
}

async function getSteamLevel(apiKey: string, steamId: string): Promise<number> {
  const url = `${STEAM_API_BASE}/IPlayerService/GetSteamLevel/v1/?key=${apiKey}&steamid=${steamId}`
  const response = await fetch(url)
  const data = await response.json()
  return data.response?.player_level || 0
}

async function getOwnedGames(
  apiKey: string,
  steamId: string
): Promise<SteamGame[]> {
  const url = `${STEAM_API_BASE}/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1`
  const response = await fetch(url)
  const data = await response.json()

  return data.response?.games || []
}

async function getGameDetails(appId: number): Promise<GameDetails | null> {
  try {
    const url = `${STORE_API_BASE}/appdetails?appids=${appId}`
    const response = await fetch(url)
    const data = await response.json()

    if (data[appId]?.success) {
      return data[appId].data
    }
  } catch (error) {
    // Store API can be rate-limited or fail for some apps
    console.warn(`⚠️  Could not fetch details for app ${appId}`)
  }
  return null
}

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50)
}

// Simple YAML serializer
function toYaml(obj: Record<string, unknown>, indent = 0): string {
  const spaces = '  '.repeat(indent)
  let yaml = ''

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      yaml += `${spaces}${key}: null\n`
    } else if (typeof value === 'string') {
      // Always quote strings to handle numeric-looking strings (like steamId) and special chars
      const escaped = value
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
      yaml += `${spaces}${key}: "${escaped}"\n`
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      yaml += `${spaces}${key}: ${value}\n`
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        yaml += `${spaces}${key}: []\n`
      } else if (typeof value[0] === 'object') {
        yaml += `${spaces}${key}:\n`
        for (const item of value) {
          yaml += `${spaces}  -\n`
          yaml += toYaml(item as Record<string, unknown>, indent + 2)
        }
      } else {
        yaml += `${spaces}${key}:\n`
        for (const item of value) {
          if (typeof item === 'string') {
            const escaped = item.replace(/"/g, '\\"')
            yaml += `${spaces}  - "${escaped}"\n`
          } else {
            yaml += `${spaces}  - ${item}\n`
          }
        }
      }
    } else if (typeof value === 'object') {
      yaml += `${spaces}${key}:\n`
      yaml += toYaml(value as Record<string, unknown>, indent + 1)
    }
  }

  return yaml
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function processGames(
  apiKey: string,
  games: SteamGame[],
  fetchDetails: boolean = false
): Promise<ProcessedGame[]> {
  const processedGames: ProcessedGame[] = []

  for (let i = 0; i < games.length; i++) {
    const game = games[i]

    // Build icon URL
    const iconUrl = game.img_icon_url
      ? `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`
      : ''

    // Default images from Steam CDN
    const headerImage = `https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg`
    const capsuleImage = `https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/capsule_231x87.jpg`

    let details: GameDetails | null = null
    if (fetchDetails) {
      console.log(
        `📦 Fetching details for ${game.name} (${i + 1}/${games.length})...`
      )
      details = await getGameDetails(game.appid)
      // Rate limit: Steam Store API is strict
      await sleep(1500)
    }

    const processed: ProcessedGame = {
      appid: game.appid,
      name: game.name,
      playtimeMinutes: game.playtime_forever,
      playtimeHours: Math.round((game.playtime_forever / 60) * 10) / 10,
      playtime2Weeks: game.playtime_2weeks ?? null,
      lastPlayed: game.rtime_last_played ?? null,
      iconUrl,
      headerImage,
      capsuleImage,
      developers: details?.developers || [],
      publishers: details?.publishers || [],
      genres: details?.genres?.map(g => g.description) || [],
      releaseDate: details?.release_date?.date || null,
      shortDescription: details?.short_description || null,
      metacriticScore: details?.metacritic?.score || null,
      storeUrl: `https://store.steampowered.com/app/${game.appid}`,
      isFree: details?.is_free ?? false,
      priceCents: details?.price_overview?.final ?? null
    }

    processedGames.push(processed)
  }

  return processedGames
}

async function saveGameToYaml(
  game: ProcessedGame,
  outputDir: string
): Promise<void> {
  const filename = `${game.appid}-${sanitizeFilename(game.name)}.yml`
  const filepath = path.join(outputDir, filename)

  const yamlContent = toYaml({
    appid: game.appid,
    name: game.name,
    playtimeMinutes: game.playtimeMinutes,
    playtimeHours: game.playtimeHours,
    playtime2Weeks: game.playtime2Weeks,
    lastPlayed: game.lastPlayed,
    iconUrl: game.iconUrl,
    headerImage: game.headerImage,
    capsuleImage: game.capsuleImage,
    developers: game.developers,
    publishers: game.publishers,
    genres: game.genres,
    releaseDate: game.releaseDate,
    shortDescription: game.shortDescription,
    metacriticScore: game.metacriticScore,
    storeUrl: game.storeUrl,
    isFree: game.isFree,
    priceCents: game.priceCents
  })

  fs.writeFileSync(filepath, yamlContent)
}

async function saveProfileToYaml(
  profile: SteamProfile,
  outputDir: string
): Promise<void> {
  const filepath = path.join(outputDir, 'profile.yml')

  const yamlContent = toYaml({
    steamId: profile.steamId,
    personaName: profile.personaName,
    profileUrl: profile.profileUrl,
    avatar: profile.avatar,
    avatarMedium: profile.avatarMedium,
    avatarFull: profile.avatarFull,
    level: profile.level,
    createdAt: profile.createdAt,
    country: profile.country,
    realName: profile.realName,
    totalGames: profile.totalGames,
    totalPlaytimeHours: profile.totalPlaytimeHours,
    gamesPlayed: profile.gamesPlayed,
    freeGames: profile.freeGames,
    paidGames: profile.paidGames,
    totalValueCents: profile.totalValueCents,
    playedValueCents: profile.playedValueCents,
    unplayedValueCents: profile.unplayedValueCents,
    pricePerHour: profile.pricePerHour,
    hoursInFreeGames: profile.hoursInFreeGames,
    hoursInPaidGames: profile.hoursInPaidGames,
    lastUpdated: profile.lastUpdated
  })

  fs.writeFileSync(filepath, yamlContent)
}

async function main() {
  const args = process.argv.slice(2)

  // Parse arguments
  let vanityUrl = process.env.STEAM_VANITY_URL || ''
  let steamId = process.env.STEAM_USER_ID || ''
  let apiKey = process.env.STEAM_API_KEY || ''
  let fetchDetails = false

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--key' && args[i + 1]) {
      apiKey = args[i + 1]
      i++
    } else if (args[i] === '--username' && args[i + 1]) {
      vanityUrl = args[i + 1]
      i++
    } else if (args[i] === '--steamid' && args[i + 1]) {
      steamId = args[i + 1]
      i++
    } else if (args[i] === '--details') {
      fetchDetails = true
    }
  }

  if (!apiKey) {
    console.error('❌ STEAM_API_KEY environment variable is required')
    console.error(
      '   Get your API key from: https://steamcommunity.com/dev/apikey'
    )
    process.exit(1)
  }

  // Resolve Steam ID if only vanity URL is provided
  if (!steamId && vanityUrl) {
    console.log(`🔍 Resolving Steam ID for vanity URL: ${vanityUrl}...`)
    const resolved = await getSteamIdFromVanityUrl(apiKey, vanityUrl)
    if (resolved) {
      steamId = resolved
      console.log(`✅ Found Steam ID: ${steamId}`)
    } else {
      console.error(`❌ Could not resolve vanity URL: ${vanityUrl}`)
      process.exit(1)
    }
  }

  if (!steamId) {
    console.error(
      '❌ Steam ID is required. Provide via --steamid or --username flag, or set STEAM_USER_ID env var'
    )
    process.exit(1)
  }

  // Setup output directory
  const outputDir = path.join(process.cwd(), 'content', 'games')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Fetch player summary
  console.log(`\n👤 Fetching player profile...`)
  const player = await getPlayerSummary(apiKey, steamId)
  if (!player) {
    console.error('❌ Could not fetch player profile. Is the profile public?')
    process.exit(1)
  }

  // Fetch Steam level
  console.log(`📊 Fetching Steam level...`)
  const level = await getSteamLevel(apiKey, steamId)

  // Fetch owned games
  console.log(`🎮 Fetching owned games...`)
  const games = await getOwnedGames(apiKey, steamId)

  if (games.length === 0) {
    console.error('❌ No games found. Is the games library public?')
    process.exit(1)
  }

  console.log(`📦 Found ${games.length} games`)

  // Sort games by playtime (most played first)
  games.sort((a, b) => b.playtime_forever - a.playtime_forever)

  // Process games
  console.log(
    `\n🔄 Processing games${fetchDetails ? ' (fetching details - this will take a while)' : ''}...`
  )
  const processedGames = await processGames(apiKey, games, fetchDetails)

  // Calculate profile stats
  const totalPlaytimeMinutes = games.reduce(
    (sum, g) => sum + g.playtime_forever,
    0
  )
  const gamesPlayed = games.filter(g => g.playtime_forever > 0).length
  const totalPlaytimeHours = Math.round((totalPlaytimeMinutes / 60) * 10) / 10

  // Calculate extended stats from processed games
  const freeGames = processedGames.filter(g => g.isFree).length
  const paidGames = processedGames.length - freeGames

  // Calculate value stats (only when details are fetched)
  let totalValueCents = 0
  let playedValueCents = 0
  let unplayedValueCents = 0
  let hoursInFreeGames = 0
  let hoursInPaidGames = 0

  for (const game of processedGames) {
    const price = game.priceCents || 0
    totalValueCents += price

    if (game.playtimeMinutes > 0) {
      playedValueCents += price
    } else {
      unplayedValueCents += price
    }

    if (game.isFree) {
      hoursInFreeGames += game.playtimeHours
    } else {
      hoursInPaidGames += game.playtimeHours
    }
  }

  // Round hours
  hoursInFreeGames = Math.round(hoursInFreeGames * 10) / 10
  hoursInPaidGames = Math.round(hoursInPaidGames * 10) / 10

  // Calculate price per hour (cents per hour played)
  const pricePerHour =
    totalPlaytimeHours > 0
      ? Math.round(totalValueCents / totalPlaytimeHours)
      : 0

  const profile: SteamProfile = {
    steamId: player.steamid,
    personaName: player.personaname,
    profileUrl: player.profileurl,
    avatar: player.avatar,
    avatarMedium: player.avatarmedium,
    avatarFull: player.avatarfull,
    level,
    createdAt: player.timecreated ?? null,
    country: player.loccountrycode ?? null,
    realName: player.realname ?? null,
    totalGames: games.length,
    totalPlaytimeHours,
    gamesPlayed,
    freeGames,
    paidGames,
    totalValueCents,
    playedValueCents,
    unplayedValueCents,
    pricePerHour,
    hoursInFreeGames,
    hoursInPaidGames,
    lastUpdated: Math.floor(Date.now() / 1000)
  }

  // Clear existing files
  console.log(`\n🗑️  Clearing existing game files...`)
  const existingFiles = fs
    .readdirSync(outputDir)
    .filter(f => f.endsWith('.yml'))
  for (const file of existingFiles) {
    fs.unlinkSync(path.join(outputDir, file))
  }

  // Save profile
  console.log(`💾 Saving profile...`)
  await saveProfileToYaml(profile, outputDir)

  // Save games
  console.log(`💾 Saving ${processedGames.length} games to YAML...`)
  for (const game of processedGames) {
    await saveGameToYaml(game, outputDir)
  }

  console.log(`\n✅ Steam sync complete!`)
  console.log(`   Profile: ${profile.personaName} (Level ${profile.level})`)
  console.log(
    `   Games: ${profile.totalGames} owned, ${profile.gamesPlayed} played`
  )
  console.log(`   Free: ${freeGames}, Paid: ${paidGames}`)
  console.log(`   Playtime: ${profile.totalPlaytimeHours} hours total`)
  console.log(`   Est. Value: $${(totalValueCents / 100).toFixed(2)}`)
  console.log(`   Output: ${outputDir}`)
  console.log(`\n📝 Run 'npx velite' to regenerate static content`)
}

main().catch(error => {
  console.error('❌ Error:', error.message)
  process.exit(1)
})
