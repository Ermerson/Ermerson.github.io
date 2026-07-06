import { getPosts } from '../posts/get-posts'

export const dynamic = 'force-static'

const ORIGIN = 'https://ermerson.github.io'

const CONFIG = {
  title: 'Blog Pessoal (PT)',
  siteUrl: `${ORIGIN}/pt`,
  description: 'Últimos posts do blog',
  lang: 'pt-br'
}

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export async function GET() {
  const allPosts = await getPosts()
  const items = allPosts
    .map(
      post => `    <item>
        <title>${escapeXml(post.frontMatter.title)}</title>
        <description>${escapeXml(post.frontMatter.description ?? '')}</description>
        <link>${ORIGIN}${post.route}/</link>
        <pubDate>${new Date(post.frontMatter.date).toUTCString()}</pubDate>
    </item>`
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${CONFIG.title}</title>
    <link>${CONFIG.siteUrl}</link>
    <description>${CONFIG.description}</description>
    <language>${CONFIG.lang}</language>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml'
    }
  })
}
