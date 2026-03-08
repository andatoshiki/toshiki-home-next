#!/usr/bin/env npx ts-node

/**
 * Script to download anime/manga list from AniList API and convert to YAML files
 * Usage: npx tsx tools/sync-anilist.ts [--anime] [--manga] [--all] [--username <name>]
 */

import * as fs from 'fs'
import * as path from 'path'

const ANILIST_ENDPOINT = 'https://graphql.anilist.co'

const MEDIA_LIST_QUERY = `
  query ($userName: String!, $type: MediaType!) {
    MediaListCollection(userName: $userName, type: $type) {
      lists {
        name
        entries {
          id
          status
          score(format: POINT_10_DECIMAL)
          progress
          updatedAt
          createdAt
          media {
            id
            title {
              romaji
              english
              native
              userPreferred
            }
            description(asHtml: false)
            coverImage {
              extraLarge
              large
              medium
              color
            }
            episodes
            chapters
            volumes
            format
            status
            siteUrl
          }
        }
      }
    }
  }
`

interface MediaTitle {
  romaji: string
  english: string | null
  native: string
  userPreferred: string
}

interface MediaCoverImage {
  extraLarge: string
  large: string
  medium: string
  color: string | null
}

interface Media {
  id: number
  title: MediaTitle
  description: string | null
  coverImage: MediaCoverImage
  episodes: number | null
  chapters: number | null
  volumes: number | null
  format: string
  status: string
  siteUrl: string
}

interface MediaListEntry {
  id: number
  status: string
  score: number
  progress: number
  updatedAt: number
  createdAt: number
  media: Media
}

interface MediaListGroup {
  name: string
  entries: MediaListEntry[]
}

interface AniListResponse {
  data: {
    MediaListCollection: {
      lists: MediaListGroup[]
    }
  }
}

async function fetchMediaList(
  username: string,
  type: 'ANIME' | 'MANGA'
): Promise<MediaListEntry[]> {
  console.log(`📡 Fetching ${type.toLowerCase()} list for user: ${username}...`)

  const response = await fetch(ANILIST_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      query: MEDIA_LIST_QUERY,
      variables: {
        userName: username,
        type: type
      }
    })
  })

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${type.toLowerCase()} list: ${response.statusText}`
    )
  }

  const json: AniListResponse = await response.json()

  // Flatten all entries from all lists
  const allEntries = json.data.MediaListCollection.lists.flatMap(
    list => list.entries
  )

  // Sort by updatedAt in descending order (most recent first)
  return allEntries.sort((a, b) => b.updatedAt - a.updatedAt)
}

function sanitizeFilename(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50)
}

// Simple YAML serializer (no external dependency needed)
function toYaml(obj: Record<string, unknown>, indent = 0): string {
  const spaces = '  '.repeat(indent)
  let result = ''

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      // Skip null/undefined values - velite doesn't handle them well
      continue
    } else if (typeof value === 'string') {
      // Escape strings that need quotes
      if (
        value.includes('\n') ||
        value.includes(':') ||
        value.includes('#') ||
        value.includes("'") ||
        value.includes('"') ||
        value.startsWith(' ') ||
        value.endsWith(' ')
      ) {
        // Use literal block style for multiline, double quotes for others
        if (value.includes('\n')) {
          result += `${spaces}${key}: |\n`
          value.split('\n').forEach(line => {
            result += `${spaces}  ${line}\n`
          })
        } else {
          result += `${spaces}${key}: "${value.replace(/"/g, '\\"')}"\n`
        }
      } else {
        result += `${spaces}${key}: ${value}\n`
      }
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      result += `${spaces}${key}: ${value}\n`
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        result += `${spaces}${key}: []\n`
      } else if (typeof value[0] === 'object') {
        result += `${spaces}${key}:\n`
        value.forEach(item => {
          result += `${spaces}  -\n${toYaml(item as Record<string, unknown>, indent + 2)}`
        })
      } else {
        result += `${spaces}${key}:\n`
        value.forEach(item => {
          result += `${spaces}  - ${item}\n`
        })
      }
    } else if (typeof value === 'object') {
      result += `${spaces}${key}:\n${toYaml(value as Record<string, unknown>, indent + 1)}`
    }
  }

  return result
}

function entryToYaml(entry: MediaListEntry): string {
  const yamlObj: Record<string, unknown> = {
    // Media identification
    id: entry.id,
    mediaId: entry.media.id,

    // Status and progress
    status: entry.status,
    score: entry.score,
    progress: entry.progress,

    // Timestamps
    updatedAt: entry.updatedAt,
    createdAt: entry.createdAt,

    // Media details
    title: {
      romaji: entry.media.title.romaji,
      english: entry.media.title.english,
      native: entry.media.title.native,
      userPreferred: entry.media.title.userPreferred
    },
    description: entry.media.description,
    coverImage: {
      extraLarge: entry.media.coverImage.extraLarge,
      large: entry.media.coverImage.large,
      medium: entry.media.coverImage.medium,
      color: entry.media.coverImage.color
    },
    episodes: entry.media.episodes,
    chapters: entry.media.chapters,
    volumes: entry.media.volumes,
    format: entry.media.format,
    mediaStatus: entry.media.status,
    siteUrl: entry.media.siteUrl,

    // Custom fields (empty by default, can be edited manually)
    customNote: '',
    customTags: [],
    featured: false
  }

  return toYaml(yamlObj)
}

