import { LastfmLogo } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import {
  createTrackArtworkPlaceholder,
  getAlbumCover
} from '~/lib/api/lastfm/get-album-cover'
import { getLastFmTopTracks } from '~/lib/api/lastfm/lasfm'

export async function MostListenedMusic() {
  const track = await getLastFmTopTracks('1month').then(tracks => tracks[0])

  if (!track) {
    return null
  }

  const {
    name: title,
    artist,
    url,
    image
  } = track

  const coverUrl =
    (await getAlbumCover(`${title} - ${artist.name}`, image)) ??
    createTrackArtworkPlaceholder(title, artist.name)
  const isGeneratedCover = coverUrl.startsWith('data:image/')

  return (
    <a
      target="_blank"
      className="relative flex h-36 transform-gpu items-center justify-center overflow-hidden rounded-lg bg-[#000] text-white duration-500 hover:scale-95"
      href={url}
    >
      <LastfmLogo
        size="1em"
        className="absolute left-0 top-0 text-[50px] text-red-800"
      />
      <div className="absolute bottom-0 right-5 top-0">
        <div className="side-text relative z-0 h-full font-extrabold leading-none text-white">
          <span className="absolute h-fit max-h-full truncate text-xl opacity-30">
            {artist.name}
          </span>
          <div className="truncate">{title}</div>
          <div className="truncate text-xs font-normal">
            Top listened this month
          </div>
        </div>
      </div>
      <Image
        src={coverUrl}
        alt={`${title} cover art`}
        className="absolute -bottom-10 -left-14 -z-10 rounded-full blur-2xl"
        width={200}
        height={200}
        unoptimized={isGeneratedCover}
      />
      <Image
        src={coverUrl}
        alt={`${title} cover art`}
        className="absolute -bottom-12 -left-16 animate-spin overflow-hidden rounded-full animate-duration-[65s]"
        placeholder="empty"
        width={200}
        height={200}
        unoptimized={isGeneratedCover}
      />
    </a>
  )
}
