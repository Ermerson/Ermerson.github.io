import { normalizePages } from 'nextra/normalize-pages'
import { getPageMap } from 'nextra/page-map'

export interface Post {
  name: string
  route: string
  frontMatter: {
    title: string
    date: string
    description?: string
    tags?: string[]
  }
}

export async function getPosts(): Promise<Post[]> {
  const { directories } = normalizePages({
    list: await getPageMap('/en/posts'),
    route: '/en/posts'
  })
  return (directories as unknown as Post[])
    .filter(post => post.name !== 'index')
    .sort(
      (a, b) => +new Date(b.frontMatter.date) - +new Date(a.frontMatter.date)
    )
}

export async function getTags(): Promise<string[]> {
  const posts = await getPosts()
  return posts.flatMap(post => post.frontMatter.tags ?? [])
}
