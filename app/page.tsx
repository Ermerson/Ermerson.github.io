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
