const CONFIG = {
  // Prefer the LASTFM_API_KEY Worker secret. Only fill this after pasting into
  // the Cloudflare dashboard, and never commit a real key to the repository.
  apiKey: '',
  username: 'andatoshiki',
  allowedOrigins: [
    'https://toshiki.dev',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  maxLimit: 50,
  cacheSeconds: {
    summary: 60,
    user: 1800,
    'now-playing': 15,
    'recent-tracks': 60,
    'top-tracks': 1800,
    'top-artists': 1800
  }
}

const LASTFM_API_URL = 'https://ws.audioscrobbler.com/2.0/'
const LASTFM_PLACEHOLDER_IMAGE = '2a96cbd8b46e442fc41c2b86b821562f.png'
const PERIODS = ['overall', '7day', '1month', '3month', '6month', '12month']
const RESOURCES = Object.keys(CONFIG.cacheSeconds)

class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

function getCorsHeaders(request) {
  const origin = request.headers.get('origin')?.replace(/\/$/, '')
  const headers = new Headers({
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin'
  })

  if (!origin) return headers

  if (CONFIG.allowedOrigins.includes('*')) {
    headers.set('Access-Control-Allow-Origin', '*')
    return headers
  }

  if (!CONFIG.allowedOrigins.includes(origin)) {
    throw new HttpError(403, 'Origin is not allowed')
  }

  headers.set('Access-Control-Allow-Origin', origin)
  return headers
}

function jsonResponse(data, status, corsHeaders, cacheSeconds = null) {
  const headers = new Headers(corsHeaders)

  headers.set('Content-Type', 'application/json; charset=utf-8')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set(
    'Cache-Control',
    cacheSeconds
      ? `public, max-age=${cacheSeconds}, s-maxage=${cacheSeconds}, stale-while-revalidate=86400`
      : 'no-store'
  )

  return new Response(JSON.stringify(data), { status, headers })
}

function getResource(url) {
  const queryResource = url.searchParams.get('resource')
  if (RESOURCES.includes(queryResource)) return queryResource

  const finalSegment = url.pathname.replace(/\/+$/, '').split('/').at(-1) ?? ''
  if (RESOURCES.includes(finalSegment)) return finalSegment
  if (!finalSegment || finalSegment === 'music' || finalSegment === 'lastfm') {
    return 'summary'
  }

  throw new HttpError(404, 'Unknown Last.fm resource')
}

function getLimit(value, fallback) {
  if (!value) return fallback

  const limit = Number(value)
  if (!Number.isInteger(limit) || limit < 1 || limit > CONFIG.maxLimit) {
    throw new HttpError(
      400,
      `limit must be an integer from 1 to ${CONFIG.maxLimit}`
    )
  }

  return limit
}

function getPeriod(value, fallback) {
  if (!value) return fallback
  if (!PERIODS.includes(value)) {
    throw new HttpError(400, `period must be one of: ${PERIODS.join(', ')}`)
  }

  return value
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function getImage(images = []) {
  for (const size of ['extralarge', 'large', 'medium', 'small']) {
    const image = images.find(candidate => candidate.size === size)?.['#text']
    if (image && !image.includes(LASTFM_PLACEHOLDER_IMAGE)) return image
  }

  return (
    images.find(image => {
      const url = image['#text']
      return url && !url.includes(LASTFM_PLACEHOLDER_IMAGE)
    })?.['#text'] ?? ''
  )
}

function mapTrack(track) {
  const artist =
    typeof track.artist === 'string'
      ? track.artist
      : track.artist?.name ?? track.artist?.['#text'] ?? ''
  const plays = toNumber(track.playcount, Number.NaN)
  const date = toNumber(track.date?.uts, Number.NaN)

  return {
    name: track.name ?? '',
    artist,
    image: getImage(track.image),
    url: track.url ?? '',
    ...(Number.isFinite(date) ? { date } : {}),
    ...(Number.isFinite(plays) ? { plays } : {}),
    nowPlaying:
      track.nowplaying === true || track['@attr']?.nowplaying === 'true'
  }
}

function mapArtist(artist) {
  return {
    name: artist.name ?? '',
    image: getImage(artist.image),
    url: artist.url ?? '',
    plays: toNumber(artist.playcount)
  }
}

function mapUser(user) {
  const registered =
    typeof user.registered === 'object'
      ? user.registered.unixtime ?? user.registered['#text']
      : user.registered

  return {
    name: user.name ?? CONFIG.username,
    image: getImage(user.image),
    url: user.url ?? '',
    totalPlays: toNumber(user.playcount),
    registered: toNumber(registered)
  }
}

async function lastFmRequest(apiKey, method, params = {}) {
  const url = new URL(LASTFM_API_URL)
  url.search = new URLSearchParams({
    method: `user.${method}`,
    user: CONFIG.username,
    api_key: apiKey,
    format: 'json',
    ...params
  }).toString()

  const response = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!response.ok) throw new HttpError(502, 'Last.fm is unavailable')

  const body = await response.json()
  if (body.error) {
    throw new HttpError(502, body.message ?? 'Last.fm rejected the request')
  }

  return body
}

async function getUser(apiKey) {
  const { user } = await lastFmRequest(apiKey, 'getinfo')
  return mapUser(user)
}

async function getRecentTracks(apiKey, limit) {
  const { recenttracks } = await lastFmRequest(apiKey, 'getrecenttracks', {
    limit: String(limit)
  })
  return (recenttracks.track ?? []).map(mapTrack)
}

async function getTopTracks(apiKey, period, limit) {
  const { toptracks } = await lastFmRequest(apiKey, 'gettoptracks', {
    period,
    limit: String(limit)
  })
  return (toptracks.track ?? []).map(mapTrack)
}

async function getTopArtists(apiKey, period, limit) {
  const { topartists } = await lastFmRequest(apiKey, 'gettopartists', {
    period,
    limit: String(limit)
  })
  return (topartists.artist ?? []).map(mapArtist)
}

async function getData(resource, url, apiKey) {
  switch (resource) {
    case 'user':
      return { user: await getUser(apiKey) }

    case 'now-playing': {
      const [track = null] = await getRecentTracks(apiKey, 1)
      return { track, nowPlaying: track?.nowPlaying === true }
    }

    case 'recent-tracks': {
      const limit = getLimit(url.searchParams.get('limit'), 15)
      return { tracks: await getRecentTracks(apiKey, limit) }
    }

    case 'top-tracks': {
      const period = getPeriod(url.searchParams.get('period'), '6month')
      const limit = getLimit(url.searchParams.get('limit'), 10)
      return { period, tracks: await getTopTracks(apiKey, period, limit) }
    }

    case 'top-artists': {
      const period = getPeriod(url.searchParams.get('period'), '6month')
      const limit = getLimit(url.searchParams.get('limit'), 10)
      return { period, artists: await getTopArtists(apiKey, period, limit) }
    }

    default: {
      const [user, topTracks, topArtists, recentTracks] = await Promise.all([
        getUser(apiKey),
        getTopTracks(apiKey, '7day', 6),
        getTopArtists(apiKey, '7day', 4),
        getRecentTracks(apiKey, 15)
      ])
      return { user, topTracks, topArtists, recentTracks }
    }
  }
}

function createCacheKey(request) {
  const url = new URL(request.url)
  url.searchParams.delete('__origin')
  url.searchParams.set('__origin', request.headers.get('origin') ?? 'server')
  url.searchParams.sort()
  return new Request(url, { method: 'GET' })
}

export default {
  async fetch(request, env, context) {
    let corsHeaders = new Headers()

    try {
      corsHeaders = getCorsHeaders(request)

      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders })
      }
      if (request.method !== 'GET') {
        throw new HttpError(405, 'Only GET requests are supported')
      }

      const apiKey = env.LASTFM_API_KEY || CONFIG.apiKey
      if (!apiKey) throw new HttpError(500, 'LASTFM_API_KEY is not configured')

      const url = new URL(request.url)
      const resource = getResource(url)
      const cacheKey = createCacheKey(request)
      const cachedResponse = await caches.default.match(cacheKey)
      if (cachedResponse) return cachedResponse

      const data = await getData(resource, url, apiKey)
      const response = jsonResponse(
        data,
        200,
        corsHeaders,
        CONFIG.cacheSeconds[resource]
      )

      context.waitUntil(caches.default.put(cacheKey, response.clone()))
      return response
    } catch (error) {
      const status = error instanceof HttpError ? error.status : 500
      const message =
        error instanceof HttpError ? error.message : 'Unexpected server error'
      if (status >= 500) console.error('Last.fm Worker failed', error)
      return jsonResponse({ error: true, message }, status, corsHeaders)
    }
  }
}
