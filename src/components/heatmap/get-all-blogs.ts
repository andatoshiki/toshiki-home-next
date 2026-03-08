import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export function getAllBlogPosts() {
  const postsDir = path.join(process.cwd(), 'content', 'leetcode')
  const files = fs.readdirSync(postsDir)
  const posts: Array<{ date: string; title: string }> = []

  for (const file of files) {
    if (file.endsWith('.mdx')) {
      const filePath = path.join(postsDir, file)
      const raw = fs.readFileSync(filePath, 'utf-8')
      const { data: frontmatter } = matter(raw)
      if (frontmatter?.date && frontmatter?.title) {
        posts.push({
          date: frontmatter.date,
          title: frontmatter.title
        })
      }
    }
  }
  return posts
}
