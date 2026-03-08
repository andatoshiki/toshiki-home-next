#!/usr/bin/env npx ts-node

/**
 * Utility script to batch create journey location YAML files
 *
 * Usage:
 *   npx tsx tools/new-journey-location.ts --interactive
 *   npx tsx tools/new-journey-location.ts --name "Tokyo" --lat 35.6895 --lng 139.6917 --country "Japan" --status visited
 *   npx tsx tools/new-journey-location.ts --from-json locations.json
 *
 * JSON format for batch import:
 * [
 *   {
 *     "name": "Tokyo",
 *     "latitude": 35.6895,
 *     "longitude": 139.6917,
 *     "country": "Japan",
 *     "region": "Kanto",
 *     "city": "Tokyo",
 *     "status": "visited",
 *     "visitDate": "2023.08",
 *     "description": "Summer vacation",
 *     "tags": ["asia"]
 *   }
 * ]
 */

import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'

const JOURNEY_DIR = path.join(process.cwd(), 'content', 'journey')

interface LocationInput {
  name: string
  latitude: number
  longitude: number
  country: string
  region?: string
  city?: string
  status: 'visited' | 'residence' | 'airport' | 'wishlist'
  visitDate?: string
  description?: string
  tags?: string[]
  featured?: boolean
}

function generateId(name: string, country: string): string {
  const sanitize = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

  return `${sanitize(name)}-${sanitize(country)}`
}

function generateYaml(location: LocationInput): string {
  const id = generateId(location.name, location.country)

  const lines = [
    `id: ${id}`,
    `name: ${location.name}`,
    `coordinates:`,
    `  longitude: ${location.longitude}`,
    `  latitude: ${location.latitude}`,
    `country: ${location.country}`,
    `region: ${location.region || 'null'}`,
    `city: ${location.city || 'null'}`,
    `status: ${location.status}`,
    `visitDate: ${location.visitDate ? `'${location.visitDate}'` : 'null'}`,
    `description: ${location.description || 'null'}`,
    `tags:`
  ]

  if (location.tags && location.tags.length > 0) {
    location.tags.forEach(tag => {
      lines.push(`  - ${tag}`)
    })
  } else {
    lines.push(`  []`)
  }

  lines.push(`featured: ${location.featured || false}`)

  return lines.join('\n') + '\n'
}

function saveLocation(location: LocationInput): string {
  const id = generateId(location.name, location.country)
  const filename = `${id}.yml`
  const filepath = path.join(JOURNEY_DIR, filename)

  // Ensure directory exists
  if (!fs.existsSync(JOURNEY_DIR)) {
    fs.mkdirSync(JOURNEY_DIR, { recursive: true })
  }

  const yaml = generateYaml(location)
  fs.writeFileSync(filepath, yaml)

  return filepath
}

async function interactiveMode(): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const question = (prompt: string): Promise<string> =>
    new Promise(resolve => rl.question(prompt, resolve))

  console.log('\n🌍 Journey Location Creator\n')

  try {
    const name = await question('Location name: ')
    const latitude = parseFloat(await question('Latitude: '))
    const longitude = parseFloat(await question('Longitude: '))
    const country = await question('Country: ')
    const region = await question(
      'Region/State (optional, press Enter to skip): '
    )
    const city = await question('City (optional, press Enter to skip): ')

    console.log('\nStatus options: visited, residence, airport, wishlist')
    const status = (await question('Status: ')) as LocationInput['status']

    const visitDate = await question('Visit date (YYYY.MM, optional): ')
    const description = await question('Description (optional): ')
    const tagsInput = await question('Tags (comma-separated, optional): ')
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : []
    const featured = (await question('Featured? (y/n): ')).toLowerCase() === 'y'

    const location: LocationInput = {
      name,
      latitude,
      longitude,
      country,
      region: region || undefined,
      city: city || undefined,
      status,
      visitDate: visitDate || undefined,
      description: description || undefined,
      tags,
      featured
    }

    const filepath = saveLocation(location)
    console.log(`\n✅ Created: ${filepath}`)
  } finally {
    rl.close()
  }
}

