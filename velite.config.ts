import { defineConfig } from 'velite'
import { PluggableList } from 'unified'

import { posts } from './content/collections/posts'
import { tils } from './content/collections/tils'
import { projects } from './content/collections/projects'
import { aboutMe } from './content/collections/about-me'
import { works } from './content/collections/work'
import { courses } from './content/collections/courses'
import { donation } from './content/collections/donation'
import { leetcode } from './content/collections/leetcode'
import { album } from 'content/collections/album'
import { mansory } from 'content/collections/mansory'
import { animeList, mangaList } from './content/collections/anime'
import { steamProfile, gamesList } from './content/collections/games'
import { hardcoverProfile, booksList } from './content/collections/books'
import { journeyLocations } from './content/collections/journey'
import { usesList } from './content/collections/uses'

import { rehypePlugins, remarkPlugins } from './content/plugin'

const config = defineConfig({
  collections: {
    posts,
    tils,
    projects,
    aboutMe,
    works,
    courses,
    donation,
    leetcode,
    album,
    mansory,
    animeList,
    mangaList,
    steamProfile,
    gamesList,
    hardcoverProfile,
    booksList,
    journeyLocations,
    usesList
  },
  mdx: {
    rehypePlugins: rehypePlugins as PluggableList,
    remarkPlugins: remarkPlugins as PluggableList
  }
})

export default config
