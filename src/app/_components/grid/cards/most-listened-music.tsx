'use client'

import { LastfmLogo } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import { useLastFmNowPlaying } from '~/hooks/use-lastfm-data'
import { cn } from '~/lib/utils/style'

// Concentric grooves for the placeholder record, alternating in strength
const DISC_GROOVES = Array.from({ length: 42 }, (_, index) => {
  const radius = 70 + index * 2.4
  const opacity = index % 3 === 0 ? 0.11 : 0.05
  return `<circle cx="180" cy="180" r="${radius.toFixed(1)}" fill="none" stroke="#ffffff" stroke-opacity="${opacity}" stroke-width="0.8" />`
}).join('')

// Default vinyl shown when the track has no cover art or is unknown. Its two
// light wedges sit off-axis so the slow spin stays visible.
const DISC_PLACEHOLDER = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  `
  <svg xmlns="http://www.w3.org/2000/svg" width="360" height="360" viewBox="0 0 360 360">
    <defs>
      <radialGradient id="vinyl" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#1a1a1a" />
        <stop offset="70%" stop-color="#0d0d0d" />
        <stop offset="100%" stop-color="#050505" />
      </radialGradient>
      <radialGradient id="sheen" cx="50%" cy="50%" r="50%">
        <stop offset="35%" stop-color="#ffffff" stop-opacity="0" />
        <stop offset="72%" stop-color="#ffffff" stop-opacity="0.16" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.04" />
      </radialGradient>
      <radialGradient id="label" cx="42%" cy="38%" r="70%">
        <stop offset="0%" stop-color="#b91c1c" />
        <stop offset="100%" stop-color="#7f1d1d" />
      </radialGradient>
    </defs>
    <circle cx="180" cy="180" r="176" fill="url(#vinyl)" />
    ${DISC_GROOVES}
    <circle cx="180" cy="180" r="112" fill="none" stroke="#000000" stroke-opacity="0.55" stroke-width="3" />
    <circle cx="180" cy="180" r="146" fill="none" stroke="#000000" stroke-opacity="0.55" stroke-width="3" />
    <path d="M180 180 L238.8 18.3 A172 172 0 0 1 311.8 69.4 Z" fill="url(#sheen)" />
    <path d="M180 180 L121.2 341.7 A172 172 0 0 1 48.2 290.6 Z" fill="url(#sheen)" />
    <circle cx="180" cy="180" r="175" fill="none" stroke="#2a2a2a" stroke-width="2" />
    <circle cx="180" cy="180" r="60" fill="url(#label)" />
    <circle cx="180" cy="180" r="54" fill="none" stroke="#000000" stroke-opacity="0.2" stroke-width="1" />
    <circle cx="180" cy="180" r="9" fill="#000000" fill-opacity="0.35" />
    <circle cx="180" cy="180" r="5" fill="#000000" />
  </svg>
`.trim()
)}`

export function MostListenedMusic() {
  // Polls every 30s; when nothing is playing the worker returns the last track
  const { data, isLoading } = useLastFmNowPlaying()
  const track = data?.track

  // Loading or unavailable: same card with the default disc and unknown track
  if (!track) {
    return (
      <div
        aria-busy={isLoading}
        className="relative flex h-36 items-center justify-center overflow-hidden rounded-lg bg-[#000] text-white"
      >
        <CardContent
          title="Unknown"
          artist="Unknown artist"
          caption="Currently listening"
          pulse={isLoading}
        />
        <SpinningDisc src={DISC_PLACEHOLDER} alt="" unoptimized />
      </div>
    )
  }

  const { name: title, artist, url, image } = track

  return (
    <a
      target="_blank"
      className="relative flex h-36 transform-gpu items-center justify-center overflow-hidden rounded-lg bg-[#000] text-white duration-500 hover:scale-95"
      href={url}
    >
      <CardContent
        title={title}
        artist={artist}
        caption={data?.nowPlaying ? 'Currently listening' : 'Last listened'}
      />
      {image ? (
        <SpinningDisc src={image} alt={`${title} cover art`} />
      ) : (
        <SpinningDisc
          src={DISC_PLACEHOLDER}
          alt="vinyl disc placeholder"
          unoptimized
        />
      )}
    </a>
  )
}

function CardContent({
  title,
  artist,
  caption,
  pulse = false
}: {
  title: string
  artist: string
  caption: string
  pulse?: boolean
}) {
  return (
    <>
      <LastfmLogo
        size="1em"
        className="absolute left-0 top-0 text-[50px] text-red-800"
      />
      <div className="absolute inset-y-1 right-2 z-10 flex w-10 justify-center overflow-hidden">
        <div
          className={cn(
            'side-text relative h-full max-w-full font-extrabold leading-none text-white',
            pulse && 'animate-pulse motion-reduce:animate-none'
          )}
        >
          <span className="absolute h-fit max-h-full truncate text-xl opacity-30">
            {artist}
          </span>
          <div className="truncate">{title}</div>
          <div className="truncate text-xs font-normal">{caption}</div>
        </div>
      </div>
    </>
  )
}

function SpinningDisc({
  src,
  alt,
  unoptimized = false
}: {
  src: string
  alt: string
  unoptimized?: boolean
}) {
  return (
    <>
      {/* Blurred glow behind the disc; decorative */}
      <Image
        src={src}
        alt=""
        className="absolute -bottom-10 -left-14 z-0 scale-110 rounded-full opacity-90 blur-3xl"
        width={200}
        height={200}
        unoptimized={unoptimized}
      />
      <Image
        src={src}
        alt={alt}
        className="absolute -bottom-10 -left-14 z-[1] animate-spin overflow-hidden rounded-full drop-shadow-[0_0_30px_rgba(255,255,255,0.55)] animate-duration-[65s]"
        placeholder="empty"
        width={200}
        height={200}
        unoptimized={unoptimized}
      />
    </>
  )
}
