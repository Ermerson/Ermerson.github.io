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
        <Button render={<Link href="/pt/posts/">Ver posts</Link>} />
        <Button
          variant="outline"
          render={<Link href="/pt/about/">Sobre</Link>}
        />
      </div>
    </div>
  )
}
