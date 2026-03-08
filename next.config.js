const withBundleAnalyzer = require('@next/bundle-analyzer')()

/** @type {import('next').NextConfig} */
const nextConfig = {
  // [TODO] craete a branch for ssg dedicated
  // output: 'export',
  reactStrictMode: true,
  // ignore build config for faster compilation and avoid formatting issue
  // [WARNING] set value to false upon completion of initial project
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    domains: [
      'raw.githubusercontent.com',
      'avatars.githubusercontent.com',
      'github.com',
      'i.imgur.com',
      'i.scdn.co',
      'mateusf.com',
      'lastfm.freetls.fastly.net',
      'contribution.catsjuice.com',
      'cdn.toshiki.dev',
      'cdn.tosh1ki.de',
      'picsum.photos',
      'www.loliapi.com',
      'http.toshiki.dev',
      'placehold.co',
      's4.anilist.co',
      // Steam image domains
      'steamcdn-a.akamaihd.net',
      'media.steampowered.com',
      'avatars.steamstatic.com',
      'cdn.akamai.steamstatic.com',
      'shared.akamai.steamstatic.com',
      // Hardcover image domains
      'hardcover.app',
      'assets.hardcover.app',
      'storage.googleapis.com'
    ]
  }
  // async rewrites() {
  //   return [
  //     {
  //       source: '/rss',
  //       destination: '/blog/feed'
  //     },
  //     {
  //       source: '/atom',
  //       destination: '/blog/feed'
  //     },
  //     {
  //       source: '/rss.xml',
  //       destination: '/blog/feed'
  //     },
  //     {
  //       source: '/atom.xml',
  //       destination: '/blog/feed'
  //     }
  //   ]
  // },
  // async headers() {
  //   return [
  //     {
  //       source: '/assets/:path*',
  //       headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }]
  //     }
  //   ]
  // }
}

module.exports =
  process.env.ANALYZE === 'true' ? withBundleAnalyzer(nextConfig) : nextConfig
