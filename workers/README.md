# Standalone Last.fm workers

The Cloudflare Worker and Netlify Function are independent, self-contained
implementations with the same public response contract. Neither file imports
project code or uses Spotify.

## Endpoints

- `GET /v1/music` or `GET /v1/music/summary`
- `GET /v1/music/user`
- `GET /v1/music/now-playing`
- `GET /v1/music/recent-tracks?limit=15`
- `GET /v1/music/top-tracks?period=1month&limit=10`
- `GET /v1/music/top-artists?period=6month&limit=10`

Supported periods are `overall`, `7day`, `1month`, `3month`, `6month`, and
`12month`. Limits must be between 1 and 50.

## Environment

- `LASTFM_API_KEY` should be stored as a platform secret.
- Username, allowed origins, limits, and per-endpoint cache durations are in
  the `CONFIG` object at the top of each standalone file.
- The empty `CONFIG.apiKey` fallback is provided for private dashboard pastes;
  never commit a real key there.

## Cloudflare

Paste `workers/cloudflare/lastfm.js` directly into a module Worker, or deploy
it from `workers/cloudflare` with Wrangler. Set `LASTFM_API_KEY` as a Worker
secret; the included Wrangler configuration declares it as required.

## Netlify

`workers/netlify/lastfm.mts` contains the complete Netlify implementation. Use
the adjacent `netlify.toml`, or set the Functions directory to
`workers/netlify` in the Netlify UI, then add `LASTFM_API_KEY` with Functions
scope.
