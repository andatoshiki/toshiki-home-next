import { getUniqueCategoryList } from '~/lib/categories'
import { slug } from '~/lib/slug'
import { getUniqueTagList } from '~/lib/tags'
import { config } from 'global-config'
import { leetcode, posts } from '#content'

const commonPaths = [
  '',
  'projects',
  'about',
  'about/statistics',
  'blog',
  'blog/categories',
  'blog/tag',
  'blog/feed',
  'guestbook',
  'donation',
  'album',
  'leetcode',
  'leetcode/feed', // ensure leetcode feed is included
  'songs',
  'library'
]
const tagPaths = getUniqueTagList().map(tag => `blog/tag/${slug(tag)}`)
const categoryPaths = getUniqueCategoryList().map(
  category => `blog/categories/${slug(category)}`
)
const postPaths = posts.map(post => `blog/post/${post.slug}`)
const leetCodePath = leetcode.map(leetcode => `leetcode/${leetcode.slug}`)

export const allRoutes = [
  ...commonPaths,
  ...tagPaths,
  ...categoryPaths,
  ...postPaths,
  ...leetCodePath
].map(paths => `${config.webserver.host}/${paths}`)