async function syncMediaList(
  username: string,
  type: 'ANIME' | 'MANGA',
  outputDir: string
): Promise<void> {
  const entries = await fetchMediaList(username, type)

  console.log(`📥 Downloaded ${entries.length} ${type.toLowerCase()} entries`)

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
    console.log(`📁 Created directory: ${outputDir}`)
  }

  // Track existing files to detect removed entries
  const existingFiles = new Set(
    fs.readdirSync(outputDir).filter(f => f.endsWith('.yml'))
  )

  let created = 0
  let updated = 0
  let skipped = 0

  for (const entry of entries) {
    const title =
      entry.media.title.romaji ||
      entry.media.title.english ||
      entry.media.title.native
    const filename = `${entry.media.id}-${sanitizeFilename(title)}.yml`
    const filepath = path.join(outputDir, filename)

    existingFiles.delete(filename)

    // Check if file already exists
    if (fs.existsSync(filepath)) {
      // Read existing file to preserve custom fields
      const existingContent = fs.readFileSync(filepath, 'utf-8')

      // Simple check: if updatedAt is the same, skip
      if (existingContent.includes(`updatedAt: ${entry.updatedAt}`)) {
        skipped++
        continue
      }

      // Parse existing custom fields
      const customNoteMatch = existingContent.match(
        /customNote:\s*['"]?(.*)['"]?/
      )
      const customTagsMatch = existingContent.match(/customTags:\s*\[(.*)\]/)
      const featuredMatch = existingContent.match(/featured:\s*(true|false)/)

      // Generate new YAML content
      let yamlContent = entryToYaml(entry)

      // Preserve custom fields if they exist
      if (customNoteMatch && customNoteMatch[1]) {
        yamlContent = yamlContent.replace(
          /customNote:\s*''/,
          `customNote: '${customNoteMatch[1]}'`
        )
      }
      if (customTagsMatch && customTagsMatch[1]) {
        yamlContent = yamlContent.replace(
          /customTags:\s*\[\]/,
          `customTags: [${customTagsMatch[1]}]`
        )
      }
      if (featuredMatch && featuredMatch[1] === 'true') {
        yamlContent = yamlContent.replace(/featured:\s*false/, 'featured: true')
      }

      fs.writeFileSync(filepath, yamlContent)
      updated++
    } else {
      fs.writeFileSync(filepath, entryToYaml(entry))
      created++
    }
  }

  console.log(`✅ Sync complete:`)
  console.log(`   - Created: ${created}`)
  console.log(`   - Updated: ${updated}`)
  console.log(`   - Skipped (unchanged): ${skipped}`)

  if (existingFiles.size > 0) {
    console.log(
      `⚠️  ${existingFiles.size} files in ${outputDir} are no longer in AniList:`
    )
    existingFiles.forEach(f => console.log(`   - ${f}`))
    console.log(
      `   (These files were NOT deleted - they may be custom entries)`
    )
  }
}

async function main() {
  const args = process.argv.slice(2)

  // Parse arguments
  let syncAnime = false
  let syncManga = false
  let username = process.env.NEXT_PUBLIC_ANILIST_USERNAME || ''

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--anime') syncAnime = true
    else if (arg === '--manga') syncManga = true
    else if (arg === '--all') {
      syncAnime = true
      syncManga = true
    } else if (arg === '--username' && args[i + 1]) {
      username = args[++i]
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
🎬 AniList Sync Tool

Syncs your AniList anime/manga collection to local YAML files for use with Velite.

Usage:
  npx ts-node tools/sync-anilist.ts [options]

Options:
  --anime            Sync anime list only
  --manga            Sync manga list only
  --all              Sync both anime and manga lists
  --username <name>  AniList username (defaults to NEXT_PUBLIC_ANILIST_USERNAME env var)
  --help, -h         Show this help message

Examples:
  npx ts-node tools/sync-anilist.ts --all --username myusername
  npx ts-node tools/sync-anilist.ts --anime
  npx ts-node tools/sync-anilist.ts --manga --username someone

Output:
  - Anime entries are saved to: content/anime/*.yml
  - Manga entries are saved to: content/manga/*.yml

Custom Fields:
  Each YAML file includes custom fields you can edit manually:
  - customNote: Personal notes about the entry
  - customTags: Custom tags for categorization
  - featured: Mark entries to highlight on your site
`)
      process.exit(0)
    }
  }

  // Default to syncing both if no specific type is selected
  if (!syncAnime && !syncManga) {
    syncAnime = true
    syncManga = true
  }

  if (!username) {
    console.error('❌ Error: No username provided.')
    console.error(
      '   Use --username <name> or set NEXT_PUBLIC_ANILIST_USERNAME environment variable.'
    )
    process.exit(1)
  }

  console.log(`\n🎬 AniList Sync Tool`)
  console.log(`   Username: ${username}`)
  console.log(
    `   Syncing: ${[syncAnime && 'anime', syncManga && 'manga'].filter(Boolean).join(', ')}\n`
  )

  const contentDir = path.join(process.cwd(), 'content')

  try {
    if (syncAnime) {
      await syncMediaList(username, 'ANIME', path.join(contentDir, 'anime'))
      console.log('')
    }

    if (syncManga) {
      await syncMediaList(username, 'MANGA', path.join(contentDir, 'manga'))
    }

    console.log('\n🎉 All done!')
  } catch (error) {
    console.error('\n❌ Error:', error)
    process.exit(1)
  }
}

main()