async function fromJson(jsonPath: string): Promise<void> {
  const absolutePath = path.isAbsolute(jsonPath)
    ? jsonPath
    : path.join(process.cwd(), jsonPath)

  if (!fs.existsSync(absolutePath)) {
    console.error(`❌ File not found: ${absolutePath}`)
    process.exit(1)
  }

  const content = fs.readFileSync(absolutePath, 'utf-8')
  const locations: LocationInput[] = JSON.parse(content)

  console.log(`\n🌍 Importing ${locations.length} locations...\n`)

  for (const location of locations) {
    const filepath = saveLocation(location)
    console.log(`✅ Created: ${filepath}`)
  }

  console.log(`\n✅ Successfully imported ${locations.length} locations!`)
}

function fromArgs(): void {
  const args = process.argv.slice(2)
  const getArg = (name: string): string | undefined => {
    const index = args.indexOf(`--${name}`)
    return index !== -1 ? args[index + 1] : undefined
  }

  const name = getArg('name')
  const lat = getArg('lat')
  const lng = getArg('lng')
  const country = getArg('country')
  const status = getArg('status') as LocationInput['status']

  if (!name || !lat || !lng || !country || !status) {
    console.error(
      '❌ Missing required arguments: --name, --lat, --lng, --country, --status'
    )
    console.log('\nUsage:')
    console.log(
      '  npx tsx tools/new-journey-location.ts --name "Tokyo" --lat 35.6895 --lng 139.6917 --country "Japan" --status visited'
    )
    process.exit(1)
  }

  const location: LocationInput = {
    name,
    latitude: parseFloat(lat),
    longitude: parseFloat(lng),
    country,
    region: getArg('region'),
    city: getArg('city'),
    status,
    visitDate: getArg('date'),
    description: getArg('desc'),
    tags: getArg('tags')
      ?.split(',')
      .map(t => t.trim()),
    featured: getArg('featured') === 'true'
  }

  const filepath = saveLocation(location)
  console.log(`\n✅ Created: ${filepath}`)
}

async function main(): Promise<void> {
  const args = process.argv.slice(2)

  if (args.includes('--interactive') || args.includes('-i')) {
    await interactiveMode()
  } else if (args.includes('--from-json')) {
    const jsonIndex = args.indexOf('--from-json')
    const jsonPath = args[jsonIndex + 1]
    if (!jsonPath) {
      console.error('❌ Please provide a JSON file path after --from-json')
      process.exit(1)
    }
    await fromJson(jsonPath)
  } else if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🌍 Journey Location Creator

Usage:
  npx tsx tools/new-journey-location.ts --interactive
  npx tsx tools/new-journey-location.ts --name "Tokyo" --lat 35.6895 --lng 139.6917 --country "Japan" --status visited
  npx tsx tools/new-journey-location.ts --from-json locations.json

Options:
  --interactive, -i    Interactive mode with prompts
  --from-json <file>   Import from JSON file
  --name <name>        Location name (required)
  --lat <latitude>     Latitude (required)
  --lng <longitude>    Longitude (required)
  --country <country>  Country name (required)
  --status <status>    Status: visited, residence, airport, wishlist (required)
  --region <region>    Region/State (optional)
  --city <city>        City name (optional)
  --date <date>        Visit date in YYYY.MM format (optional)
  --desc <description> Description (optional)
  --tags <tags>        Comma-separated tags (optional)
  --featured <bool>    Featured flag (optional)
  --help, -h           Show this help

Status values:
  visited    - Places you have visited
  residence  - Places you have lived
  airport    - Airports you've transited through
  wishlist   - Places you want to visit
`)
  } else if (args.length > 0) {
    fromArgs()
  } else {
    console.log(
      'Run with --help for usage information, or --interactive for guided mode'
    )
  }
}

main().catch(console.error)
