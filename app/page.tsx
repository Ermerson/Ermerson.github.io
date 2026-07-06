'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function RootRedirectPage() {
  useEffect(() => {
    window.location.replace('/pt/')
  }, [])

  return (
    <div className="not-prose flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <p>Redirecionando para a versão em português...</p>
      <Link href="/pt/" className="underline">
        Clique aqui se não for redirecionado automaticamente
      </Link>
    </div>
  )
}
