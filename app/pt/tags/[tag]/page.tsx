import { PostCard } from 'nextra-theme-blog'
import { getPosts, getTags } from '../../posts/get-posts'

type PageProps = Readonly<{
  params: Promise<{ tag: string }>
}>

export async function generateMetadata(props: PageProps) {
  const params = await props.params
  return {
    title: `Posts marcados com "${decodeURIComponent(params.tag)}"`
  }
}

export async function generateStaticParams() {
  const allTags = await getTags()
  return [...new Set(allTags)].map(tag => ({ tag }))
}

export default async function TagPagePt(props: PageProps) {
  const params = await props.params
  const { title } = await generateMetadata(props)
  const posts = await getPosts()
  const tag = decodeURIComponent(params.tag)

  return (
    <div data-pagefind-ignore="all">
      <h1>{title}</h1>
      {posts
        .filter(post => post.frontMatter.tags?.includes(tag))
        .map(post => (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <PostCard key={post.route} post={post as any} />
        ))}
    </div>
  )
}
