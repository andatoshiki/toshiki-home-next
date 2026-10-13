import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { LastFmTrack } from '~/lib/api/lastfm/types'
import { getNowPlayingCard } from './now-playing-state'

const track: LastFmTrack = {
  name: 'Andante',
  artist: 'ClariS',
  image: 'https://example.com/cover.png',
  url: 'https://www.last.fm/music/ClariS/_/Andante',
  nowPlaying: true
}

test('shows the playing track as currently listening', () => {
  const card = getNowPlayingCard({ track, nowPlaying: true }, false)

  assert.deepEqual(card, {
    kind: 'track',
    title: 'Andante',
    artist: 'ClariS',
    url: 'https://www.last.fm/music/ClariS/_/Andante',
    image: 'https://example.com/cover.png',
    caption: 'Currently listening'
  })
})

test('shows the latest scrobble as last listened when nothing plays', () => {
  const card = getNowPlayingCard(
    { track: { ...track, nowPlaying: false }, nowPlaying: false },
    false
  )

  assert.equal(card.kind, 'track')
  assert.equal(card.caption, 'Last listened')
})

test('keeps showing the cached track while a refresh is loading', () => {
  const card = getNowPlayingCard({ track, nowPlaying: true }, true)

  assert.equal(card.kind, 'track')
})

test('treats a missing cover as no image so the vinyl placeholder is used', () => {
  const card = getNowPlayingCard(
    { track: { ...track, image: '' }, nowPlaying: true },
    false
  )

  assert.equal(card.kind === 'track' && card.image, null)
})

test('shows a pending unknown track while the first request loads', () => {
  assert.deepEqual(getNowPlayingCard(null, true), {
    kind: 'placeholder',
    title: 'Unknown',
    artist: 'Unknown artist',
    caption: 'Loading',
    pending: true
  })
})

test('reports the feed as not available when it fails or has no history', () => {
  for (const data of [null, { track: null, nowPlaying: false }]) {
    const card = getNowPlayingCard(data, false)

    assert.equal(card.kind, 'placeholder')
    assert.equal(card.caption, 'Not available')
    assert.equal(card.kind === 'placeholder' && card.pending, false)
  }
})
