import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Footer, Layout, Navbar, ThemeSwitch } from 'nextra-theme-blog'
import { Head, Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { LocaleSwitcher } from '@/components/site/locale-switcher'
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
            <LocaleSwitcher />
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
