# Blog Pessoal (Nextra + shadcn/ui + GitHub Pages) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a bilingual (pt/en) personal blog built with Next.js + Nextra's blog theme, styled with Tailwind CSS + shadcn/ui, exported as a static site and auto-deployed to GitHub Pages via GitHub Actions.

**Architecture:** A single Next.js App Router project. One root-level Nextra catch-all route (`app/[[...mdxPath]]/page.tsx`) renders all MDX posts from `content/pt/` and `content/en/` transparently (content directory mirrors the URL path, including the locale segment — no Nextra-specific i18n feature involved). Two parallel, hand-written route trees (`app/pt/`, `app/en/`) provide the per-locale "chrome" pages (home, about, posts listing, tag pages, RSS) that Nextra's blog theme doesn't localize automatically. shadcn/ui components are used for all non-MDX chrome (buttons, cards, badges, locale switcher) and are also exposed inside MDX via `mdx-components.tsx`.

**Tech Stack:** Next.js (App Router, latest), Nextra 4 + `nextra-theme-blog`, TypeScript, Tailwind CSS v4, shadcn/ui, pnpm, GitHub Actions.

## Global Constraints

- Repo: `Ermerson/Ermerson.github.io` (user page — publishes at `https://ermerson.github.io`, no `basePath`).
- Static export only: `output: 'export'`, `images: { unoptimized: true }`, `trailingSlash: true` in `next.config.ts` (all three are required together for correct GitHub Pages serving of directory-style routes).
- Do **not** use Nextra's native `i18n` config key — per the approved spec, it is documented as docs-theme-only. Locales are implemented as two independent, hand-written route/content trees (`pt`, `en`), no automatic fallback between them.
- Default locale: `pt`. Secondary locale: `en`.
- Package manager: pnpm, pinned via `corepack use pnpm@latest` (writes the resolved version into `package.json`'s `packageManager` field).
- Node.js version in CI: `24` (current Active LTS).
- Pinned GitHub Actions (verified current major versions): `actions/checkout@v7`, `actions/setup-node@v6`, `pnpm/action-setup@v6`, `actions/configure-pages@v6`, `actions/upload-pages-artifact@v5`, `actions/deploy-pages@v5`.
- TypeScript throughout, default strict mode from `create-next-app`.
- No `src/` directory — `app/`, `content/`, `components/`, `lib/` all live at the project root.

---

### Task 1: Scaffold the Next.js project with static export config

**Files:**
- Create: entire scaffolded project via CLI (`package.json`, `tsconfig.json`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `eslint.config.mjs`, `postcss.config.mjs`, `.gitignore`, `public/*`)
- Create: `next.config.ts` (replaces whatever config file `create-next-app` generates)
- Modify: `package.json` (via `corepack use pnpm@latest`, adds `packageManager` field)

**Interfaces:**
- Produces: a buildable Next.js App Router project at the repo root, with `next.config.ts` exporting a Nextra-wrapped config that later tasks extend.

- [ ] **Step 1: Scaffold the project**

Run (from the repo root, `D:/Projects/Doc/TechBlog`, which already contains only `.git/` and `docs/` — both are on `create-next-app`'s safe-to-coexist allowlist):

```bash
pnpm create next-app@latest . --yes --no-agents-md
```

This uses the current recommended defaults: TypeScript, ESLint, Tailwind CSS v4, App Router, no `src/` directory, import alias `@/*`.

- [ ] **Step 2: Install Nextra and the blog theme**

```bash
pnpm add nextra nextra-theme-blog
```

- [ ] **Step 3: Pin the package manager**

```bash
corepack enable
corepack use pnpm@latest
```

Verify `package.json` now contains a `"packageManager": "pnpm@..."` field.

- [ ] **Step 4: Replace the generated Next.js config**

```bash
rm -f next.config.mjs next.config.ts next.config.js
```

Create `next.config.ts`:

```ts
import type { NextConfig } from 'next'
import nextra from 'nextra'

const withNextra = nextra({})

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

export default withNextra(nextConfig)
```

- [ ] **Step 5: Verify the project builds**

```bash
pnpm build
```

Expected: exits `0`. Confirm the output exists:

```bash
test -f out/index.html && echo "OK: out/index.html exists"
```

Expected output: `OK: out/index.html exists`

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Scaffold Next.js project with Nextra and static export config"
```

---

### Task 2: Add Tailwind (already scaffolded) + shadcn/ui

**Files:**
- Create: `components.json`
- Create: `lib/utils.ts`
- Create: `components/ui/button.tsx`, `components/ui/card.tsx`, `components/ui/badge.tsx`, `components/ui/dropdown-menu.tsx`
- Modify: `app/globals.css` (shadcn init appends its theme variables here automatically)
- Modify: `app/page.tsx` (temporary smoke test, replaced in Task 7)

**Interfaces:**
- Produces: `cn()` helper at `@/lib/utils`, and shadcn components importable from `@/components/ui/*`, used by every later task.

- [ ] **Step 1: Initialize shadcn/ui non-interactively**

```bash
pnpm dlx shadcn@latest init -y -d
```

If the command still stops for interactive prompts despite `-y -d`, answer exactly: TypeScript → **Yes**, style → **Default**, base color → **Neutral**, CSS variables → **Yes**.

- [ ] **Step 2: Add the components used by this project**

```bash
pnpm dlx shadcn@latest add button card badge dropdown-menu
```

Verify the files exist:

```bash
test -f components/ui/button.tsx && test -f components/ui/card.tsx && test -f components/ui/badge.tsx && test -f components/ui/dropdown-menu.tsx && test -f lib/utils.ts && echo "OK: shadcn components present"
```

Expected output: `OK: shadcn components present`

- [ ] **Step 3: Smoke-test the wiring**

Edit `app/page.tsx` to temporarily render a shadcn Button:

```tsx
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div style={{ padding: 40 }}>
      <Button data-testid="shadcn-smoke-test">Hello shadcn</Button>
    </div>
  )
}
```

- [ ] **Step 4: Build and verify the button renders**

```bash
pnpm build
grep -o 'data-testid="shadcn-smoke-test"' out/index.html
```

Expected output: `data-testid="shadcn-smoke-test"`

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add Tailwind + shadcn/ui with button, card, badge, dropdown-menu"
```

---

### Task 3: Wire up Nextra's blog theme, MDX pipeline, and the first bilingual posts

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Create: `mdx-components.tsx`
- Create: `app/[[...mdxPath]]/page.tsx`
- Create: `content/pt/posts/exemplo-primeiro-post.mdx`
- Create: `content/en/posts/example-first-post.mdx`

**Interfaces:**
- Consumes: `Button`/`Card` from `@/components/ui/*` (Task 2).
- Produces: a working MDX rendering pipeline for both `content/pt/**` and `content/en/**`, and a `Note` MDX component available to any post.

- [ ] **Step 1: Add Nextra's blog theme styles to globals.css**

Open `app/globals.css`. Immediately after the line `@import 'tailwindcss';`, insert:

```css
@import 'nextra-theme-blog/style.css';
```

Check whether shadcn's `init` step already added a dark-mode variant declaration (something like `@custom-variant dark (&:is(.dark *));`) near the top of the file. If — and only if — no such variant declaration exists anywhere in the file, add one:

```css
@variant dark (&:where(.dark *));
```

- [ ] **Step 2: Create the MDX components file**

Create `mdx-components.tsx` at the project root:

```tsx
import type { MDXComponents } from 'mdx/types'
import type { ReactNode } from 'react'
import { useMDXComponents as getThemeComponents } from 'nextra-theme-blog'
import { Card, CardContent } from '@/components/ui/card'

const themeComponents = getThemeComponents()

function Note({ children }: { children: ReactNode }) {
  return (
    <Card className="not-prose my-4">
      <CardContent className="pt-6">{children}</CardContent>
    </Card>
  )
}

export function useMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...themeComponents,
    Note,
    ...components
  }
}
```

- [ ] **Step 3: Replace the root layout**

Replace `app/layout.tsx` entirely:

```tsx
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Footer, Layout, Navbar, ThemeSwitch } from 'nextra-theme-blog'
import { Head, Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Blog Pessoal',
    template: '%s | Blog Pessoal'
  },
  description: 'Anotações e aprendizados sobre programação.'
}

export default async function RootLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <Head />
      <body>
        <Layout>
          <Navbar pageMap={await getPageMap()}>
            <Search />
            <ThemeSwitch />
          </Navbar>

          {children}

          <Footer>
            <span>{new Date().getFullYear()} © Blog Pessoal.</span>
          </Footer>
        </Layout>
      </body>
    </html>
  )
}
```

(The locale switcher is added to the Navbar in Task 7, once it exists.)

- [ ] **Step 4: Create the root MDX catch-all route**

Create `app/[[...mdxPath]]/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

type PageProps = Readonly<{
  params: Promise<{ mdxPath?: string[] }>
}>

export async function generateMetadata(
  props: PageProps
): Promise<Metadata> {
  const params = await props.params
  const { metadata } = await importPage(params.mdxPath)
  return metadata
}

const Wrapper = getMDXComponents().wrapper

export default async function Page(props: PageProps) {
  const params = await props.params
  const {
    default: MDXContent,
    toc,
    metadata,
    sourceCode
  } = await importPage(params.mdxPath)
  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  )
}
```

- [ ] **Step 5: Add the first post in Portuguese**

Create `content/pt/posts/exemplo-primeiro-post.mdx`:

```mdx
---
title: Meu primeiro post
date: 2026-07-05
description: Um post de exemplo para validar o pipeline de conteúdo do blog.
tags: [aprendizado, nextjs]
---

# Meu primeiro post

Este é um post de exemplo, escrito para validar que o pipeline de conteúdo
do Nextra está funcionando corretamente em português.

<Note>
  Esta é uma nota de destaque, construída com o componente `Card` do shadcn/ui.
</Note>
```

- [ ] **Step 6: Add the first post in English**

Create `content/en/posts/example-first-post.mdx`:

```mdx
---
title: My first post
date: 2026-07-05
description: An example post to validate the blog's content pipeline.
tags: [learning, nextjs]
---

# My first post

This is an example post, written to validate that the Nextra content
pipeline is working correctly in English.

<Note>
  This is a highlighted note, built with shadcn/ui's `Card` component.
</Note>
```

- [ ] **Step 7: Build and verify both posts render**

```bash
pnpm build
grep -o 'Meu primeiro post' out/pt/posts/exemplo-primeiro-post/index.html
grep -o 'nota de destaque' out/pt/posts/exemplo-primeiro-post/index.html
grep -o 'My first post' out/en/posts/example-first-post/index.html
grep -o 'highlighted note' out/en/posts/example-first-post/index.html
```

Expected: each `grep` prints the matched text (no errors, no empty output).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Wire up Nextra blog theme, MDX pipeline, and first bilingual posts"
```

---

### Task 4: Posts listing pages (pt + en)

**Files:**
- Create: `app/pt/posts/get-posts.ts`
- Create: `app/pt/posts/page.tsx`
- Create: `app/en/posts/get-posts.ts`
- Create: `app/en/posts/page.tsx`

**Interfaces:**
- Consumes: `Badge` from `@/components/ui/badge` (Task 2); `content/pt/posts/*.mdx` and `content/en/posts/*.mdx` (Task 3).
- Produces: `Post` type, `getPosts(): Promise<Post[]>`, `getTags(): Promise<string[]>` — exported from each locale's `get-posts.ts` and consumed by Task 5's tag pages.

- [ ] **Step 1: Create the Portuguese posts data helper**

Create `app/pt/posts/get-posts.ts`:

```ts
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
    list: await getPageMap('/pt/posts'),
    route: '/pt/posts'
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
```

- [ ] **Step 2: Create the Portuguese posts listing page**

Create `app/pt/posts/page.tsx`:

```tsx
import Link from 'next/link'
import { PostCard } from 'nextra-theme-blog'
import { Badge } from '@/components/ui/badge'
import { getPosts, getTags } from './get-posts'

export const metadata = {
  title: 'Posts'
}

export default async function PostsPagePt() {
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
          <Link key={tag} href={`/pt/tags/${tag}/`}>
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
```

- [ ] **Step 3: Create the English posts data helper**

Create `app/en/posts/get-posts.ts` (identical to the Portuguese one, scoped to `/en/posts`):

```ts
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
```

- [ ] **Step 4: Create the English posts listing page**

Create `app/en/posts/page.tsx`:

```tsx
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
```

- [ ] **Step 5: Build and verify both listing pages**

```bash
pnpm build
grep -o 'exemplo-primeiro-post' out/pt/posts/index.html
grep -o 'aprendizado' out/pt/posts/index.html
grep -o 'example-first-post' out/en/posts/index.html
grep -o 'learning' out/en/posts/index.html
```

Expected: each `grep` prints the matched text.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Add posts listing pages with tag badges for pt and en"
```

---

### Task 5: Tag filter pages (pt + en)

**Files:**
- Create: `app/pt/tags/[tag]/page.tsx`
- Create: `app/en/tags/[tag]/page.tsx`

**Interfaces:**
- Consumes: `getPosts`, `getTags`, `Post` from `../../posts/get-posts` (Task 4).

- [ ] **Step 1: Create the Portuguese tag page**

Create `app/pt/tags/[tag]/page.tsx`:

```tsx
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
```

- [ ] **Step 2: Create the English tag page**

Create `app/en/tags/[tag]/page.tsx`:

```tsx
import { PostCard } from 'nextra-theme-blog'
import { getPosts, getTags } from '../../posts/get-posts'

type PageProps = Readonly<{
  params: Promise<{ tag: string }>
}>

export async function generateMetadata(props: PageProps) {
  const params = await props.params
  return {
    title: `Posts tagged with "${decodeURIComponent(params.tag)}"`
  }
}

export async function generateStaticParams() {
  const allTags = await getTags()
  return [...new Set(allTags)].map(tag => ({ tag }))
}

export default async function TagPageEn(props: PageProps) {
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
```

- [ ] **Step 3: Build and verify tag pages are statically generated**

```bash
pnpm build
grep -o 'exemplo-primeiro-post' out/pt/tags/aprendizado/index.html
grep -o 'example-first-post' out/en/tags/learning/index.html
```

Expected: each `grep` prints the matched text.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Add per-tag filter pages for pt and en"
```

---

### Task 6: RSS feed routes (pt + en)

**Files:**
- Create: `app/pt/rss.xml/route.ts`
- Create: `app/en/rss.xml/route.ts`

**Interfaces:**
- Consumes: `getPosts` from `../posts/get-posts` (Task 4).

- [ ] **Step 1: Create the Portuguese RSS route**

Create `app/pt/rss.xml/route.ts`:

```ts
import { getPosts } from '../posts/get-posts'

const CONFIG = {
  title: 'Blog Pessoal (PT)',
  siteUrl: 'https://ermerson.github.io/pt',
  description: 'Últimos posts do blog',
  lang: 'pt-br'
}

export async function GET() {
  const allPosts = await getPosts()
  const items = allPosts
    .map(
      post => `    <item>
        <title>${post.frontMatter.title}</title>
        <description>${post.frontMatter.description ?? ''}</description>
        <link>${CONFIG.siteUrl}${post.route}/</link>
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
```

- [ ] **Step 2: Create the English RSS route**

Create `app/en/rss.xml/route.ts`:

```ts
import { getPosts } from '../posts/get-posts'

const CONFIG = {
  title: 'Personal Blog (EN)',
  siteUrl: 'https://ermerson.github.io/en',
  description: 'Latest blog posts',
  lang: 'en-us'
}

export async function GET() {
  const allPosts = await getPosts()
  const items = allPosts
    .map(
      post => `    <item>
        <title>${post.frontMatter.title}</title>
        <description>${post.frontMatter.description ?? ''}</description>
        <link>${CONFIG.siteUrl}${post.route}/</link>
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
```

- [ ] **Step 3: Build and verify both feeds**

```bash
pnpm build
grep -o 'Blog Pessoal (PT)' out/pt/rss.xml
grep -o 'Meu primeiro post' out/pt/rss.xml
grep -o 'Personal Blog (EN)' out/en/rss.xml
grep -o 'My first post' out/en/rss.xml
```

Expected: each `grep` prints the matched text.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Add RSS feed routes for pt and en"
```

---

### Task 7: Home, About, locale switcher, and root redirect

**Files:**
- Create: `components/site/locale-switcher.tsx`
- Create: `app/pt/page.tsx`
- Create: `app/pt/about/page.tsx`
- Create: `app/en/page.tsx`
- Create: `app/en/about/page.tsx`
- Modify: `app/page.tsx` (replace the Task 2 smoke test with the real root redirect)
- Modify: `app/layout.tsx` (add the locale switcher to the Navbar)

**Interfaces:**
- Consumes: `Button`, `DropdownMenu*` from `@/components/ui/*` (Task 2).
- Produces: `LocaleSwitcher` component, wired into the shared Navbar from Task 3.

- [ ] **Step 1: Create the locale switcher**

Create `components/site/locale-switcher.tsx`:

```tsx
'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const LOCALES = [
  { code: 'pt', label: 'Português', href: '/pt/' },
  { code: 'en', label: 'English', href: '/en/' }
] as const

export function LocaleSwitcher() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          data-testid="locale-switcher-trigger"
        >
          Idioma / Language
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALES.map(locale => (
          <DropdownMenuItem key={locale.code} asChild>
            <Link href={locale.href}>{locale.label}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

- [ ] **Step 2: Wire the locale switcher into the Navbar**

In `app/layout.tsx`, add the import:

```tsx
import { LocaleSwitcher } from '@/components/site/locale-switcher'
```

And add `<LocaleSwitcher />` inside `<Navbar>`, after `<ThemeSwitch />`:

```tsx
          <Navbar pageMap={await getPageMap()}>
            <Search />
            <ThemeSwitch />
            <LocaleSwitcher />
          </Navbar>
```

- [ ] **Step 3: Create the Portuguese home page**

Create `app/pt/page.tsx`:

```tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Início'
}

export default function HomePagePt() {
  return (
    <div className="not-prose mx-auto flex max-w-2xl flex-col items-start gap-6 py-12">
      <h1 className="text-4xl font-bold">Blog Pessoal</h1>
      <p className="text-lg text-muted-foreground">
        Anotações e aprendizados sobre programação, publicados enquanto
        aprendo.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/pt/posts/">Ver posts</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/pt/about/">Sobre</Link>
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create the Portuguese about page**

Create `app/pt/about/page.tsx`:

```tsx
export const metadata = {
  title: 'Sobre'
}

export default function AboutPagePt() {
  return (
    <div className="not-prose mx-auto flex max-w-2xl flex-col gap-4 py-12">
      <h1 className="text-3xl font-bold">Sobre</h1>
      <p>
        Este blog reúne anotações e aprendizados sobre programação, escritos
        enquanto estudo novos assuntos.
      </p>
    </div>
  )
}
```

- [ ] **Step 5: Create the English home page**

Create `app/en/page.tsx`:

```tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Home'
}

export default function HomePageEn() {
  return (
    <div className="not-prose mx-auto flex max-w-2xl flex-col items-start gap-6 py-12">
      <h1 className="text-4xl font-bold">Personal Blog</h1>
      <p className="text-lg text-muted-foreground">
        Notes and learnings about programming, published as I learn.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/en/posts/">View posts</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/en/about/">About</Link>
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Create the English about page**

Create `app/en/about/page.tsx`:

```tsx
export const metadata = {
  title: 'About'
}

export default function AboutPageEn() {
  return (
    <div className="not-prose mx-auto flex max-w-2xl flex-col gap-4 py-12">
      <h1 className="text-3xl font-bold">About</h1>
      <p>
        This blog collects notes and learnings about programming, written as
        I study new topics.
      </p>
    </div>
  )
}
```

- [ ] **Step 7: Replace the root page with the locale redirect**

Replace `app/page.tsx` entirely:

```tsx
'use client'

import { useEffect } from 'react'

export default function RootRedirectPage() {
  useEffect(() => {
    window.location.replace('/pt/')
  }, [])

  return (
    <div className="not-prose flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <p>Redirecionando para a versão em português...</p>
      <a href="/pt/" className="underline">
        Clique aqui se não for redirecionado automaticamente
      </a>
    </div>
  )
}
```

- [ ] **Step 8: Build and verify everything**

```bash
pnpm build
grep -o 'Clique aqui se não for redirecionado' out/index.html
grep -o 'href="/pt/"' out/index.html
grep -o 'Blog Pessoal' out/pt/index.html
grep -o 'Este blog reúne anotações' out/pt/about/index.html
grep -o 'Personal Blog' out/en/index.html
grep -o 'This blog collects notes' out/en/about/index.html
grep -o 'data-testid="locale-switcher-trigger"' out/pt/index.html
```

Expected: each `grep` prints the matched text.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Add home/about pages, locale switcher, and root redirect"
```

---

### Task 8: CI workflow (lint + build on pull requests)

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create the CI workflow**

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  lint-and-build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v7

      - name: Setup pnpm
        uses: pnpm/action-setup@v6

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version: 24
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Build
        run: pnpm build
```

- [ ] **Step 2: Verify the YAML is well-formed**

```bash
pnpm dlx js-yaml .github/workflows/ci.yml > /dev/null && echo "OK: ci.yml is valid YAML"
```

Expected output: `OK: ci.yml is valid YAML`

- [ ] **Step 3: Verify the exact commands it runs still work locally**

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm build
```

Expected: all three exit `0`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Add CI workflow: lint and build on pull requests"
```

---

### Task 9: Deploy workflow, GitHub Pages settings, and README

**Files:**
- Create: `.github/workflows/deploy.yml`
- Modify: `README.md`

- [ ] **Step 1: Create the deploy workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v7

      - name: Setup pnpm
        uses: pnpm/action-setup@v6

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version: 24
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Build
        run: pnpm build

      - name: Configure GitHub Pages
        uses: actions/configure-pages@v6

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v5
        with:
          path: out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

- [ ] **Step 2: Verify the YAML is well-formed**

```bash
pnpm dlx js-yaml .github/workflows/deploy.yml > /dev/null && echo "OK: deploy.yml is valid YAML"
```

Expected output: `OK: deploy.yml is valid YAML`

- [ ] **Step 3: Write the README**

Replace `README.md` with:

````markdown
# Blog Pessoal

Blog pessoal bilíngue (pt/en), construído com Next.js, Nextra (`nextra-theme-blog`) e shadcn/ui, publicado no GitHub Pages via GitHub Actions.

Site: https://ermerson.github.io

## Desenvolvimento local

```bash
pnpm install
pnpm dev
```

Abra http://localhost:3000 — a raiz redireciona para `/pt/`.

## Build de produção (export estático)

```bash
pnpm build
```

Gera o site estático em `out/`.

## Como escrever um novo post

1. Crie um arquivo `.mdx` em `content/pt/posts/` (português) e, se for traduzir, outro em `content/en/posts/` (inglês). Os nomes de arquivo não precisam ser iguais entre os dois idiomas.
2. Adicione o front matter no topo do arquivo:

   ```mdx
   ---
   title: Título do post
   date: 2026-07-05
   description: Uma frase descrevendo o post.
   tags: [tag1, tag2]
   ---
   ```

3. Escreva o conteúdo em Markdown/MDX abaixo do front matter. Use `<Note>...</Note>` para destacar um trecho em um card.
4. Rode `pnpm dev` para conferir localmente, depois abra um Pull Request — o workflow de CI roda lint e build automaticamente.

Se um post ainda não tem tradução, ele simplesmente não aparece na listagem daquele idioma (não há fallback automático).

## Deploy

Todo push em `main` dispara o workflow `.github/workflows/deploy.yml`, que builda o site e publica em `https://ermerson.github.io`.

**Configuração necessária no GitHub (uma única vez):** em Settings → Pages, defina "Build and deployment source" como **GitHub Actions**.
````

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Add GitHub Pages deploy workflow and README"
```

---

## Self-Review Notes

- **Spec coverage:** Stack & tooling → Tasks 1–2. Content structure & i18n (revised, duplicated route trees) → Tasks 3–6. Styling & shadcn/ui usage inside chrome and MDX → Tasks 2, 3, 4, 7. Deploy, GitHub Pages & CI/CD → Tasks 8–9. All spec sections have corresponding tasks.
- **Placeholder scan:** no TBD/TODO; every step has literal, complete code or commands.
- **Type consistency:** `Post` interface and `getPosts()`/`getTags()` signatures are identical across `app/pt/posts/get-posts.ts` and `app/en/posts/get-posts.ts` (Task 4), and consumed with matching import paths (`../../posts/get-posts`) by both tag pages (Task 5) and both RSS routes (Task 6). `LocaleSwitcher` (Task 7) has no props, matching its no-argument usage in `app/layout.tsx`.
- **Scope check:** single project, no independent subsystems — one plan is appropriate.
