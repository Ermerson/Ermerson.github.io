import Link from 'next/link'
import { PostCard } from 'nextra-theme-blog'
import { Badge } from '@/components/ui/badge'
import { getPosts, getTags } from './get-posts'

export const metadata = {
  title: 'Posts'
}

export default async function PostsPageEn() {
  const tags = await getTags()
  const posts = await getPosts()
  const tagCounts: Record<string, number> = {}

  for (const tag of tags) {
    tagCounts[tag] = (tagCounts[tag] ?? 0) + 1
  }

  return (
    <div data-pagefind-ignore="all">
      <h1>{metadata.title}</h1>
      <div className="not-prose flex flex-wrap gap-2">
        {Object.entries(tagCounts).map(([tag, count]) => (
          <Link key={tag} href={`/en/tags/${tag}/`}>
            <Badge variant="secondary">
              {tag} ({count})
            </Badge>
          </Link>
        ))}
      </div>
      {posts.map(post => (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <PostCard key={post.route} post={post as any} />
      ))}
    </div>
  )
}
