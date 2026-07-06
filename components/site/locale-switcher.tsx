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
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            data-testid="locale-switcher-trigger"
          >
            Idioma / Language
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {LOCALES.map(locale => (
          <DropdownMenuItem
            key={locale.code}
            render={<Link href={locale.href}>{locale.label}</Link>}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
