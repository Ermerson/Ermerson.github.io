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
